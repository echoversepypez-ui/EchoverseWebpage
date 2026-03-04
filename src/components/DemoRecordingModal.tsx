'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface DemoRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId?: string;
  applicantEmail?: string;
  applicantName?: string;
  onSubmit: (data: { recordingUrl?: string; notes?: string; isOnsite?: boolean; applicationId?: string }) => void;
}

export default function DemoRecordingModal({ isOpen, onClose, applicationId, applicantEmail, applicantName, onSubmit }: DemoRecordingModalProps) {
  const [recordingUrl, setRecordingUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submissionType, setSubmissionType] = useState<'digital' | 'onsite'>('digital');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToProfileSharing, setAgreedToProfileSharing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate based on submission type
    if (submissionType === 'digital' && !recordingUrl.trim()) {
      alert('Please provide a demo recording URL or upload link.');
      return;
    }

    if (!agreedToProfileSharing) {
      alert('Please agree to the Profile Sharing Agreement to submit your demo recording.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (applicationId) {
        // Update existing application
        const updateData: {
          demo_recording_status: string;
          demo_recording_submitted_date: string;
          demo_recording_review_result: null;
          demo_recording_review_notes: string | null;
          demo_recording_url?: string;
        } = {
          demo_recording_status: 'pending_review',
          demo_recording_submitted_date: new Date().toISOString(),
          demo_recording_review_result: null,
          demo_recording_review_notes: notes || null
        };

        // Only include recording URL if it's a digital submission
        if (submissionType === 'digital') {
          updateData.demo_recording_url = recordingUrl;
        }

        const { error } = await supabase
          .from('applications')
          .update(updateData)
          .eq('id', applicationId);

        if (error) throw error;

        onSubmit({ 
          recordingUrl: submissionType === 'digital' ? recordingUrl : undefined,
          notes: notes || '',
          isOnsite: submissionType === 'onsite',
          applicationId: applicationId
        });
      } else {
        // Create new application record for demo recording only
        const { data, error } = await supabase
          .from('applications')
          .insert({
            name: applicantName || 'Demo Recording Applicant',
            email: applicantEmail || '',
            phone: '',
            address: '',
            educational_attainment: '',
            university_school: '',
            teaching_experience: '',
            certificates: '',
            board_exam: 'no',
            board_exam_date: '',
            deped_ranking: '',
            currently_working: 'no',
            job_details: '',
            preferred_hours: '',
            residing_antique: '',
            agreed_to_terms: true,
            status: 'new',
            demo_recording_status: 'pending_review',
            demo_recording_submitted_date: new Date().toISOString(),
            demo_recording_review_result: null,
            demo_recording_review_notes: notes || null,
            demo_recording_url: submissionType === 'digital' ? recordingUrl : null
          })
          .select()
          .single();

        if (error) throw error;

        onSubmit({ 
          recordingUrl: submissionType === 'digital' ? recordingUrl : undefined,
          notes: notes || '',
          isOnsite: submissionType === 'onsite',
          applicationId: data?.id
        });
      }

      onClose();
      
      // Reset form
      setRecordingUrl('');
      setNotes('');
      setSubmissionType('digital');
      
      const submissionMessage = applicationId 
        ? (submissionType === 'onsite' 
            ? 'Demo recording session scheduled! Our HR team will contact you to schedule the onsite recording at our office.'
            : 'Demo recording submitted successfully! HR team will review it within 3-5 business days.')
        : (submissionType === 'onsite'
            ? 'Demo recording request submitted! Our HR team will contact you within 24-48 hours to schedule your onsite recording.'
            : 'Demo recording submitted successfully! HR team will review it within 3-5 business days.');
      
      alert(submissionMessage);
    } catch (error) {
      console.error('Error submitting demo recording:', error);
      alert('Failed to submit demo recording. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {applicationId ? '📹 Update Demo Recording' : '📹 Submit Demo Recording'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="submissionType"
                    value="digital"
                    checked={submissionType === 'digital'}
                    onChange={(e) => setSubmissionType(e.target.value as 'digital' | 'onsite')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">📹 Digital Recording</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="submissionType"
                    value="onsite"
                    checked={submissionType === 'onsite'}
                    onChange={(e) => setSubmissionType(e.target.value as 'digital' | 'onsite')}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">🏢 Onsite Recording</span>
                </label>
              </div>
            </div>

            {submissionType === 'digital' && (
              <div>
                <label htmlFor="recording-url" className="block text-sm font-medium text-gray-700 mb-2">
                  Demo Recording URL *
                </label>
                <input
                  id="recording-url"
                  type="url"
                  value={recordingUrl}
                  onChange={(e) => setRecordingUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://drive.google.com/file/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required={submissionType === 'digital'}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide a link to your demo recording (YouTube, Google Drive, etc.)
                </p>
              </div>
            )}

            {submissionType === 'onsite' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-900">
                  <strong>🏢 Onsite Recording:</strong> You&apos;ve chosen to record your demo at our office. Our HR team will contact you within 24-48 hours to schedule your recording session.
                </p>
              </div>
            )}

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information about your demo recording..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Profile Sharing Agreement */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="mb-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToProfileSharing}
                    onChange={(e) => setAgreedToProfileSharing(e.target.checked)}
                    className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    required
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      I agree to the Profile Sharing Agreement
                    </span>
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                </label>
              </div>

              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">WHAT THIS MEANS:</h4>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <div>
                        <strong>Profile Visibility:</strong> Your professional profile may be visible to other educators and institutions in our network for collaboration opportunities.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <div>
                        <strong>Direct Contact:</strong> Approved educational partners may contact you about relevant teaching opportunities that match your qualifications.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <div>
                        <strong>Marketing & Directories:</strong> Your profile may be featured in our educator directories and promotional materials to showcase our teaching community.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <div>
                        <strong>Secure & Professional:</strong> All sharing is done within our secure platform and only with verified educational institutions.
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-900 mb-1">Your Privacy is Protected</h4>
                  <p className="text-xs text-blue-800">
                    You maintain full control over your profile visibility and can update your privacy settings at any time in your profile dashboard. We never share your information with third parties without your explicit consent.
                  </p>
                </div>

                <div className="text-center">
                  <a 
                    href="/privacy-policy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium underline"
                  >
                    Read Full Privacy Policy & Terms
                  </a>
                </div>
              </div>
            </div>

            {submissionType === 'onsite' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-900">
                  <strong>🏢 Onsite Recording:</strong> You&apos;ve chosen to record your demo at our office. Our HR team will contact you within 24-48 hours to schedule your recording session.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !agreedToProfileSharing}
                className="flex-1 px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : (applicationId ? 'Update Recording' : (submissionType === 'onsite' ? 'Schedule Onsite Recording' : 'Submit Recording'))}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
