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
  quiz?: QCMQuestion[];
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

export interface ChapterQuiz {
  chapterId: number;
  questions: QCMQuestion[];
  passingScore: number;
}

export interface LocalProgress {
  completedChapters: number[];
  quizScores: Record<number, number>;
}
