import { supabase } from "@/integrations/supabase/client";
import { Course, Chapter, QCMQuestion, QRQuestion } from '@/types/course';

const FETCH_TIMEOUT = 20000; // 20 seconds for general lists
const SHORT_TIMEOUT = 5000;  // 5 seconds for specific items to trigger fallback faster

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
    ) as { data: Record<string, unknown>[] | null; error: Error | null };

    if (error) {
      console.error('fetchCourses: Supabase error:', error);
      throw error;
    }

    return (data || []).map(c => ({
      id: c.id as string,
      title: c.title as string,
      description: (c.description as string) || '',
      category: c.category as 'development' | 'business',
      icon: (c.icon as string) || 'Code',
      color: (c.color as string) || 'blue',
      duration: (c.duration as string) || '',
      difficulty: (c.difficulty as string) || 'Débutant',
      chapters: (c.chapters_count as number) || 0,
      totalQuestions: (c.total_questions as number) || 0
    }));
  } catch (err) {
    console.error('fetchCourses: Supabase fetch failed:', err);
    return [];
  }
}

export async function fetchCourse(courseId: string): Promise<Course | undefined> {
  console.log(`fetchCourse: Starting fetch for ${courseId}...`);
  try {
    const { data, error } = await fetchWithTimeout(
      supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .maybeSingle(),
      SHORT_TIMEOUT
    ) as { data: Record<string, unknown> | null; error: Error | null };

    if (data) {
      return {
        id: data.id as string,
        title: data.title as string,
        description: (data.description as string) || '',
        category: data.category as 'development' | 'business',
        icon: (data.icon as string) || 'Code',
        color: (data.color as string) || 'blue',
        duration: (data.duration as string) || '',
        difficulty: (data.difficulty as string) || 'Débutant',
        chapters: (data.chapters_count as number) || 0,
        totalQuestions: (data.total_questions as number) || 0
      };
    }
    return undefined;
  } catch (err) {
    console.error(`fetchCourse: Supabase fetch failed for ${courseId}:`, err);
    return undefined;
  }
}

export async function fetchChapters(courseId: string): Promise<Chapter[]> {
  console.log(`fetchChapters: Starting fetch for ${courseId}...`);
  try {
    const { data, error } = await fetchWithTimeout(
      supabase
        .from('chapters')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true }),
      SHORT_TIMEOUT
    ) as { data: Record<string, unknown>[] | null; error: Error | null };

    return (data || []).map(ch => ({
      id: ch.order_index as number,
      title: ch.title as string,
      description: (ch.description as string) || '',
      duration: (ch.duration as string) || ''
    }));
  } catch (err) {
    console.error(`fetchChapters: Supabase fetch failed for ${courseId}:`, err);
    return [];
  }
}

export async function fetchChapterContent(courseId: string, chapterId: number): Promise<string> {
  console.log(`fetchChapterContent: Starting fetch for ${courseId} chapter ${chapterId}...`);
  try {
    const { data, error } = await fetchWithTimeout(
      supabase
        .from('chapters')
        .select('content')
        .eq('course_id', courseId)
        .eq('order_index', chapterId)
        .maybeSingle(),
      SHORT_TIMEOUT
    ) as { data: { content: string } | null; error: Error | null };

    return data?.content || '';
  } catch (err) {
    console.error(`fetchChapterContent: Supabase fetch failed for ${courseId} ch:${chapterId}:`, err);
    return '';
  }
}

export async function fetchQCM(courseId: string): Promise<{ title: string; passingScore: number; questions: QCMQuestion[] }> {
  try {
    const { data: quiz, error: quizError } = await fetchWithTimeout(
      supabase
        .from('quizzes')
        .select('id, title, passing_score')
        .eq('course_id', courseId)
        .eq('quiz_type', 'qcm')
        .maybeSingle(),
      SHORT_TIMEOUT
    ) as { data: { id: string; title: string; passing_score: number } | null; error: Error | null };

    if (quiz) {
      const { data: questions } = await fetchWithTimeout(
        supabase
          .from('questions')
          .select('*')
          .eq('quiz_id', quiz.id as any),
        SHORT_TIMEOUT
      ) as { data: Record<string, unknown>[] | null; error: Error | null };

      if (questions && questions.length > 0) {
        return {
          title: quiz.title,
          passingScore: quiz.passing_score || 80,
          questions: questions.map((q, index) => ({
            id: index + 1,
            question: q.question as string,
            options: (q.options as string[]) || [],
            correctAnswer: (q.correct_answer as number) !== undefined ? Number(q.correct_answer) : 0,
            explanation: (q.explanation as string) || ''
          }))
        };
      }
    }
    throw new Error('QCM quiz not found in Supabase');
  } catch (err) {
    console.error(`fetchQCM: Supabase fetch failed for ${courseId}:`, err);
    throw err;
  }
}

export async function fetchQR(courseId: string): Promise<{ title: string; questions: QRQuestion[] }> {
  try {
    const { data: quiz, error: quizError } = await fetchWithTimeout(
      supabase
        .from('quizzes')
        .select('id, title')
        .eq('course_id', courseId)
        .eq('quiz_type', 'qr')
        .maybeSingle(),
      SHORT_TIMEOUT
    ) as { data: { id: string; title: string } | null; error: Error | null };

    if (quiz) {
      const { data: questions } = await fetchWithTimeout(
        supabase
          .from('questions')
          .select('*')
          .eq('quiz_id', quiz.id as any),
        SHORT_TIMEOUT
      ) as { data: Record<string, unknown>[] | null; error: Error | null };

      if (questions && questions.length > 0) {
        return {
          title: quiz.title,
          questions: questions.map((q, index) => ({
            id: index + 1,
            question: q.question as string,
            expectedKeywords: (q.expected_keywords as string[]) || [],
            sampleAnswer: (q.sample_answer as string) || (q as unknown as Record<string, unknown>).answer as string || ''
          }))
        };
      }
    }
    throw new Error('QR quiz not found in Supabase');
  } catch (err) {
    console.error(`fetchQR: Supabase fetch failed for ${courseId}:`, err);
    throw err;
  }
}
