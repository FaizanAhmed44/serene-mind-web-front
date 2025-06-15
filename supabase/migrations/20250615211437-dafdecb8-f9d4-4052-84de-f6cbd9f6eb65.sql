
-- Create enum types
CREATE TYPE public.session_status AS ENUM ('upcoming', 'completed');
CREATE TYPE public.course_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');

-- Create instructors table
CREATE TABLE public.instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  photo TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE public.courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  duration TEXT NOT NULL,
  modules INTEGER NOT NULL,
  category TEXT NOT NULL,
  instructor_id UUID REFERENCES public.instructors(id),
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  students INTEGER NOT NULL DEFAULT 0,
  progress INTEGER DEFAULT 0,
  price TEXT NOT NULL,
  original_price INTEGER,
  language TEXT NOT NULL DEFAULT 'English',
  level course_level NOT NULL DEFAULT 'Beginner',
  certificate BOOLEAN NOT NULL DEFAULT true,
  image TEXT NOT NULL,
  outcomes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course modules table
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id INTEGER REFERENCES public.courses(id) ON DELETE CASCADE,
  week INTEGER NOT NULL,
  title TEXT NOT NULL,
  lessons TEXT[] DEFAULT '{}',
  duration TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create course reviews table
CREATE TABLE public.course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id INTEGER REFERENCES public.courses(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  review_date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE public.sessions (
  id SERIAL PRIMARY KEY,
  expert_name TEXT NOT NULL,
  session_date TEXT NOT NULL,
  session_type TEXT NOT NULL,
  duration TEXT NOT NULL,
  status session_status NOT NULL,
  can_review BOOLEAN NOT NULL DEFAULT false,
  has_reviewed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stats table
CREATE TABLE public.dashboard_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create enrolled courses table
CREATE TABLE public.enrolled_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id INTEGER REFERENCES public.courses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  next_lesson TEXT,
  time_spent TEXT DEFAULT '0 hours',
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrolled_courses ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (courses, instructors, etc.)
CREATE POLICY "Public can view instructors" ON public.instructors FOR SELECT USING (true);
CREATE POLICY "Public can view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public can view course modules" ON public.course_modules FOR SELECT USING (true);
CREATE POLICY "Public can view course reviews" ON public.course_reviews FOR SELECT USING (true);
CREATE POLICY "Public can view sessions" ON public.sessions FOR SELECT USING (true);
CREATE POLICY "Public can view dashboard stats" ON public.dashboard_stats FOR SELECT USING (true);

-- Create policies for enrolled courses (user-specific)
CREATE POLICY "Users can view their enrolled courses" ON public.enrolled_courses 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their enrolled courses" ON public.enrolled_courses 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their enrolled courses" ON public.enrolled_courses 
  FOR UPDATE USING (auth.uid() = user_id);

-- Insert instructors data
INSERT INTO public.instructors (name, title, bio, photo) VALUES
('Dr. Sarah Johnson', 'Licensed Clinical Psychologist', 'Dr. Sarah Johnson has over 12 years of experience in clinical psychology, specializing in anxiety disorders and cognitive behavioral therapy.', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face'),
('Mark Thompson', 'Professional Speaker & Communication Coach', 'Mark Thompson has been a professional speaker for over 15 years and has helped thousands of people overcome their fear of public speaking.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face'),
('Dr. Emily Chen', 'Behavioral Economist & Decision Science Expert', 'Dr. Emily Chen is a leading expert in decision science with a PhD in Behavioral Economics from Stanford University.', 'https://images.unsplash.com/photo-1494790108755-2616b612b577?w=300&h=300&fit=crop&crop=face'),
('Dr. Michael Rodriguez', 'Clinical Psychologist', 'Dr. Michael Rodriguez specializes in depression and evidence-based therapeutic interventions.', 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face');

-- Insert courses data
INSERT INTO public.courses (id, title, description, long_description, duration, modules, category, instructor_id, rating, students, progress, price, original_price, language, level, certificate, image, outcomes) VALUES
(1, 'Overcoming Anxiety', 'Learn practical techniques to manage and reduce anxiety in daily life', 'This comprehensive course provides you with the tools and strategies needed to understand, manage, and overcome anxiety. Through a combination of theoretical knowledge and practical exercises, you''ll learn how anxiety works, identify your personal triggers, and develop a toolkit of coping strategies that you can use in any situation.', '6 weeks', 12, 'Anxiety', (SELECT id FROM public.instructors WHERE name = 'Dr. Sarah Johnson'), 4.8, 2847, 0, '$149', 249, 'English', 'Beginner', true, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=450&fit=crop', ARRAY['Understand the science behind anxiety and how it affects your body and mind', 'Identify personal anxiety triggers and develop awareness of your patterns', 'Master breathing techniques and progressive muscle relaxation', 'Learn cognitive restructuring to challenge anxious thoughts', 'Develop a personalized anxiety management plan', 'Build confidence in handling anxiety-provoking situations']),
(2, 'Confident Public Speaking', 'Master the art of public speaking and overcome stage fright with proven techniques and practical exercises.', 'Transform your fear of public speaking into confidence with this comprehensive course. Whether you''re presenting at work, speaking at events, or just want to feel more comfortable in group settings, this course provides you with the skills and confidence you need to speak with impact and authenticity.', '8 weeks', 16, 'Communication', (SELECT id FROM public.instructors WHERE name = 'Mark Thompson'), 4.9, 1892, 65, '$199', 299, 'English', 'Intermediate', true, 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=450&fit=crop', ARRAY['Overcome stage fright and speaking anxiety', 'Structure compelling presentations that engage your audience', 'Use body language and voice effectively', 'Handle difficult questions and situations with confidence', 'Develop your unique speaking style', 'Build lasting confidence in all speaking situations']),
(3, 'Decision Making Mastery', 'Learn to make better decisions faster with frameworks and techniques used by top executives and entrepreneurs.', 'Decision-making is one of the most critical skills for success in both personal and professional life. This course teaches you systematic approaches to making better decisions, avoiding common cognitive biases, and building confidence in your choices.', '5 weeks', 10, 'Critical Thinking', (SELECT id FROM public.instructors WHERE name = 'Dr. Emily Chen'), 4.7, 1456, 30, '$179', 249, 'English', 'Advanced', true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop', ARRAY['Master proven decision-making frameworks', 'Identify and overcome cognitive biases', 'Make faster, more confident decisions', 'Improve decision quality in uncertain situations', 'Develop intuition through structured thinking', 'Apply decision science to real-world problems']),
(4, 'Managing Depression', 'Evidence-based strategies for understanding and managing depression', 'Comprehensive course on understanding and managing depression using evidence-based therapeutic approaches.', '8 weeks', 16, 'Depression', (SELECT id FROM public.instructors WHERE name = 'Dr. Michael Rodriguez'), 4.9, 3201, 0, '$179', 249, 'English', 'Beginner', true, 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=250&fit=crop', ARRAY['Understand the nature of depression', 'Learn coping strategies', 'Develop healthy thought patterns', 'Build support systems', 'Create sustainable wellness habits']);

-- Insert course modules
INSERT INTO public.course_modules (course_id, week, title, lessons, duration) VALUES
(1, 1, 'Understanding Anxiety', ARRAY['What is Anxiety? The Science Behind It', 'Types of Anxiety Disorders', 'Identifying Your Anxiety Triggers'], '2 hours'),
(1, 2, 'Physical Techniques', ARRAY['Breathing Exercises for Immediate Relief', 'Progressive Muscle Relaxation', 'Grounding Techniques'], '2.5 hours'),
(1, 3, 'Cognitive Strategies', ARRAY['Challenging Negative Thoughts', 'Cognitive Restructuring Techniques', 'Building Positive Self-Talk'], '3 hours'),
(2, 1, 'Foundation of Public Speaking', ARRAY['Understanding Stage Fright', 'The Psychology of Confidence', 'Breathing and Relaxation Techniques'], '2.5 hours'),
(2, 2, 'Structuring Your Message', ARRAY['Creating Compelling Openings', 'Organizing Your Content', 'Powerful Conclusions'], '3 hours'),
(2, 3, 'Delivery Techniques', ARRAY['Voice and Vocal Variety', 'Body Language and Gestures', 'Managing Nerves During Delivery'], '3.5 hours'),
(3, 1, 'Decision Science Fundamentals', ARRAY['The Science of Decision Making', 'Types of Decisions and Their Challenges', 'Common Decision-Making Pitfalls'], '2 hours'),
(3, 2, 'Cognitive Biases', ARRAY['Understanding Cognitive Biases', 'Confirmation Bias and Anchoring', 'Overcoming Mental Shortcuts'], '2.5 hours'),
(3, 3, 'Decision Frameworks', ARRAY['The DECIDE Model', 'Pros and Cons Analysis', 'Cost-Benefit Analysis'], '3 hours');

-- Insert course reviews
INSERT INTO public.course_reviews (course_id, reviewer_name, rating, comment, review_date) VALUES
(1, 'Emily Rodriguez', 5, 'This course completely changed my approach to managing anxiety. The practical techniques are easy to implement and really work!', '2 weeks ago'),
(1, 'Michael Chen', 5, 'Dr. Johnson''s expertise really shows. The content is well-structured and the exercises are incredibly helpful.', '1 month ago'),
(2, 'Sarah Williams', 5, 'Mark''s teaching style is incredible. I went from being terrified of speaking to actually enjoying presentations!', '1 week ago'),
(2, 'David Park', 5, 'The practical exercises really helped me build confidence. I can now speak in front of large groups without fear.', '3 weeks ago'),
(3, 'James Miller', 5, 'Dr. Chen''s approach to decision making is revolutionary. I make much better choices now in both business and life.', '2 weeks ago'),
(3, 'Lisa Zhang', 4, 'Great frameworks and practical tools. The content on cognitive biases was especially eye-opening.', '1 month ago');

-- Insert sessions data
INSERT INTO public.sessions (id, expert_name, session_date, session_type, duration, status, can_review, has_reviewed) VALUES
(1, 'Mark Thompson', 'Today, 4:30 PM', 'Public Speaking Consultation', '50 minutes', 'upcoming', false, false),
(2, 'Dr. Emily Chen', 'Friday, 10:00 AM', 'Decision Making Session', '50 minutes', 'upcoming', false, false),
(3, 'Dr. Sarah Johnson', 'Yesterday, 2:00 PM', 'Anxiety Management Session', '50 minutes', 'completed', true, false),
(4, 'Mark Thompson', 'Last Week', 'Confidence Building', '45 minutes', 'completed', true, true);

-- Insert dashboard stats
INSERT INTO public.dashboard_stats (label, value, icon) VALUES
('Courses Completed', '3', 'Book'),
('Study Hours', '47', 'Clock'),
('Sessions Attended', '12', 'User'),
('Progress This Week', '+15%', 'TrendingUp');
