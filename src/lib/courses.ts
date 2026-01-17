import { Course, Chapter, QCMQuestion, QRQuestion } from '@/types/course';

const BASE_URL = '/courses';
const TESTS_URL = '/tests';

export async function fetchCourses(): Promise<Course[]> {
  const response = await fetch(`${BASE_URL}/index.json`);
  if (!response.ok) throw new Error('Failed to fetch courses');
  const data = await response.json();
  return data.courses;
}

export async function fetchCourse(courseId: string): Promise<Course | undefined> {
  const courses = await fetchCourses();
  return courses.find(c => c.id === courseId);
}

export async function fetchChapters(courseId: string): Promise<Chapter[]> {
  const response = await fetch(`${BASE_URL}/${courseId}/chapters.json`);
  if (!response.ok) throw new Error('Failed to fetch chapters');
  const data = await response.json();
  return data.chapters;
}

export async function fetchChapterContent(courseId: string, chapterId: number): Promise<string> {
  const response = await fetch(`${BASE_URL}/${courseId}/chapter-${chapterId}.md`);
  if (!response.ok) throw new Error('Failed to fetch chapter content');
  return response.text();
}

export async function fetchQCM(courseId: string): Promise<{ title: string; passingScore: number; questions: QCMQuestion[] }> {
  const response = await fetch(`${TESTS_URL}/qcm/${courseId}_qcm.json`);
  if (!response.ok) throw new Error('Failed to fetch QCM');
  return response.json();
}

export async function fetchQR(courseId: string): Promise<{ title: string; questions: QRQuestion[] }> {
  const response = await fetch(`${TESTS_URL}/qr/${courseId}_qr.json`);
  if (!response.ok) throw new Error('Failed to fetch QR');
  return response.json();
}
