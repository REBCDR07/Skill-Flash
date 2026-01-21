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

async function fetchLocal<T>(path: string): Promise<T | null> {
  try {
    console.log(`fetchLocal: Requesting ${path}...`);
    const response = await fetch(path);
    if (!response.ok) {
      console.warn(`fetchLocal: HTTP ${response.status} for ${path}`);
      return null;
    }
    const data = await response.json();
    console.log(`fetchLocal: Successfully loaded JSON from ${path}`);
    return data;
  } catch (err) {
    console.warn(`fetchLocal: Error loading ${path}:`, err);
    return null;
  }
}

async function fetchTextLocal(path: string): Promise<string | null> {
  try {
    console.log(`fetchTextLocal: Requesting ${path}...`);
    const response = await fetch(path);
    if (!response.ok) {
      console.warn(`fetchTextLocal: HTTP ${response.status} for ${path}`);
      return null;
    }
    const text = await response.text();
    console.log(`fetchTextLocal: Successfully loaded text from ${path} (${text.length} chars)`);
    return text;
  } catch (err) {
    console.warn(`fetchTextLocal: Error loading ${path}:`, err);
    return null;
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

    if (data && data.length > 0) {
      console.log(`fetchCourses: Successfully fetched ${data.length} courses from Supabase.`);
      return data.map(c => ({
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
    }

    console.warn('fetchCourses: No courses found in Supabase. Falling back to local data...');
  } catch (err) {
    console.warn('fetchCourses: Supabase fetch failed. Falling back to local data...', err);
  }

  // Fallback to local JSON
  const localData = await fetchLocal<{ courses: Course[] }>('/courses/index.json');
  if (localData?.courses) {
    console.log(`fetchCourses: Successfully loaded ${localData.courses.length} courses from local fallback.`);
    return localData.courses;
  }

  return [];
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
      console.log(`fetchCourse: Successfully fetched ${courseId} from Supabase.`);
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
  } catch (err) {
    console.warn(`fetchCourse: Supabase fetch failed for ${courseId}. Falling back...`, err);
  }

  // Fallback
  const courses = await fetchCourses();
  return courses.find(c => c.id === courseId);
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

    if (data && data.length > 0) {
      console.log(`fetchChapters: Successfully fetched ${data.length} chapters from Supabase for ${courseId}.`);
      return data.map(ch => ({
        id: ch.order_index as number,
        title: ch.title as string,
        description: (ch.description as string) || '',
        duration: (ch.duration as string) || ''
      }));
    }
  } catch (err) {
    console.warn(`fetchChapters: Supabase fetch failed for ${courseId}. Falling back to local...`, err);
  }

  // Fallback
  const localData = await fetchLocal<{ chapters: Chapter[] }>(`/courses/${courseId}/chapters.json`);
  if (localData?.chapters) {
    console.log(`fetchChapters: Successfully loaded ${localData.chapters.length} chapters from local fallback for ${courseId}.`);
    return localData.chapters;
  }

  console.warn(`fetchChapters: No chapters found for ${courseId} in Supabase or Local.`);
  return [];
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

    if (data?.content) {
      console.log(`fetchChapterContent: Successfully fetched content from Supabase for ${courseId} ch:${chapterId}.`);
      return data.content;
    }
  } catch (err) {
    console.warn(`fetchChapterContent: Supabase fetch failed for ${courseId} ch:${chapterId}. Falling back to local...`, err);
  }

  // Fallback
  const localContent = await fetchTextLocal(`/courses/${courseId}/chapter-${chapterId}.md`);
  if (localContent) {
    console.log(`fetchChapterContent: Successfully loaded content from local fallback for ${courseId} ch:${chapterId}.`);
    return localContent;
  }

  console.warn(`fetchChapterContent: No content found for ${courseId} ch:${chapterId} in Supabase or Local.`);
  return '';
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
      const { data: questions, error: questionsError } = await fetchWithTimeout(
        supabase
          .from('questions')
          .select('*')
          .eq('quiz_id', quiz.id),
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
            correctAnswer: (q.correct_answer as number) !== undefined ? (q.correct_answer as number) : 0,
            explanation: (q.explanation as string) || ''
          }))
        };
      }
    }
  } catch (err) {
    console.warn(`fetchQCM: Supabase fetch failed for ${courseId}. Falling back to local...`, err);
  }

  // Fallback
  const localData = await fetchLocal<{ title: string; passingScore: number; questions: QCMQuestion[] }>(`/tests/qcm/${courseId}_qcm.json`);
  if (localData) return localData;

  throw new Error('QCM not found in Supabase or Local');
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
      const { data: questions, error: questionsError } = await fetchWithTimeout(
        supabase
          .from('questions')
          .select('*')
          .eq('quiz_id', quiz.id),
        SHORT_TIMEOUT
      ) as { data: Record<string, unknown>[] | null; error: Error | null };

      if (questions && questions.length > 0) {
        return {
          title: quiz.title,
          questions: questions.map((q, index) => ({
            id: index + 1,
            question: q.question as string,
            expectedKeywords: (q.expected_keywords as string[]) || [],
            sampleAnswer: (q.sample_answer as string) || ''
          }))
        };
      }
    }
  } catch (err) {
    console.warn(`fetchQR: Supabase fetch failed for ${courseId}. Falling back to local...`, err);
  }

  // Fallback
  const localData = await fetchLocal<{ title: string; questions: QRQuestion[] }>(`/tests/qr/${courseId}_qr.json`);
  if (localData) return localData;

  throw new Error('QR not found in Supabase or Local');
}
