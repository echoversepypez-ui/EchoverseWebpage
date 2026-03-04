'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  user_id: string;
  bio?: string;
  location?: string;
  headline?: string;
  skills?: string[];
  profile_image_url?: string;
  experience_years?: number;
  company?: string;
  job_title?: string;
  profile_completion_percentage: number;
  is_profile_public: boolean;
}

interface Connection {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'blocked';
  message?: string;
  created_at: string;
  responded_at?: string;
  requester_profile?: UserProfile;
  recipient_profile?: UserProfile;
}

interface NetworkingSectionProps {
  currentUserId: string;
}

export default function NetworkingSection({ currentUserId }: NetworkingSectionProps) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'connections' | 'suggestions' | 'requests'>('connections');
  const [connectionMessage, setConnectionMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);

  const loadConnections = useCallback(async () => {
    try {
      console.log('Loading connections for user:', currentUserId);
      const { data, error } = await supabase
        .from('user_connections')
        .select(`
          *,
          requester_profile:user_profiles!user_connections_requester_id_fkey(*),
          recipient_profile:user_profiles!user_connections_recipient_id_fkey(*)
        `)
        .or(`requester_id.eq.${currentUserId},recipient_id.eq.${currentUserId}`)
        .eq('status', 'accepted')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error in loadConnections:', error);
        throw error;
      }
      console.log('Connections loaded successfully:', data?.length || 0);
      setConnections(data || []);
    } catch (error) {
      console.error('loadConnections failed:', error);
      throw error;
    }
  }, [currentUserId]);

  const loadSuggestedUsers = useCallback(async () => {
    try {
      console.log('Loading suggested users for:', currentUserId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .neq('user_id', currentUserId)
        .eq('is_profile_public', true)
        .not('user_id', 'in', 
          `(SELECT recipient_id FROM user_connections WHERE requester_id = '${currentUserId}')`
        )
        .order('profile_completion_percentage', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error in loadSuggestedUsers:', error);
        throw error;
      }
      console.log('Suggested users loaded successfully:', data?.length || 0);
      setSuggestedUsers(data || []);
    } catch (error) {
      console.error('loadSuggestedUsers failed:', error);
      throw error;
    }
  }, [currentUserId]);

  const loadNetworkingData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadConnections(),
        loadSuggestedUsers()
      ]);
    } catch (error) {
      console.error('Error loading networking data:', error instanceof Error ? error.message : error);
    } finally {
      setLoading(false);
    }
  }, [loadConnections, loadSuggestedUsers]);

  useEffect(() => {
    loadNetworkingData();
  }, [loadNetworkingData]);

  const sendConnectionRequest = async (recipientId: string) => {
    if (!connectionMessage.trim()) {
      alert('Please add a personal message to your connection request.');
      return;
    }

    setSendingRequest(true);
    try {
      const { error } = await supabase
        .from('user_connections')
        .insert({
          requester_id: currentUserId,
          recipient_id: recipientId,
          status: 'pending',
          message: connectionMessage.trim()
        });

      if (error) throw error;

      // Record activity
      await supabase
        .from('connection_activities')
        .insert({
          connection_id: crypto.randomUUID(), // This would need to be properly handled
          actor_id: currentUserId,
          activity_type: 'request_sent',
          metadata: { recipient_id: recipientId }
        });

      setShowRequestModal(false);
      setConnectionMessage('');
      setSelectedUser(null);
      loadSuggestedUsers(); // Refresh suggestions
      alert('Connection request sent!');
    } catch (error) {
      console.error('Error sending connection request:', error);
      alert('Failed to send connection request. Please try again.');
    } finally {
      setSendingRequest(false);
    }
  };

  const acceptConnectionRequest = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('user_connections')
        .update({ status: 'accepted' })
        .eq('id', connectionId);

      if (error) throw error;
      loadConnections();
    } catch (error) {
      console.error('Error accepting connection:', error);
      alert('Failed to accept connection request.');
    }
  };

  const declineConnectionRequest = async (connectionId: string) => {
    try {
      const { error } = await supabase
        .from('user_connections')
        .update({ status: 'declined' })
        .eq('id', connectionId);

      if (error) throw error;
      loadConnections();
    } catch (error) {
      console.error('Error declining connection:', error);
      alert('Failed to decline connection request.');
    }
  };

  const pendingRequests = connections.filter(
    conn => conn.status === 'pending' && conn.recipient_id === currentUserId
  );

  const getProfileForConnection = (connection: Connection) => {
    return connection.requester_id === currentUserId 
      ? connection.recipient_profile 
      : connection.requester_profile;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Network</h2>
        <p className="text-gray-600">Connect with other professionals in the Echoverse community</p>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {connections.filter(c => c.status === 'accepted').length}
            </div>
            <div className="text-sm text-gray-600">Connections</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {pendingRequests.length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {suggestedUsers.length}
            </div>
            <div className="text-sm text-gray-600">Suggestions</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { key: 'connections', label: 'My Connections', count: connections.filter(c => c.status === 'accepted').length },
              { key: 'requests', label: 'Requests', count: pendingRequests.length },
              { key: 'suggestions', label: 'Suggestions', count: suggestedUsers.length }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'connections' | 'requests' | 'suggestions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Connections Tab */}
          {activeTab === 'connections' && (
            <div className="space-y-4">
              {connections.filter(c => c.status === 'accepted').length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-5xl mb-4">🤝</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No connections yet</h3>
                  <p className="text-gray-600">Start building your network by connecting with other professionals.</p>
                </div>
              ) : (
                connections
                  .filter(c => c.status === 'accepted')
                  .map(connection => {
                    const profile = getProfileForConnection(connection);
                    if (!profile) return null;
                    
                    return (
                      <div key={connection.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          {profile.profile_image_url ? (
                            <img 
                              src={profile.profile_image_url} 
                              alt={profile.headline || 'Profile'} 
                              className="h-12 w-12 rounded-full object-cover"
                              width={48}
                              height={48}
                            />
                          ) : (
                            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-semibold">
                                {profile.headline?.[0] || 'U'}
                              </span>
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900">{profile.headline || 'Professional'}</h4>
                            <p className="text-sm text-gray-600">{profile.job_title || 'No title'}</p>
                            {profile.company && (
                              <p className="text-sm text-gray-500">{profile.company}</p>
                            )}
                            {profile.location && (
                              <p className="text-xs text-gray-500 mt-1">📍 {profile.location}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {profile.skills && profile.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {profile.skills.slice(0, 3).map((skill, i) => (
                                <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                                  {skill}
                                </span>
                              ))}
                              {profile.skills.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  +{profile.skills.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-5xl mb-4">📬</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
                  <p className="text-gray-600">You&apos;ll see connection requests here when others want to connect with you.</p>
                </div>
              ) : (
                pendingRequests.map(connection => (
                  <div key={connection.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {connection.requester_profile?.profile_image_url ? (
                          <img 
                            src={connection.requester_profile.profile_image_url} 
                            alt={connection.requester_profile.headline || 'Profile'} 
                            className="h-12 w-12 rounded-full object-cover"
                            width={48}
                            height={48}
                          />
                        ) : (
                          <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-semibold">
                              {connection.requester_profile?.headline?.[0] || 'U'}
                            </span>
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {connection.requester_profile?.headline || 'Professional'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {connection.requester_profile?.job_title || 'No title'}
                          </p>
                          {connection.message && (
                            <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-3 rounded">
                              &quot;{connection.message}&quot;
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            Requested {new Date(connection.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => acceptConnectionRequest(connection.id)}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => declineConnectionRequest(connection.id)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              {suggestedUsers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-5xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No suggestions available</h3>
                  <p className="text-gray-600">Check back later for new professionals to connect with.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestedUsers.map(user => (
                    <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        {user.profile_image_url ? (
                          <img 
                            src={user.profile_image_url} 
                            alt={user.profile_image_url} 
                            className="h-12 w-12 rounded-full object-cover"
                            width={48}
                            height={48}
                          />
                        ) : (
                          <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-semibold">
                              {user.headline?.[0] || 'U'}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{user.headline || 'Professional'}</h4>
                          <p className="text-sm text-gray-600">{user.job_title || 'No title'}</p>
                          {user.company && (
                            <p className="text-sm text-gray-500">{user.company}</p>
                          )}
                          {user.location && (
                            <p className="text-xs text-gray-500 mt-1">📍 {user.location}</p>
                          )}
                          {user.bio && (
                            <p className="text-sm text-gray-700 mt-2 line-clamp-2">{user.bio}</p>
                          )}
                          {user.skills && user.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {user.skills.slice(0, 3).map((skill, i) => (
                                <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                                  {skill}
                                </span>
                              ))}
                              {user.skills.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                  +{user.skills.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              Profile {user.profile_completion_percentage}% complete
                            </div>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowRequestModal(true);
                              }}
                              className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                            >
                              Connect
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Connection Request Modal */}
      {showRequestModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center space-x-4 mb-4">
              {selectedUser.profile_image_url ? (
                <img 
                  src={selectedUser.profile_image_url} 
                  alt={selectedUser.headline || 'Profile'} 
                  className="h-16 w-16 rounded-full object-cover"
                  width={64}
                  height={64}
                />
              ) : (
                <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-xl">
                    {selectedUser.headline?.[0] || 'U'}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedUser.headline || 'Professional'}
                </h3>
                <p className="text-sm text-gray-600">{selectedUser.job_title || 'No title'}</p>
                {selectedUser.company && (
                  <p className="text-sm text-gray-500">{selectedUser.company}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Personal Message (required)
              </label>
              <textarea
                value={connectionMessage}
                onChange={(e) => setConnectionMessage(e.target.value)}
                placeholder="Hi! I&apos;d like to connect with you because..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                rows={4}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRequestModal(false);
                  setSelectedUser(null);
                  setConnectionMessage('');
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => sendConnectionRequest(selectedUser.user_id)}
                disabled={sendingRequest || !connectionMessage.trim()}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 font-medium"
              >
                {sendingRequest ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
