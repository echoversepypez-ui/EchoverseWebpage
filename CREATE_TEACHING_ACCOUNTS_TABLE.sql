-- Create teaching_accounts table
CREATE TABLE teaching_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country TEXT NOT NULL,
  icon TEXT DEFAULT '🌍',
  rate_per_hour DECIMAL(10, 2) DEFAULT 0,
  shift TEXT DEFAULT 'TBD',
  available_slots INT DEFAULT 0,
  description TEXT DEFAULT '',
  benefits TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE teaching_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (allow all)
CREATE POLICY "Allow public read" ON teaching_accounts
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert" ON teaching_accounts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON teaching_accounts
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete" ON teaching_accounts
  FOR DELETE USING (true);

-- Create index for faster queries
CREATE INDEX teaching_accounts_country_idx ON teaching_accounts(country);
CREATE INDEX teaching_accounts_created_at_idx ON teaching_accounts(created_at DESC);

-- Insert default accounts
INSERT INTO teaching_accounts (country, icon, rate_per_hour, shift, available_slots, description, benefits)
VALUES
  ('Japanese Account', '🇯🇵', 18, 'Evening (JPT)', 5200, 'Teach English to Japanese learners. High demand with excellent pay rates.', ARRAY['✓ High hourly rates ($18-25)', '✓ Evening shift (JPT time)', '✓ Professional corporate students', '✓ Flexible scheduling', '✓ Bonus incentives available']),
  ('Korean Account', '🇰🇷', 16, 'Evening (KST)', 4800, 'Teach English to Korean learners. Growing market with competitive rates.', ARRAY['✓ Competitive hourly rates ($16-22)', '✓ Evening shift (KST time)', '✓ Motivated learners', '✓ Flexible scheduling', '✓ Career advancement opportunities']),
  ('Chinese Account', '🇨🇳', 15, 'Morning (CST)', 6500, 'Teach English to Chinese learners. Largest market with steady opportunities.', ARRAY['✓ Large student base ($15-20)', '✓ Morning shift (CST time)', '✓ Diverse learner levels', '✓ Stable income', '✓ Long-term opportunities']),
  ('Thai Account', '🇹🇭', 14, 'Evening (TH)', 3200, 'Teach English to Thai learners. Growing market with friendly students.', ARRAY['✓ Growing demand ($14-19)', '✓ Evening shift (TH time)', '✓ Engaging lessons', '✓ Cultural exchange', '✓ Supportive community']),
  ('Vietnamese Account', '🇻🇳', 13, 'Mixed Shifts', 2800, 'Teach English to Vietnamese learners. Emerging market with great potential.', ARRAY['✓ Emerging opportunities ($13-18)', '✓ Mix of shift times', '✓ Motivated learners', '✓ Growth potential', '✓ Unique experience'])
ON CONFLICT DO NOTHING;
