'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
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
  created_at: string;
}

export default function ApplicationsAdminPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
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
  };

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
        {/* Navigation */}
        <nav className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:opacity-80 transition">
              🎓 Echoverse
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-purple-600 hover:text-pink-600 font-medium transition">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-linear-to-r from-red-600 to-pink-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">Teacher Applications</h1>
            <p className="text-gray-600">Review and manage teacher applications</p>
          </div>

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
                          <p>
                            <span className="font-semibold text-gray-900">Phone:</span>{' '}
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
                            {new Date(selectedApplication.created_at).toLocaleDateString()} at{' '}
                            {new Date(selectedApplication.created_at).toLocaleTimeString()}
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
