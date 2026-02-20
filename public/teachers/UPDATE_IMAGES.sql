-- Teacher Profile Image Update Examples
-- These examples use the actual teacher names from your Supabase database

-- ⚠️ IMPORTANT - READ FIRST:
-- The image column doesn't exist yet in teacher_profiles table
-- You MUST run ADD_IMAGE_COLUMN.sql FIRST to create the column

-- STEP 1: Run this migration first (copy the entire content from ADD_IMAGE_COLUMN.sql)
-- ALTER TABLE teacher_profiles ADD COLUMN image VARCHAR(255);

-- STEP 2: Then run the UPDATE commands below

-- Your Echoverse teachers are: Sarah Johnson, Michael Chen, Emma Thompson
-- To view all teachers in your database, run:
-- SELECT id, name FROM teacher_profiles ORDER BY name;

-- Example 1: Update Sarah Johnson with image
UPDATE teacher_profiles
SET image = 'sarah-johnson.jpg'
WHERE name = 'Sarah Johnson';

-- Example 2: Update Michael Chen with image
UPDATE teacher_profiles
SET image = 'michael-chen.jpg'
WHERE name = 'Michael Chen';

-- Example 3: Update Emma Thompson with image
UPDATE teacher_profiles
SET image = 'emma-thompson.jpg'
WHERE name = 'Emma Thompson';

-- Example 4: Update by EMAIL (if you know the email)
UPDATE teacher_profiles
SET image = 'sarah-johnson.png'
WHERE email = 'sarah@echoverse.com';

-- Example 5: View all teachers and their current image status
SELECT id, name, email, image, rating, experience_years
FROM teacher_profiles
ORDER BY name;

-- Example 6: Find ALL teachers who still need images
SELECT id, name, email
FROM teacher_profiles
WHERE image IS NULL OR image = ''
ORDER BY name;

-- Example 7: Check which teachers HAVE images
SELECT id, name, email, image
FROM teacher_profiles
WHERE image IS NOT NULL AND image != ''
ORDER BY name;

-- ✅ COMPLETE SETUP GUIDE:
-- Step 1: Run ADD_IMAGE_COLUMN.sql in Supabase SQL Editor
--   (This adds the image column to teacher_profiles table)

-- Step 2: Upload your teacher images to public/teachers/ folder:
--   - sarah-johnson.jpg
--   - michael-chen.jpg
--   - emma-thompson.jpg

-- Step 3: Copy the UPDATE command you need:
--   UPDATE teacher_profiles SET image = 'sarah-johnson.jpg' WHERE name = 'Sarah Johnson';

-- Step 4: Paste into Supabase SQL Editor and click "Run"

-- Step 5: Check the result by running:
--   SELECT name, image FROM teacher_profiles WHERE name = 'Sarah Johnson';

-- ✨ Image Filenames to Use:
-- Sarah Johnson:   sarah-johnson.jpg (or .png, .webp)
-- Michael Chen:    michael-chen.jpg (or .png, .webp)
-- Emma Thompson:   emma-thompson.jpg (or .png, .webp)
