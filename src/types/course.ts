export interface Course {
  id: string;
  title: string;
  description: string;
  category: 'development' | 'business';
  icon: string;
  color: string;
  duration: string;
  difficulty: string;
  chapters: number;
  totalQuestions: number;
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  duration: string;
}

export interface QCMQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QRQuestion {
  id: number;
  question: string;
  expectedKeywords: string[];
  sampleAnswer: string;
}

export interface CourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  current_chapter: number;
  completed_chapters: number[];
  started_at: string;
  completed_at: string | null;
}

export interface QuizResult {
  id: string;
  user_id: string;
  course_id: string;
  quiz_type: 'module' | 'final_qcm' | 'final_qr';
  chapter_id?: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  answers?: Record<string, any>;
  completed_at: string;
}

export interface Certification {
  id: string;
  user_id: string;
  course_id: string;
  course_title: string;
  final_score: number;
  verification_code: string;
  issued_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  total_points: number;
  created_at: string;
  updated_at: string;
}
