'use client';

import React from 'react';
import Link from 'next/link';

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'reviewed' | 'contacted' | 'approved' | 'rejected';
  demo_recording_status: 'not_submitted' | 'pending_review' | 'approved' | 'rejected' | 'needs_revision';
  demo_recording_review_result?: string;
  demo_recording_submitted_date?: string;
  demo_recording_review_notes?: string;
  demo_recording_reviewed_date?: string;
  demo_recording_url?: string;
  created_at: string;
}

interface RecentApplicationsProps {
  applications: Application[];
  onViewAll: () => void;
  onOpenDemoRecordingModal: (applicationId?: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Received',
  reviewed: 'Under review',
  contacted: 'Contacted',
  approved: 'Approved',
  rejected: 'Not accepted',
};

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-yellow-100 text-yellow-800',
  reviewed: 'bg-blue-100 text-blue-800',
  contacted: 'bg-purple-100 text-purple-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const DEMO_RECORDING_STATUS_LABELS: Record<string, string> = {
  not_submitted: 'Not Submitted',
  pending_review: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  needs_revision: 'Needs Revision',
};

const DEMO_RECORDING_STATUS_COLORS: Record<string, string> = {
  not_submitted: 'bg-gray-100 text-gray-800',
  pending_review: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  needs_revision: 'bg-orange-100 text-orange-800',
};

export default function RecentApplications({ applications, onViewAll, onOpenDemoRecordingModal }: RecentApplicationsProps) {
  return (
    <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span>📋</span>
        Recent Applications
      </h3>
      {applications.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">📝</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">No applications yet</p>
          <p className="text-xs text-gray-500 mb-4">Submit your first application to get started with your teaching journey</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            <span>🚀</span>
            Submit Application
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.slice(0, 3).map((app) => (
            <div key={app.id} className="bg-white p-4 rounded-lg border border-gray-200">
              {/* Application Info */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-medium text-gray-900">{app.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  STATUS_COLORS[app.status] ?? 'bg-gray-100 text-gray-800'
                }`}>
                  {STATUS_LABELS[app.status] ?? app.status}
                </span>
              </div>
              
              {/* Demo Recording Status - Integrated */}
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Demo Recording:</span>
                    <div className={`w-2 h-2 rounded-full ${
                      app.demo_recording_status === 'pending_review' ? 'bg-yellow-400 animate-pulse' :
                      app.demo_recording_status === 'approved' ? 'bg-green-400' :
                      app.demo_recording_status === 'rejected' ? 'bg-red-400' :
                      app.demo_recording_status === 'needs_revision' ? 'bg-orange-400' :
                      'bg-gray-400'
                    }`}></div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      DEMO_RECORDING_STATUS_COLORS[app.demo_recording_status] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {DEMO_RECORDING_STATUS_LABELS[app.demo_recording_status] || app.demo_recording_status}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {app.demo_recording_status === 'not_submitted' && (
                      <button 
                        onClick={() => onOpenDemoRecordingModal(app.id)}
                        className="text-xs px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        📹 Submit
                      </button>
                    )}
                    {app.demo_recording_status === 'needs_revision' && (
                      <button 
                        onClick={() => onOpenDemoRecordingModal(app.id)}
                        className="text-xs px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                      >
                        🔄 Resubmit
                      </button>
                    )}
                    {app.demo_recording_url && (
                      <a 
                        href={app.demo_recording_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        🔗 View
                      </a>
                    )}
                  </div>
                </div>
                {app.demo_recording_submitted_date && (
                  <p className="text-xs text-gray-500 mt-1">
                    Submitted: {new Date(app.demo_recording_submitted_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {applications.length > 3 && (
        <button
          onClick={onViewAll}
          className="mt-4 text-sm font-medium text-purple-600 hover:text-purple-700"
        >
          View all applications →
        </button>
      )}
    </div>
  );
}
