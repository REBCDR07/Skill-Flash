import { supabase } from "@/integrations/supabase/client";
import { Course, Chapter, QCMQuestion, QRQuestion } from '@/types/course';

const FETCH_TIMEOUT = 10000; // Increase to 10 seconds for better reliability

async function fetchWithTimeout<T>(promise: PromiseLike<T>, timeoutMs: number = FETCH_TIMEOUT): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Fetch timeout reached after ${timeoutMs}ms. Please check your internet connection and Supabase project status.`));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result as T;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

export async function fetchCourses(): Promise<Course[]> {
  console.log('fetchCourses: Starting fetch sequence...');
  try {
    const { data, error } = await fetchWithTimeout(
      supabase
        .from('courses')
        .select('*')
    ) as { data: any[] | null; error: any };

    if (error) {
      console.error('fetchCourses: Supabase error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('fetchCourses: No courses found in database.');
      return [];
    }

    console.log(`fetchCourses: Successfully fetched ${data.length} courses.`);

    return data.map(c => ({
      id: c.id,
      title: c.title,
      description: c.description || '',
      category: c.category as 'development' | 'business',
      icon: c.icon || 'Code',
      color: c.color || 'blue',
      duration: c.duration || '',
      difficulty: c.difficulty || 'Débutant',
      chapters: c.chapters_count || 0,
      totalQuestions: c.total_questions || 0
    }));
  } catch (err) {
    console.error('fetchCourses: Critical failure:', err);
    return []; // Return empty array on failure instead of hanging
  }
}

export async function fetchCourse(courseId: string): Promise<Course | undefined> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single();

  if (error) return undefined;

  return {
    id: data.id,
    title: data.title,
    description: data.description || '',
    category: data.category as 'development' | 'business',
    icon: data.icon || 'Code',
    color: data.color || 'blue',
    duration: data.duration || '',
    difficulty: data.difficulty || 'Débutant',
    chapters: data.chapters_count || 0,
    totalQuestions: data.total_questions || 0
  };
}

export async function fetchChapters(courseId: string): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from('chapters')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });

  if (error) throw error;

  return data.map(ch => ({
    id: ch.order_index,
    title: ch.title,
    description: ch.description || '',
    duration: ch.duration || ''
  }));
}

export async function fetchChapterContent(courseId: string, chapterId: number): Promise<string> {
  const { data, error } = await supabase
    .from('chapters')
    .select('content')
    .eq('course_id', courseId)
    .eq('order_index', chapterId)
    .single();

  if (error) throw error;
  return data.content || '';
}

export async function fetchQCM(courseId: string): Promise<{ title: string; passingScore: number; questions: QCMQuestion[] }> {
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('id, title, passing_score')
    .eq('course_id', courseId)
    .eq('quiz_type', 'qcm')
    .maybeSingle();

  if (quizError) throw quizError;
  if (!quiz) throw new Error('QCM not found');

  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .eq('quiz_id', quiz.id);

  if (questionsError) throw questionsError;

  return {
    title: quiz.title,
    passingScore: quiz.passing_score || 80,
    questions: questions.map((q, index) => ({
      id: index + 1,
      question: q.question,
      options: (q.options as string[]) || [],
      correctAnswer: q.correct_answer || 0,
      explanation: q.explanation || ''
    }))
  };
}

export async function fetchQR(courseId: string): Promise<{ title: string; questions: QRQuestion[] }> {
  const { data: quiz, error: quizError } = await supabase
    .from('quizzes')
    .select('id, title')
    .eq('course_id', courseId)
    .eq('quiz_type', 'qr')
    .maybeSingle();

  if (quizError) throw quizError;
  if (!quiz) throw new Error('QR not found');

  const { data: questions, error: questionsError } = await supabase
    .from('questions')
    .select('*')
    .eq('quiz_id', quiz.id);

  if (questionsError) throw questionsError;

  return {
    title: quiz.title,
    questions: questions.map((q, index) => ({
      id: index + 1,
      question: q.question,
      expectedKeywords: (q.expected_keywords as string[]) || [],
      sampleAnswer: q.sample_answer || ''
    }))
  };
}
