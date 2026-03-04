'use client';

import React from 'react';

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

interface DemoRecordingStatusProps {
  applications: Application[];
  onOpenDemoRecordingModal: (applicationId?: string) => void;
}

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

export default function DemoRecordingStatus({ applications, onOpenDemoRecordingModal }: DemoRecordingStatusProps) {
  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span>📹</span>
        Demo Recording Status
      </h3>
      {applications.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">📹</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">No demo recording submitted yet</p>
          <p className="text-xs text-gray-500 mb-4">Submit your application first to begin the demo recording process</p>
          <button 
            onClick={() => onOpenDemoRecordingModal()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <span>📹</span>
            Submit Demo Recording
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.slice(0, 3).map((app) => (
            <div key={app.id} className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">Demo Recording</p>
                  <p className="text-xs text-gray-500 mb-2">
                    {app.demo_recording_submitted_date 
                      ? `Submitted ${new Date(app.demo_recording_submitted_date).toLocaleDateString()}`
                      : 'Not submitted'
                    }
                  </p>
                  <div className="flex items-center gap-2">
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
                </div>
                <div className="flex flex-col gap-1">
                  {app.demo_recording_status === 'not_submitted' && (
                    <button 
                      onClick={() => onOpenDemoRecordingModal(app.id)}
                      className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                    >
                      Submit
                    </button>
                  )}
                  {app.demo_recording_status === 'needs_revision' && (
                    <button 
                      onClick={() => onOpenDemoRecordingModal(app.id)}
                      className="text-xs px-2 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
                    >
                      Resubmit
                    </button>
                  )}
                  {app.demo_recording_url && (
                    <a 
                      href={app.demo_recording_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
