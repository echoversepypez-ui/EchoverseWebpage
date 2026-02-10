-- Add is_active and status fields to teaching_accounts table
ALTER TABLE teaching_accounts
ADD COLUMN is_active BOOLEAN DEFAULT true,
ADD COLUMN status VARCHAR(50) DEFAULT 'Active'; -- 'Active', 'Hiring', 'Not Hiring', 'Paused'

-- Create index for filtering by active status
CREATE INDEX idx_teaching_accounts_is_active ON teaching_accounts(is_active);

-- Update existing records to be active
UPDATE teaching_accounts SET is_active = true, status = 'Active' WHERE is_active IS NULL;
