-- Create page_sections table to store editable home page content
CREATE TABLE page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name VARCHAR(50) NOT NULL UNIQUE, -- 'how_it_works', 'requirements', 'faq', 'why_join'
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(500),
  content JSONB NOT NULL DEFAULT '{}', -- Flexible JSON structure for different section types
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Initial data for sections
INSERT INTO page_sections (section_name, title, subtitle, content) VALUES
('how_it_works', 'How It Works', '5 Simple Steps from Application to Teaching Your First Class', '{"steps":[{"number":1,"title":"Submit Application","description":"Complete our detailed registration form with your qualifications and experience"},{"number":2,"title":"Admin Review","description":"Our team reviews your qualifications & experience. We verify your credentials"},{"number":3,"title":"Video Interview","description":"Brief interview with our HR team to assess teaching style & communication skills"},{"number":4,"title":"Training and Orientation","description":"Get platform training, review teaching materials, and meet your support team"},{"number":5,"title":"Start Teaching!","description":"Get onboarding training, set up your schedule, and teach your first class"}]}'),
('requirements', 'Requirements & Eligibility', 'What you need to become a certified ESL educator', '{"essential":[{"text":"Bachelor''s degree or equivalent","icon":"✓"},{"text":"Native English speaker or IELTS 7.5+","icon":"✓"},{"text":"Teaching certification (TEFL/TESOL/CELTA preferred)","icon":"✓"},{"text":"Minimum 1 year teaching experience","icon":"✓"},{"text":"Reliable internet connection (10+ Mbps)","icon":"✓"},{"text":"Professional appearance and communication skills","icon":"✓"}],"nice_to_have":[{"text":"Advanced certifications (MA TESOL, etc.)","icon":"⭐"},{"text":"Experience with specific age groups","icon":"⭐"},{"text":"Knowledge of Asian culture","icon":"⭐"},{"text":"Multiple language capabilities","icon":"⭐"},{"text":"Professional teaching materials","icon":"⭐"},{"text":"Flexible availability (including weekends)","icon":"⭐"}]}'),
('faq', 'Frequently Asked Questions', 'Get answers to common questions', '{"questions":[{"q":"How much can I earn?","a":"Earnings range from $15-25+ per hour based on your qualifications and experience. Rates increase with tenure and performance ratings."},{"q":"Do I need a teaching degree?","a":"While a Bachelor''s degree is required, it doesn''t have to be in education. Teaching certifications like TEFL/TESOL are preferred."},{"q":"What are the payment options?","a":"We offer multiple payment methods including bank transfer, PayPal, and cryptocurrency options for your convenience."},{"q":"Can I choose my own schedule?","a":"Absolutely! You have full control over your availability and can choose which student sessions to teach."},{"q":"What equipment do I need?","a":"You need a computer with a reliable internet connection (10+ Mbps), a webcam, microphone, and headphones."},{"q":"How long is the approval process?","a":"Most applications are reviewed within 24-48 hours. Once approved, you can start teaching immediately."},{"q":"Is there support for new teachers?","a":"Yes! We provide comprehensive onboarding, training materials, and 24/7 support from our dedicated team."},{"q":"Can I teach multiple markets?","a":"Yes, you can teach students from different countries and regions. Many of our teachers work across multiple markets."}]}'),
('why_join', 'Why Join Echoverse Online Tutorials?', 'Premium benefits for professional ESL educators', '{"benefits":[{"icon":"💰","title":"Competitive Pay","description":"Earn $15-25+ per hour with rates based on your experience and qualifications"},{"icon":"⏰","title":"Flexible Schedule","description":"Work on your terms. Choose your hours and the number of students you teach"},{"icon":"🌍","title":"Global Students","description":"Teach learners from Japan, Korea, China, Thailand, Vietnam and beyond"},{"icon":"👥","title":"24/7 Support","description":"Our dedicated team is always ready to help you succeed"},{"icon":"📈","title":"Career Growth","description":"Access multiple teaching opportunities and advance your career"},{"icon":"⚡","title":"Quick Setup","description":"Simple application process with quick approval and easy onboarding"}]}');

-- Enable Row Level Security
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all sections
CREATE POLICY "Allow public read" ON page_sections
  FOR SELECT USING (true);

-- Allow only authenticated admin users to update
CREATE POLICY "Allow authenticated update" ON page_sections
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
