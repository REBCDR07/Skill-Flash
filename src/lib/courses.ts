import { Course, Chapter, QCMQuestion, QRQuestion, ChapterQuiz } from '@/types/course';

const BASE_URL = '/courses';

export async function fetchCourses(): Promise<Course[]> {
  const response = await fetch(`${BASE_URL}/index.json`);
  const data = await response.json();
  return data.courses;
}

export async function fetchCourse(courseId: string): Promise<Course | undefined> {
  const courses = await fetchCourses();
  return courses.find(c => c.id === courseId);
}

export async function fetchChapters(courseId: string): Promise<Chapter[]> {
  try {
    const response = await fetch(`${BASE_URL}/${courseId}/chapters.json`);
    const data = await response.json();
    return data.chapters;
  } catch (e) {
    console.error(`Failed to fetch chapters for ${courseId}`, e);
    return [];
  }
}

export async function fetchChapterContent(courseId: string, chapterId: number): Promise<string> {
  try {
    const response = await fetch(`${BASE_URL}/${courseId}/chapter-${chapterId}.md`);
    if (!response.ok) throw new Error('Failed to fetch MD');
    return await response.text();
  } catch (e) {
    console.error(`Failed to fetch content for ${courseId} chapter ${chapterId}`, e);
    return '# Contenu non disponible\nDésolé, le contenu de ce chapitre est introuvable.';
  }
}

export async function fetchChapterQuiz(courseId: string, chapterId: number): Promise<ChapterQuiz> {
  try {
    const response = await fetch(`/tests/qcm/${courseId}_qcm.json`);
    const data = await response.json();
    const allQuestions = data.questions || [];

    // Intelligent partitioning
    const chaptersCount = 10; // Default target
    const questionsPerChapter = Math.max(1, Math.floor(allQuestions.length / chaptersCount));

    const startIdx = (chapterId - 1) * questionsPerChapter;
    const questions = allQuestions.slice(startIdx, startIdx + questionsPerChapter);

    return {
      chapterId,
      questions: questions.length > 0 ? questions : allQuestions.slice(0, 1), // fallback to first question if out of bounds
      passingScore: 60
    };
  } catch (e) {
    console.error(`Failed to fetch quiz for ${courseId}`, e);
    return { chapterId, questions: [], passingScore: 60 };
  }
}

export async function fetchQCM(courseId: string): Promise<{ title: string; passingScore: number; questions: QCMQuestion[] }> {
  try {
    const response = await fetch(`/tests/qcm/${courseId}_qcm.json`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();

    return {
      title: data.title || `Certification ${courseId}`,
      passingScore: 75,
      questions: data.questions.slice(0, 20) // Take up to 20
    };
  } catch (e) {
    console.error(`Error fetching QCM for ${courseId}`, e);
    // Generic fallback for development/safety
    return {
      title: "Examen de Certification",
      passingScore: 75,
      questions: [
        { id: 999, question: "Confirmation des connaissances ?", options: ["Oui", "Absolument", "Sans aucun doute", "Totalement"], correctAnswer: 1, explanation: "Validation de base." }
      ]
    };
  }
}

export async function fetchQR(courseId: string): Promise<{ title: string; questions: QRQuestion[] }> {
  try {
    const response = await fetch(`/tests/qr/${courseId}_qr.json`);
    const data = await response.json();
    return {
      title: data.title || "Questions de réflexion",
      questions: data.questions || []
    };
  } catch (e) {
    return { title: "Questions", questions: [] };
  }
}
