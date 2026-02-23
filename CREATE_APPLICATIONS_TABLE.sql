-- Create applications table for storing teacher applications from the chatbot modal

CREATE TABLE public.applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  age text,
  address text,
  phone text NOT NULL,
  educational_attainment text,
  university_school text,
  teaching_experience text,
  certificates text,
  board_exam text,
  board_exam_date text,
  deped_ranking text,
  currently_working text,
  job_details text,
  preferred_hours text,
  residing_antique text,
  agreed_to_terms boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'contacted', 'approved', 'rejected'))
);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert applications
CREATE POLICY "Enable insert for all" ON public.applications
  FOR INSERT WITH CHECK (true);

-- Create policy to allow anyone to read their own applications (if we add user auth later)
CREATE POLICY "Enable read for all" ON public.applications
  FOR SELECT USING (true);

-- Create policy to allow updates to applications
CREATE POLICY "Enable update for all" ON public.applications
  FOR UPDATE USING (true) WITH CHECK (true);

-- Create policy to allow deletion of applications
CREATE POLICY "Enable delete for all" ON public.applications
  FOR DELETE USING (true);

-- Create indexes for better query performance
CREATE INDEX applications_created_at_idx ON public.applications(created_at DESC);
CREATE INDEX applications_status_idx ON public.applications(status);
CREATE INDEX applications_phone_idx ON public.applications(phone);
