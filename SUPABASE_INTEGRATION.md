# Supabase Integration Guide

## Overview
Echoverse is now connected to Supabase for backend data management. This enables:
- Contact form submissions storage
- Teaching account management
- Real-time data synchronization

## Setup Completed

### Environment Variables
- **NEXT_PUBLIC_SUPABASE_URL**: `https://mzjyflvgjtbolerqzird.supabase.co`
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: `sb_publishable_krSi8denJC45g6IP8rGI7Q_6VRAmVHq`

These are configured in `.env.local`

### Installed Packages
- `@supabase/supabase-js` - Supabase JavaScript client library

### Supabase Client
Located in: `src/lib/supabase.ts`

## Database Tables Required

### 1. `contacts` Table
Used for storing contact form submissions.

**Columns:**
- `id` (uuid, primary key)
- `name` (text)
- `email` (text)
- `phone` (text, nullable)
- `subject` (text)
- `message` (text)
- `created_at` (timestamp)
- `status` (text, default: 'new') - values: 'new', 'read', 'responded'

**SQL:**
```sql
CREATE TABLE public.contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamp DEFAULT now(),
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded'))
);

ALTER TABLE public.contacts ENABLE RLS;

CREATE POLICY "Enable insert for all" ON public.contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for all" ON public.contacts
  FOR SELECT USING (true);
```

### 2. `teaching_accounts` Table
Used for storing ESL teaching account information.

**Columns:**
- `id` (uuid, primary key)
- `country` (text)
- `icon` (text)
- `shift` (text)
- `description` (text)
- `rate_per_hour` (numeric)
- `available_slots` (integer)
- `benefits` (jsonb array, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

**SQL:**
```sql
CREATE TABLE public.teaching_accounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  country text NOT NULL,
  icon text DEFAULT '🌍',
  shift text,
  description text,
  rate_per_hour numeric,
  available_slots integer DEFAULT 0,
  benefits text[] DEFAULT ARRAY[]::text[],
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

ALTER TABLE public.teaching_accounts ENABLE RLS;

CREATE POLICY "Enable insert for all" ON public.teaching_accounts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable read for all" ON public.teaching_accounts
  FOR SELECT USING (true);

CREATE POLICY "Enable update for all" ON public.teaching_accounts
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for all" ON public.teaching_accounts
  FOR DELETE USING (true);
```

## Features Integrated

### 1. Contact Form (Contact Page)
- Form submissions are automatically saved to Supabase `contacts` table
- Loading state during submission
- Error handling and user feedback
- Success message on submission

### 2. Teaching Accounts Management (Courses Page)
- Loads teaching accounts from Supabase
- Add new teaching accounts
- Edit existing accounts
- Delete accounts
- Data persists to Supabase

## Next Steps

1. **Create Database Tables in Supabase:**
   - Log in to your Supabase dashboard
   - Go to SQL Editor
   - Run the SQL scripts provided above

2. **Test the Integration:**
   - Navigate to `/contact` and submit the form
   - Check Supabase `contacts` table for the submission
   - Navigate to `/courses` and test adding/editing/deleting accounts

3. **Add More Features:**
   - Authentication for admin panel
   - Real-time updates using Supabase subscriptions
   - File uploads for profile pictures
   - Payment integration

## File Structure
```
src/
├── lib/
│   └── supabase.ts          # Supabase client configuration
├── app/
│   ├── contact/
│   │   └── page.tsx         # Contact form with Supabase integration
│   └── courses/
│       └── page.tsx         # Teaching accounts with Supabase CRUD
```

## Environment Variables
Located in: `.env.local` (not committed to git)

```
NEXT_PUBLIC_SUPABASE_URL=https://mzjyflvgjtbolerqzird.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_krSi8denJC45g6IP8rGI7Q_6VRAmVHq
```

## Troubleshooting

### Connection Issues
- Verify SUPABASE_URL and SUPABASE_ANON_KEY in `.env.local`
- Check that Supabase project is active in the dashboard
- Ensure tables exist and RLS policies are enabled

### Form Submission Fails
- Check browser console for error messages
- Verify table schema matches the expected columns
- Check RLS policies allow INSERT operations

### No Data Shows Up
- Ensure tables exist in Supabase
- Check that SELECT policy is enabled on tables
- Verify data was actually inserted (check Supabase dashboard)

## Security Notes
- The anonymous key is safe to use in frontend code (public)
- RLS (Row Level Security) policies should be configured for production
- Never commit `.env.local` to version control
- Consider implementing authentication for admin features
