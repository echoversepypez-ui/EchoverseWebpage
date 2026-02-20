-- ALTER TABLE: Add image column to teacher_profiles
-- Run this migration first before updating teacher images

ALTER TABLE teacher_profiles
ADD COLUMN image VARCHAR(255);

-- Verify the column was added
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'teacher_profiles' ORDER BY ordinal_position;
