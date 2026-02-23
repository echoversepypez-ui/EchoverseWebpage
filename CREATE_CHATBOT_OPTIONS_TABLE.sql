-- Migration: Add Support Chatbot Options Table with Content
-- Date: 2026-02-18
-- Description: Creates support_chatbot_options and chatbot_option_content tables for managing chatbot menu items and detailed content

-- ============================================
-- SUPPORT CHATBOT OPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS support_chatbot_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  emoji TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  description TEXT,
  is_admin_chat BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CHATBOT OPTION CONTENT TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chatbot_option_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chatbot_option_id UUID REFERENCES support_chatbot_options(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  bullet_points TEXT[] DEFAULT ARRAY[]::TEXT[],
  additional_info TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(chatbot_option_id)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chatbot_order ON support_chatbot_options(order_index);
CREATE INDEX IF NOT EXISTS idx_chatbot_active ON support_chatbot_options(is_active);
CREATE INDEX IF NOT EXISTS idx_chatbot_created_at ON support_chatbot_options(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chatbot_content_option_id ON chatbot_option_content(chatbot_option_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_content_created_at ON chatbot_option_content(created_at DESC);

-- Insert default chatbot options
INSERT INTO support_chatbot_options (id, title, emoji, order_index, description, is_admin_chat, is_active)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Payment & Earnings', '💰🔒', 1, 'Information about payments and earnings', FALSE, TRUE),
  ('550e8400-e29b-41d4-a716-446655440002', 'Requirements', '📋', 2, 'Teaching requirements and qualifications needed', FALSE, TRUE),
  ('550e8400-e29b-41d4-a716-446655440003', 'Qualifications', '👩‍🎓', 3, 'Details about required qualifications', FALSE, TRUE),
  ('550e8400-e29b-41d4-a716-446655440004', 'Schedule', '📅', 4, 'Scheduling and availability information', FALSE, TRUE),
  ('550e8400-e29b-41d4-a716-446655440005', 'Benefits', '⭐', 5, 'Benefits of joining Echoverse', FALSE, TRUE),
  ('550e8400-e29b-41d4-a716-446655440006', 'Experience', '💼', 6, 'Experience requirements and expectations', FALSE, TRUE),
  ('550e8400-e29b-41d4-a716-446655440007', 'Training', '🎓', 7, 'Training programs and resources', FALSE, TRUE),
  ('550e8400-e29b-41d4-a716-446655440008', 'Application', '📝', 8, 'Application process information', FALSE, TRUE),
  ('550e8400-e29b-41d4-a716-446655440009', 'View Jobs', '🌍💼', 9, 'Available teaching positions', FALSE, TRUE),
  ('550e8400-e29b-41d4-a716-446655440010', 'Contact Us', '💬', 10, 'Contact information and general inquiries', FALSE, TRUE),
  ('550e8400-e29b-41d4-a716-446655440011', 'Chat with Admin', '👨‍💼', 11, 'Direct chat with an admin for immediate assistance', TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- Insert default content for each option
INSERT INTO chatbot_option_content (chatbot_option_id, title, content, bullet_points, additional_info)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Payment & Earnings', 'Echoverse offers competitive and transparent payment structure to ensure you are fairly compensated for your teaching expertise.', 
    ARRAY['Competitive Rates: $15-25+ per hour', 'Weekly/Monthly payments', 'Direct bank transfer or PayPal', 'Transparent billing system', 'No hidden fees', 'Performance bonuses available'],
    'Rates vary based on: Your experience level, Student level/demand, Subject specialization, Teaching location'),
  
  ('550e8400-e29b-41d4-a716-446655440002', 'Requirements', 'To teach on Echoverse, you need to meet our basic teaching requirements and pass our verification process.', 
    ARRAY['18+ years old', 'Native or fluent English speaker', 'Teaching experience (can be informal)', 'Reliable internet connection', 'Quiet, professional teaching space', 'Webcam and microphone'],
    'Additional qualifications like TEFL, CELTA, or a degree in English increase your earning potential and student interest!'),
  
  ('550e8400-e29b-41d4-a716-446655440003', 'Qualifications', 'While formal qualifications aren''t required, they significantly enhance your profile and earning potential.', 
    ARRAY['TEFL (Teaching English as a Foreign Language)', 'CELTA (Certificate in English Language Teaching)', 'Bachelor''s degree in Education or English', 'TOEFL/IELTS certification', 'Specialized teaching certifications', 'Years of teaching experience'],
    'Even without formal qualifications, passionate teachers with proven experience can still be considered during our review process.'),
  
  ('550e8400-e29b-41d4-a716-446655440004', 'Schedule', 'We offer complete flexibility in scheduling your lessons. Work when it suits you best!', 
    ARRAY['Set your own availability', 'Work full-time or part-time', 'Take breaks whenever needed', 'Work from anywhere', 'Choose your student time zones', 'Flexible booking window'],
    'Most successful teachers start with 5-10 hours/week and expand based on student demand. Peak hours are typically evenings (EST) and weekends.'),
  
  ('550e8400-e29b-41d4-a716-446655440005', 'Benefits', 'Beyond competitive pay, Echoverse offers numerous benefits to support your success.', 
    ARRAY['24/7 dedicated support team', 'Free teaching materials & resources', 'Continuous professional development', 'Flexible work schedule', 'Community of teachers', 'Performance bonuses & incentives', 'Annual raise opportunities'],
    'We invest in our teachers! Access exclusive training webinars, teaching strategies, and networking events throughout the year.'),
  
  ('550e8400-e29b-41d4-a716-446655440006', 'Experience', 'Teaching experience requirements are flexible. We value both formal and informal teaching backgrounds.', 
    ARRAY['Formal classroom teaching (preferred)', 'Private tutoring experience', 'Online teaching experience', 'Volunteer teaching', 'Language exchange facilitation', 'Corporate training experience'],
    'If you don''t have traditional teaching experience, demonstrate your passion, communication skills, and ability to help others learn English.'),
  
  ('550e8400-e29b-41d4-a716-446655440007', 'Training', 'We provide comprehensive training to ensure your success as an Echoverse teacher.', 
    ARRAY['Platform orientation & setup', 'Teaching methodology workshops', 'Student management best practices', 'Video interview preparation', 'Technical troubleshooting', 'Ongoing coaching & feedback', 'Monthly professional development webinars'],
    'Our onboarding process takes about 2-3 hours. After that, you''ll have access to our resource center with lesson plans, templates, and teaching guides.'),
  
  ('550e8400-e29b-41d4-a716-446655440008', 'Application', 'Getting started is simple! Here''s what to expect in our application process.', 
    ARRAY['Fill out the registration form (10-15 min)', 'Submit your qualifications & documents', 'Admin review & verification (24-48 hrs)', 'Video interview with our team (15-30 min)', 'Technical setup & onboarding', 'Start teaching & earning!'],
    'Most teachers go from application to first class within 5-7 days. If you don''t meet requirements initially, we''ll provide feedback for reapplication.'),
  
  ('550e8400-e29b-41d4-a716-446655440009', 'View Jobs', 'Browse available teaching positions and student profiles to find the perfect match for your expertise.', 
    ARRAY['Filter by student age & level', 'Choose your subject specialization', 'Find your preferred time zones', 'See student reviews & ratings', 'Review lesson requirements', 'Accept and start teaching'],
    'New job postings are added daily! Set up your profile preferences to get notifications about lessons that match your expertise and availability.'),
  
  ('550e8400-e29b-41d4-a716-446655440010', 'Contact Us', 'Have questions? Our support team is here to help!', 
    ARRAY['Email: support@echoverse.com', 'Live Chat: Available 24/7', 'Phone: +1 (555) TEACH-ESL', 'Response time: Under 2 hours', 'Knowledge Base: Self-service articles'],
    'We''re passionate about helping you succeed! Don''t hesitate to reach out with any questions about joining or teaching with Echoverse.')
ON CONFLICT DO NOTHING;
