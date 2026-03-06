'use client';

import React, { useState } from 'react';

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

interface ReviewDetailsProps {
  application: Application;
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
  not_submitted: 'bg-gray-100 text-gray-800 border-gray-300',
  pending_review: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  approved: 'bg-green-100 text-green-800 border-green-300',
  rejected: 'bg-red-100 text-red-800 border-red-300',
  needs_revision: 'bg-orange-100 text-orange-800 border-orange-300',
};

export default function ReviewDetails({ application, onOpenDemoRecordingModal }: ReviewDetailsProps) {
  const [showFullNotes, setShowFullNotes] = useState(false);

  const hasReviewData = 
    application.demo_recording_review_result || 
    application.demo_recording_review_notes || 
    application.demo_recording_reviewed_date;

  const shouldShowReviewSection = 
    application.demo_recording_status !== 'not_submitted' && hasReviewData;

  if (!shouldShowReviewSection) {
    return null;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-purple-200 transition-all duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <span className="text-purple-600 font-semibold">📋</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Review Details</h3>
          <p className="text-sm text-gray-500">
            Last reviewed: {application.demo_recording_reviewed_date 
              ? new Date(application.demo_recording_reviewed_date).toLocaleDateString('en-US', { 
                  timeZone: 'Asia/Manila',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true 
                })
              : 'Not reviewed yet'
            }
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Current Status:</span>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full border ${DEMO_RECORDING_STATUS_COLORS[
              application.demo_recording_status || 'not_submitted'
            ]}`}
          >
            {DEMO_RECORDING_STATUS_LABELS[application.demo_recording_status || 'not_submitted']}
          </span>
        </div>

        {/* Submitted Date */}
        {application.demo_recording_submitted_date && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">Submitted Date</p>
            <p className="text-sm text-gray-900">
              {new Date(application.demo_recording_submitted_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}

        {/* Review Result */}
        {application.demo_recording_review_result && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-600 font-semibold">📝</span>
              <p className="text-sm font-semibold text-blue-900">Review Result</p>
            </div>
            <p className="text-sm text-blue-800 leading-relaxed">
              {application.demo_recording_review_result}
            </p>
          </div>
        )}

        {/* Review Notes */}
        {application.demo_recording_review_notes && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-600 font-semibold">📝</span>
              <p className="text-sm font-semibold text-amber-900">Review Notes</p>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed">
              {showFullNotes || application.demo_recording_review_notes.length <= 200
                ? application.demo_recording_review_notes
                : `${application.demo_recording_review_notes.substring(0, 200)}...`
              }
            </p>
            {application.demo_recording_review_notes.length > 200 && (
              <button
                onClick={() => setShowFullNotes(!showFullNotes)}
                className="mt-2 text-xs font-medium text-amber-700 hover:text-amber-800 underline"
              >
                {showFullNotes ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>
        )}

        {/* Demo Recording URL */}
        {application.demo_recording_url && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-600 font-semibold">🔗</span>
              <p className="text-sm font-semibold text-green-900">Your Demo Recording</p>
            </div>
            <a 
              href={application.demo_recording_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-800 hover:text-green-900 text-sm font-medium flex items-center gap-2 underline"
            >
              View Demo Recording
              <span className="text-xs">↗</span>
            </a>
          </div>
        )}

        {/* Action Buttons */}
        {(application.demo_recording_status === 'needs_revision' || application.demo_recording_status === 'rejected') && (
          <div className="pt-4 border-t border-gray-200">
            <button 
              onClick={() => onOpenDemoRecordingModal(application.id)}
              className="w-full px-4 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <span>{application.demo_recording_status === 'needs_revision' ? '🔄' : '📹'}</span>
              {application.demo_recording_status === 'needs_revision' ? 'Resubmit Demo Recording' : 'Submit New Demo Recording'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
