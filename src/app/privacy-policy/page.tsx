import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - Echoverse Online Tutorial Services',
  description: 'Privacy Policy for Echoverse Online Tutorial Services - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-lg text-gray-600 mb-8">Echoverse Online Tutorial Services</p>
          <p className="text-sm text-gray-500 mb-8">Last Updated: March 4, 2026</p>
          
          <div className="prose prose-lg max-w-none">
            <p className="mb-6">
              Echoverse Online Tutorial Services (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;, or &ldquo;Echoverse&rdquo;) operates the website 
              https://echoverseonlinetutorialservices.vercel.app (the &ldquo;Site&rdquo;) to connect certified ESL and online tutors 
              with teaching opportunities and global learners, primarily in Asia (e.g., Japan, Korea, China).
            </p>
            
            <p className="mb-6">
              We are committed to protecting your privacy in compliance with Republic Act No. 10173 (Data Privacy Act of 2012) 
              of the Philippines and other applicable laws. This Privacy Policy explains how we collect, use, disclose, store, 
              and protect personal information when you visit the Site, apply as a teacher, submit inquiries, or interact with our services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>
                <strong>From teacher applicants/teachers:</strong> Full name, email, phone (optional), location/nationality, 
                date of birth (for age verification only), educational background, teaching certifications (e.g., TEFL, CELTA), 
                years of experience, resume/CV, diplomas/certificates, preferred teaching hours, reasons for joining, 
                video interview details (if conducted), and any other information you provide during application/review/onboarding.
              </li>
              <li>
                <strong>Public teacher profiles (for approved teachers):</strong> Professional photo/avatar, full name, 
                short bio, qualifications, experience, specializations, languages/proficiency, availability (e.g., full-time/part-time), 
                ratings/reviews summary, lessons taught count, and other profile fields.
              </li>
              <li>
                <strong>Automatically:</strong> IP address, browser/device type, pages visited, time/date of access, 
                referral sources (via server logs and analytics).
              </li>
              <li>
                <strong>From inquiries/other:</strong> Any details you voluntarily submit (e.g., messages via contact forms).
              </li>
            </ul>
            
            <p className="mb-6">
              We do not collect sensitive personal information (e.g., health, race, religion) unless voluntarily provided 
              and relevant to teaching qualifications.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">We use it to:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Process and evaluate teacher applications, conduct reviews/interviews, provide training/orientation, and manage teaching accounts/opportunities.</li>
              <li>Create and publicly display teacher profiles on the Site (e.g., /teachers-profile) to promote services, build trust, and connect teachers with students.</li>
              <li>Communicate with you (application status, updates, support).</li>
              <li>Improve the Site, prevent fraud/abuse, and comply with legal obligations.</li>
              <li>Aggregate anonymized data for statistics (e.g., active teachers, ratings).</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Sharing and Disclosure</h2>
            <p className="mb-4">We do not sell personal information. We may share it with:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Service providers (e.g., Vercel for hosting, email tools, analytics providers) bound by confidentiality.</li>
              <li>Potential students/clients (via public profiles) for evaluation and matching.</li>
              <li>Legal authorities if required by law, court order, or to protect rights/safety.</li>
              <li>In case of merger, acquisition, or asset sale.</li>
            </ul>
            
            <p className="mb-6">
              Public profile data is intentionally shared worldwide via the Site and promotional channels.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Cookies and Tracking</h2>
            <p className="mb-6">
              We use essential cookies for functionality and may use analytics cookies (e.g., for traffic insights). 
              You can manage preferences via browser settings. No targeted advertising currently.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Data Security</h2>
            <p className="mb-6">
              We use reasonable measures (e.g., encryption where applicable, access controls) to protect data. 
              However, no internet transmission is fully secure.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Data Retention</h2>
            <p className="mb-6">
              We retain application/profile data as long as needed for purposes above or legal requirements. 
              Inactive profiles may be archived/removed upon request.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Your Rights (Under Philippine DPA and Applicable Laws)</h2>
            <p className="mb-6">
              You have rights to access, correct, object to processing, suspend/remove, or erase your personal data. 
              For public profiles, consent-based revocation applies (see your signed Consent Form). 
              Contact us to exercise rights; we respond promptly and reasonably.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Children's Privacy</h2>
            <p className="mb-6">
              The Site is not for children under 18. We do not knowingly collect data from minors.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. International Transfers</h2>
            <p className="mb-6">
              Data may be processed/stored outside the Philippines (e.g., Vercel servers). We ensure adequate protections.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Changes</h2>
            <p className="mb-6">
              We may update this Policy; changes posted here with new date. Continued use = acceptance.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Contact</h2>
            <div className="mb-6">
              <p className="mb-2"><strong>Questions?</strong> Email: support@echoverseonlinetutorialservices.vercel.app</p>
              <p><strong>Location:</strong> San Jose Antique, Philippines</p>
            </div>
            
            <p className="font-semibold text-gray-900">
              By using the Site or applying, you consent to this Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
