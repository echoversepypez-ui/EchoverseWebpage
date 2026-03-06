'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AdminHeader } from '@/components/AdminHeader';
import { ProtectedRoute } from '@/components/protected-route';
import { supabase } from '@/lib/supabase';

interface Application {
  id: string;
  name: string;
  age: string;
  email: string;
  phone: string;
  address: string;
  educational_attainment: string;
  university_school: string;
  teaching_experience: string;
  certificates: string;
  board_exam: string;
  board_exam_date: string;
  deped_ranking: string;
  currently_working: string;
  job_details: string;
  preferred_hours: string;
  residing_antique: string;
  agreed_to_terms: boolean;
  status: 'new' | 'reviewed' | 'contacted' | 'approved' | 'rejected';
  demo_recording_status: 'not_submitted' | 'pending_review' | 'approved' | 'rejected' | 'needs_revision';
  demo_recording_review_result?: string;
  demo_recording_submitted_date?: string;
  demo_recording_review_notes?: string;
  demo_recording_reviewed_by?: string;
  demo_recording_reviewed_date?: string;
  demo_recording_url?: string;
  created_at: string;
}

interface DemoRecordingUpdateData {
  demo_recording_status: Application['demo_recording_status'];
  demo_recording_review_result?: string;
  demo_recording_review_notes?: string;
  demo_recording_submitted_date?: string;
  demo_recording_reviewed_date?: string;
}

export default function ApplicationsAdminPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [localReviewResult, setLocalReviewResult] = useState('');
  const [localReviewNotes, setLocalReviewNotes] = useState('');
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Define loadApplications first since it's used as a dependency
  const loadApplications = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDemoRecordingStatus = useCallback(async (id: string, newStatus: Application['demo_recording_status'], reviewData?: {
    review_result?: string;
    review_notes?: string;
    submitted_date?: string;
  }) => {
    try {
      const updateData: DemoRecordingUpdateData = { demo_recording_status: newStatus };
      
      if (reviewData) {
        if (reviewData.review_result !== undefined) updateData.demo_recording_review_result = reviewData.review_result;
        if (reviewData.review_notes !== undefined) updateData.demo_recording_review_notes = reviewData.review_notes;
        if (reviewData.submitted_date !== undefined) updateData.demo_recording_submitted_date = reviewData.submitted_date;
      }
      
      // Add reviewer info and timestamp when status is being reviewed
      if (newStatus !== 'not_submitted' && newStatus !== 'pending_review') {
        updateData.demo_recording_reviewed_date = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', id);
      if (error) throw error;
      loadApplications();
      if (selectedApplication?.id === id) {
        setSelectedApplication({ ...selectedApplication, ...updateData });
      }
    } catch (error) {
      console.error('Error updating demo recording status:', error);
    }
  }, [selectedApplication, loadApplications]);

  const debouncedSave = useCallback((id: string, status: Application['demo_recording_status'], reviewData: {
    review_result?: string;
    review_notes?: string;
  }) => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    
    const timeout = setTimeout(() => {
      updateDemoRecordingStatus(id, status, reviewData);
    }, 1000); // Save after 1 second of inactivity
    
    setSaveTimeout(timeout);
  }, [saveTimeout, updateDemoRecordingStatus]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  useEffect(() => {
    if (selectedApplication) {
      setLocalReviewResult(selectedApplication.demo_recording_review_result || '');
      setLocalReviewNotes(selectedApplication.demo_recording_review_notes || '');
    }
  }, [selectedApplication]);

  const updateStatus = async (id: string, newStatus: Application['status']) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      loadApplications();
      if (selectedApplication?.id === id) {
        setSelectedApplication({ ...selectedApplication, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteApplication = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    try {
      const { error } = await supabase.from('applications').delete().eq('id', id);
      if (error) throw error;
      loadApplications();
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getDemoRecordingStatusColor = (status: string) => {
    switch (status) {
      case 'not_submitted':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'pending_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'needs_revision':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'contacted':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(app => app.status === filterStatus);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-purple-50">
        <AdminHeader 
          title="📋 Teacher Applications" 
          subtitle="Review and manage teacher applications"
          backHref="/admin/dashboard"
        />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {loading ? (
            <div className="text-center text-gray-600 py-12 text-lg">Loading...</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {/* List */}
              <div className="md:col-span-1 bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
                <div className="bg-linear-to-r from-purple-600 to-pink-600 text-white p-4">
                  <h2 className="text-lg font-bold">📋 Applications ({filteredApplications.length})</h2>
                  <div className="mt-3 flex gap-2">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="flex-1 px-2 py-1 rounded text-sm text-gray-900 bg-white"
                    >
                      <option value="all">All</option>
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="contacted">Contacted</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
                <div className="divide-y max-h-96 overflow-y-auto">
                  {filteredApplications.length === 0 ? (
                    <div className="p-4 text-center text-gray-600">No applications</div>
                  ) : (
                    filteredApplications.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => setSelectedApplication(app)}
                        className={`w-full text-left p-4 hover:bg-purple-50 transition border-l-4 ${
                          selectedApplication?.id === app.id
                            ? 'border-purple-500 bg-purple-50'
                            : app.status === 'new'
                              ? 'border-yellow-400'
                              : app.status === 'approved'
                                ? 'border-green-400'
                                : app.status === 'rejected'
                                  ? 'border-red-400'
                                  : 'border-purple-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 text-sm truncate">{app.name}</div>
                        <div className="text-gray-600 text-xs truncate">{app.phone}</div>
                        <span
                          className={`inline-block mt-1 px-2 py-1 text-xs font-semibold rounded border ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Detail View */}
              <div className="md:col-span-2">
                {selectedApplication ? (
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedApplication.name}</h2>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>
                            <span className="font-semibold text-gray-900">Age:</span> {selectedApplication.age}
                          </p>
                          <p>                          <span className="font-semibold text-gray-900">Email:</span>{' '}
                          <a
                            href={`mailto:${selectedApplication.email}`}
                            className="text-purple-600 hover:text-pink-600 transition font-medium"
                          >
                            {selectedApplication.email}
                          </a>
                        </p>
                        <p>                            <span className="font-semibold text-gray-900">Phone:</span>{' '}
                            <a
                              href={`tel:${selectedApplication.phone}`}
                              className="text-purple-600 hover:text-pink-600 transition font-medium"
                            >
                              {selectedApplication.phone}
                            </a>
                          </p>
                          <p>
                            <span className="font-semibold text-gray-900">Address:</span> {selectedApplication.address}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-900">Date Applied:</span>{' '}
                            {new Date(selectedApplication.created_at).toLocaleDateString('en-US', { 
                              timeZone: 'Asia/Manila',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </p>
                          <p>
                            <span className="font-semibold text-gray-900">Agreed to Terms:</span>
                            <span
                              className={`ml-2 inline-block px-2 py-1 rounded text-xs font-semibold ${
                                selectedApplication.agreed_to_terms
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {selectedApplication.agreed_to_terms ? '✓ Yes' : '✗ No'}
                            </span>
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded border ${getStatusColor(
                          selectedApplication.status
                        )}`}
                      >
                        {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                      </span>
                    </div>

                    <div className="mb-6 pb-6 border-b-2 border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-3 text-lg">Education & Experience</h3>
                      <div className="space-y-3 text-sm text-gray-700">
                        <p>
                          <span className="font-semibold">Educational Attainment:</span> {selectedApplication.educational_attainment}
                        </p>
                        <p>
                          <span className="font-semibold">University/School:</span> {selectedApplication.university_school}
                        </p>
                        <p>
                          <span className="font-semibold">Teaching Experience:</span> {selectedApplication.teaching_experience}
                        </p>
                        <p>
                          <span className="font-semibold">Certificates:</span> {selectedApplication.certificates}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6 pb-6 border-b-2 border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-3 text-lg">Work Details</h3>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p>
                          <span className="font-semibold">Board Exam:</span> {selectedApplication.board_exam}
                          {selectedApplication.board_exam === 'yes' && selectedApplication.board_exam_date && (
                            <span> - {selectedApplication.board_exam_date}</span>
                          )}
                        </p>
                        <p>
                          <span className="font-semibold">DepEd Ranking Applied:</span> {selectedApplication.deped_ranking}
                        </p>
                        <p>
                          <span className="font-semibold">Currently Working:</span> {selectedApplication.currently_working}
                          {selectedApplication.currently_working === 'yes' && selectedApplication.job_details && (
                            <span> - {selectedApplication.job_details}</span>
                          )}
                        </p>
                        <p>
                          <span className="font-semibold">Preferred Hours:</span> {selectedApplication.preferred_hours}
                        </p>
                        <p>
                          <span className="font-semibold">Residing in Antique:</span> {selectedApplication.residing_antique}
                        </p>
                      </div>
                    </div>

                    {/* Demo Recording Management Section */}
                    <div className="mb-6 pb-6 border-b-2 border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
                        📹 Demo Recording Management
                      </h3>
                      
                      <div className="space-y-4">
                        {/* Current Status Display */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-900">Current Status:</span>
                            <span
                              className={`px-3 py-1 text-sm font-semibold rounded border ${getDemoRecordingStatusColor(
                                selectedApplication.demo_recording_status || 'not_submitted'
                              )}`}
                            >
                              {(selectedApplication.demo_recording_status || 'not_submitted').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                        </div>

                        {/* Submitted Date */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Submitted Date
                            </label>
                            <input
                              type="date"
                              value={selectedApplication.demo_recording_submitted_date?.split('T')[0] || ''}
                              onChange={(e) => updateDemoRecordingStatus(selectedApplication.id, selectedApplication.demo_recording_status, {
                                submitted_date: e.target.value ? new Date(e.target.value).toISOString() : undefined
                              })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                          
                          {/* Demo Recording URL */}
                          {selectedApplication.demo_recording_url && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Demo Recording URL
                              </label>
                              <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg">
                                <a 
                                  href={selectedApplication.demo_recording_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm truncate block"
                                  title={selectedApplication.demo_recording_url}
                                >
                                  🔗 {selectedApplication.demo_recording_url}
                                </a>
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Review Result
                            </label>
                            <input
                              type="text"
                              value={localReviewResult}
                              onChange={(e) => {
                                setLocalReviewResult(e.target.value);
                                debouncedSave(selectedApplication.id, selectedApplication.demo_recording_status, {
                                  review_result: e.target.value
                                });
                              }}
                              placeholder="e.g., Approved - Excellent performance"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                          </div>
                        </div>

                        {/* Review Notes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Review Notes
                          </label>
                          <textarea
                            value={localReviewNotes}
                            onChange={(e) => {
                              setLocalReviewNotes(e.target.value);
                              debouncedSave(selectedApplication.id, selectedApplication.demo_recording_status, {
                                review_notes: e.target.value
                              });
                            }}
                            placeholder="Enter detailed review notes here..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </div>

                        {/* Status Update Buttons */}
                        <div className="flex gap-3 flex-wrap pt-4 border-t">
                          <button
                            onClick={() => updateDemoRecordingStatus(selectedApplication.id, 'pending_review')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${
                              selectedApplication.demo_recording_status === 'pending_review'
                                ? 'bg-yellow-600 text-white shadow-lg'
                                : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            }`}
                          >
                            ⏳ Mark as Pending Review
                          </button>
                          <button
                            onClick={() => updateDemoRecordingStatus(selectedApplication.id, 'approved')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${
                              selectedApplication.demo_recording_status === 'approved'
                                ? 'bg-green-600 text-white shadow-lg'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            ✓ Approve Recording
                          </button>
                          <button
                            onClick={() => updateDemoRecordingStatus(selectedApplication.id, 'rejected')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${
                              selectedApplication.demo_recording_status === 'rejected'
                                ? 'bg-red-600 text-white shadow-lg'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                          >
                            ✗ Reject Recording
                          </button>
                          <button
                            onClick={() => updateDemoRecordingStatus(selectedApplication.id, 'needs_revision')}
                            className={`px-4 py-2 rounded-lg font-semibold transition ${
                              selectedApplication.demo_recording_status === 'needs_revision'
                                ? 'bg-orange-600 text-white shadow-lg'
                                : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            }`}
                          >
                            🔄 Request Revision
                          </button>
                        </div>

                        {/* Review Information */}
                        {selectedApplication.demo_recording_reviewed_date && (
                          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-900">
                              <strong>Last Reviewed:</strong> {new Date(selectedApplication.demo_recording_reviewed_date).toLocaleDateString('en-US', { 
                                timeZone: 'Asia/Manila',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true 
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3 flex-wrap">
                      <button
                        onClick={() => updateStatus(selectedApplication.id, 'reviewed')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          selectedApplication.status === 'reviewed'
                            ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        ✓ Mark as Reviewed
                      </button>
                      <button
                        onClick={() => updateStatus(selectedApplication.id, 'contacted')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          selectedApplication.status === 'contacted'
                            ? 'bg-linear-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
                      >
                        📞 Mark as Contacted
                      </button>
                      <button
                        onClick={() => updateStatus(selectedApplication.id, 'approved')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          selectedApplication.status === 'approved'
                            ? 'bg-green-600 text-white shadow-lg'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => updateStatus(selectedApplication.id, 'rejected')}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${
                          selectedApplication.status === 'rejected'
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        ✗ Reject
                      </button>
                      <button
                        onClick={() => deleteApplication(selectedApplication.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition ml-auto"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-12 text-center text-gray-600 border border-purple-100">
                    <p className="text-lg font-medium">Select an application to view details</p>
                    <p className="text-sm mt-2">Choose an application from the list on the left</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
