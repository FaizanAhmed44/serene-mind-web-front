
-- Create experts table to store expert information
CREATE TABLE public.experts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  specializations TEXT[] NOT NULL DEFAULT '{}',
  rating NUMERIC(2,1) NOT NULL DEFAULT 0.0,
  reviews INTEGER NOT NULL DEFAULT 0,
  experience TEXT NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  next_available TEXT,
  photo TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expert session types table
CREATE TABLE public.expert_session_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expert_id UUID REFERENCES public.experts(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  duration TEXT NOT NULL,
  price TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expert availability table
CREATE TABLE public.expert_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  expert_id UUID REFERENCES public.experts(id) ON DELETE CASCADE,
  date TEXT NOT NULL,
  times TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_session_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expert_availability ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (experts are public information)
CREATE POLICY "Anyone can view experts" ON public.experts FOR SELECT USING (true);
CREATE POLICY "Anyone can view expert session types" ON public.expert_session_types FOR SELECT USING (true);
CREATE POLICY "Anyone can view expert availability" ON public.expert_availability FOR SELECT USING (true);

-- Insert sample expert data
INSERT INTO public.experts (name, title, specializations, rating, reviews, experience, verified, next_available, photo, bio) VALUES
('Dr. Sarah Johnson', 'Licensed Clinical Psychologist', ARRAY['Anxiety Disorders', 'CBT', 'Mindfulness'], 4.9, 127, '12+ years', true, 'Tomorrow, 2:00 PM', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face', 'Specializes in cognitive behavioral therapy for anxiety and depression. Expert in mindfulness-based interventions.'),
('Mark Thompson', 'Speech & Confidence Coach', ARRAY['Public Speaking', 'Social Anxiety', 'Confidence Building'], 4.8, 89, '8+ years', true, 'Today, 4:30 PM', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face', 'Former corporate trainer turned therapist, helping individuals overcome public speaking fears and build confidence.');

-- Get expert IDs for use in subsequent inserts
DO $$
DECLARE
    sarah_id UUID;
    mark_id UUID;
BEGIN
    -- Get Sarah's ID
    SELECT id INTO sarah_id FROM public.experts WHERE name = 'Dr. Sarah Johnson';
    
    -- Get Mark's ID
    SELECT id INTO mark_id FROM public.experts WHERE name = 'Mark Thompson';
    
    -- Insert session types for Dr. Sarah Johnson
    INSERT INTO public.expert_session_types (expert_id, type, duration, price) VALUES
    (sarah_id, 'One-on-One Therapy', '50 min', '$120'),
    (sarah_id, 'CBT Session', '50 min', '$110'),
    (sarah_id, 'Mindfulness Coaching', '45 min', '$90');
    
    -- Insert session types for Mark Thompson
    INSERT INTO public.expert_session_types (expert_id, type, duration, price) VALUES
    (mark_id, 'Public Speaking Coaching', '50 min', '$100'),
    (mark_id, 'Confidence Building', '45 min', '$85'),
    (mark_id, 'Group Workshop', '90 min', '$60');
    
    -- Insert availability for Dr. Sarah Johnson
    INSERT INTO public.expert_availability (expert_id, date, times) VALUES
    (sarah_id, 'Today', ARRAY['2:00 PM', '4:00 PM']),
    (sarah_id, 'Tomorrow', ARRAY['10:00 AM', '2:00 PM', '5:00 PM']),
    (sarah_id, 'Friday', ARRAY['9:00 AM', '1:00 PM', '3:00 PM']);
    
    -- Insert availability for Mark Thompson
    INSERT INTO public.expert_availability (expert_id, date, times) VALUES
    (mark_id, 'Today', ARRAY['4:30 PM', '6:00 PM']),
    (mark_id, 'Tomorrow', ARRAY['10:00 AM', '2:00 PM', '4:00 PM']),
    (mark_id, 'Friday', ARRAY['9:00 AM', '11:00 AM', '3:00 PM']);
END $$;
