-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    icon TEXT,
    color TEXT,
    duration TEXT,
    difficulty TEXT,
    chapters_count INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create chapters table
CREATE TABLE IF NOT EXISTS chapters (
    id SERIAL PRIMARY KEY,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    -- Markdown content
    duration TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (course_id, order_index)
);
-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    passing_score INTEGER DEFAULT 80,
    quiz_type TEXT NOT NULL,
    -- 'qcm' or 'qr'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (course_id, quiz_type)
);
-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB,
    -- For QCM: ["Option A", "Option B", ...]
    correct_answer INTEGER,
    -- For QCM: index of correct option
    explanation TEXT,
    -- For QCM
    expected_keywords JSONB,
    -- For QR: ["keyword1", "keyword2", ...]
    sample_answer TEXT,
    -- For QR
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (quiz_id, question)
);
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create user_quiz_progress table
CREATE TABLE IF NOT EXISTS user_quiz_progress (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    progress JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, course_id)
);
-- Enable RLS for profiles and quiz progress
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quiz_progress ENABLE ROW LEVEL SECURITY;
-- Profiles RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR
SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles FOR
UPDATE USING (auth.uid() = user_id);
-- Quiz Progress RLS Policies
CREATE POLICY "Users can manage their own quiz progress" ON user_quiz_progress FOR ALL USING (auth.uid() = user_id);
-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger AS $$ BEGIN
INSERT INTO public.profiles (user_id, full_name, username)
VALUES (
        new.id,
        COALESCE(
            new.raw_user_meta_data->>'full_name',
            split_part(new.email, '@', 1)
        ),
        split_part(new.email, '@', 1)
    );
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Drop trigger if exists to avoid errors on reapplying
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    course_title TEXT NOT NULL,
    final_score INTEGER NOT NULL,
    verification_code TEXT NOT NULL UNIQUE,
    issued_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create course_progress table
CREATE TABLE IF NOT EXISTS course_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    current_chapter INTEGER DEFAULT 1,
    completed_chapters INTEGER [] DEFAULT '{}',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE (user_id, course_id)
);
-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES courses(id) ON DELETE CASCADE,
    quiz_type TEXT NOT NULL,
    chapter_id INTEGER,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    answers JSONB,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);
-- Reset existing user data for reliability
TRUNCATE TABLE certifications CASCADE;
TRUNCATE TABLE quiz_results CASCADE;
TRUNCATE TABLE course_progress CASCADE;
TRUNCATE TABLE user_quiz_progress CASCADE;
UPDATE profiles
SET total_points = 0;
-- Function to add points to a profile
CREATE OR REPLACE FUNCTION add_points(p_user_id UUID, p_points INTEGER) RETURNS VOID AS $$ BEGIN
UPDATE profiles
SET total_points = total_points + p_points,
    updated_at = NOW()
WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
-- RLS Policies (Read access for everyone, Write access restricted)
CREATE POLICY "Courses are viewable by everyone" ON courses FOR
SELECT USING (true);
CREATE POLICY "Chapters are viewable by everyone" ON chapters FOR
SELECT USING (true);
CREATE POLICY "Quizzes are viewable by everyone" ON quizzes FOR
SELECT USING (true);
CREATE POLICY "Questions are viewable by everyone" ON questions FOR
SELECT USING (true);
-- User-specific data policies
CREATE POLICY "Users can view their own certifications" ON certifications FOR
SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own certifications" ON certifications FOR
INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can manage their own course progress" ON course_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own quiz results" ON quiz_results FOR ALL USING (auth.uid() = user_id);