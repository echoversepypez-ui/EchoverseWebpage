import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Echoverse Online Tutorial Services',
  description: 'Terms of Service for Echoverse Online Tutorial Services - Rules and guidelines for using our platform.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-lg text-gray-600 mb-8">Echoverse Online Tutorial Services</p>
          <p className="text-sm text-gray-500 mb-8">Last Updated: March 4, 2026</p>
          
          <div className="prose prose-lg max-w-none">
            <p className="mb-6">
              These Terms govern access to and use of https://echoverseonlinetutorialservices.vercel.app and related services 
              (&ldquo;Services&rdquo;) operated by Echoverse Online Tutorial Services.
            </p>
            
            <p className="mb-6">
              By accessing/using the Services (including applying as a teacher), you agree to these Terms. If not, do not use them.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Eligibility</h2>
            <p className="mb-6">
              You must be 18+ (or age of majority) with legal capacity. By applying, you represent you meet this and provide accurate/true information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Services</h2>
            <p className="mb-6">
              We provide a platform for ESL/online teachers to apply, get vetted, create public profiles, access teaching opportunities 
              (e.g., Japanese/Korean/Chinese accounts), and connect with global students. We do not employ teachers or directly provide tutoring—any 
              arrangements (pay, schedules, lessons) are between teachers and students/platforms. We facilitate opportunities but are not responsible 
              for lesson quality, payments, or disputes.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Teacher Applications and Profiles</h2>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Applications require accurate details and documents.</li>
              <li>Approval is at our discretion (review, interview, training).</li>
              <li>Approved teachers grant consent (via separate form) for public profile display (photo, name, bio, qualifications, etc.) for promotion/matching.</li>
              <li>You remain responsible for your profile content&rsquo;s accuracy.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. User Conduct</h2>
            <p className="mb-4">Do not:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Provide false/misleading information.</li>
              <li>Harass, spam, or impersonate.</li>
              <li>Upload viruses/malware.</li>
              <li>Scrape or misuse Site data.</li>
              <li>Violate laws or third-party rights.</li>
            </ul>
            
            <p className="mb-6">
              We may reject, suspend, or remove profiles for violations.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Intellectual Property</h2>
            <p className="mb-6">
              Site content (design, text, logos) is ours/licensors’. Teacher profile content remains yours, but you grant us perpetual, worldwide, 
              royalty-free license to display/use it publicly per your consent. You may not copy/reproduce without permission.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. No Warranties / Limitation of Liability</h2>
            <p className="mb-6">
              Services &quot;as is&quot; without warranties. We disclaim accuracy, availability, or results. We are not liable for indirect/consequential damages, 
              lost earnings, or disputes between teachers/students. Total liability limited to PHP 5,000.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Indemnification</h2>
            <p className="mb-6">
              You indemnify us against claims from your use, violations, or profile content.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Termination</h2>
            <p className="mb-6">
              We may terminate/suspend access anytime for violations or at discretion.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Governing Law</h2>
            <p className="mb-6">
              Philippine law applies. Disputes in Cebu City courts.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Changes</h2>
            <p className="mb-6">
              We may update Terms; continued use = acceptance.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Contact</h2>
            <p className="mb-6">
              <strong>Email:</strong> support@echoverseonlinetutorialservices.vercel.app
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
