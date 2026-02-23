-- Create contacts table for contact form submissions
CREATE TABLE public.contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  agreed_to_terms boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded'))
);

-- Enable Row Level Security
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact form submissions
CREATE POLICY "Enable insert for all" ON public.contacts
  FOR INSERT WITH CHECK (true);

-- Allow anyone to read contacts
CREATE POLICY "Enable read for all" ON public.contacts
  FOR SELECT USING (true);

-- Create index on email for better query performance
CREATE INDEX idx_contacts_email ON public.contacts(email);

-- Create index on created_at for sorting
CREATE INDEX idx_contacts_created_at ON public.contacts(created_at DESC);
