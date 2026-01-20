import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const COURSES_PATH = path.join(process.cwd(), 'public/courses');
const TESTS_PATH = path.join(process.cwd(), 'public/tests');

async function seed() {
  console.log('Starting seeding...');

  // 1. Read courses index
  const coursesIndex = JSON.parse(fs.readFileSync(path.join(COURSES_PATH, 'index.json'), 'utf8'));

  for (const courseData of coursesIndex.courses) {
    console.log(`Processing course: ${courseData.title}`);

    // Insert course
    const { error: courseError } = await supabase.from('courses').upsert({
      id: courseData.id,
      title: courseData.title,
      description: courseData.description,
      category: courseData.category,
      icon: courseData.icon,
      color: courseData.color,
      duration: courseData.duration,
      difficulty: courseData.difficulty,
      chapters_count: courseData.chapters,
      total_questions: courseData.totalQuestions
    });

    if (courseError) {
      console.error(`Error inserting course ${courseData.id}:`, courseError);
      continue;
    }

    // 2. Read chapters
    const chaptersPath = path.join(COURSES_PATH, courseData.id, 'chapters.json');
    if (fs.existsSync(chaptersPath)) {
      const chaptersData = JSON.parse(fs.readFileSync(chaptersPath, 'utf8'));
      // Handle both { chapters: [...] } and [...]
      const chaptersArray = Array.isArray(chaptersData) ? chaptersData : (chaptersData.chapters || []);

      for (const chapter of chaptersArray) {
        const contentPath = path.join(COURSES_PATH, courseData.id, `chapter-${chapter.id}.md`);
        let content = '';
        if (fs.existsSync(contentPath)) {
          content = fs.readFileSync(contentPath, 'utf8');
        }

        const { error: chapterError } = await supabase.from('chapters').upsert({
          course_id: courseData.id,
          order_index: chapter.id,
          title: chapter.title,
          description: chapter.description || '',
          duration: chapter.duration || '',
          content: content
        }, { onConflict: 'course_id, order_index' });

        if (chapterError) console.error(`Error inserting chapter ${chapter.id} for course ${courseData.id}:`, chapterError);
      }
    }

    // 3. Read QCM
    const qcmPath = path.join(TESTS_PATH, 'qcm', `${courseData.id}_qcm.json`);
    if (fs.existsSync(qcmPath)) {
      const qcmData = JSON.parse(fs.readFileSync(qcmPath, 'utf8'));
      const qcmQuestions = Array.isArray(qcmData) ? qcmData : (qcmData.questions || []);

      const { data: quiz, error: quizError } = await supabase.from('quizzes').upsert({
        course_id: courseData.id,
        title: qcmData.title || `${courseData.title} - QCM`,
        passing_score: qcmData.passingScore || 80,
        quiz_type: 'qcm'
      }, { onConflict: 'course_id, quiz_type' }).select().single();

      if (quizError) {
        console.error(`Error inserting QCM quiz for ${courseData.id}:`, quizError);
      } else if (quiz) {
        for (const q of qcmQuestions) {
          await supabase.from('questions').upsert({
            quiz_id: quiz.id,
            question: q.question,
            options: q.options || [],
            correct_answer: q.correctAnswer !== undefined ? q.correctAnswer : 0,
            explanation: q.explanation || ''
          }, { onConflict: 'quiz_id, question' });
        }
      }
    }

    // 4. Read QR
    const qrPath = path.join(TESTS_PATH, 'qr', `${courseData.id}_qr.json`);
    if (fs.existsSync(qrPath)) {
      const qrData = JSON.parse(fs.readFileSync(qrPath, 'utf8'));
      const qrQuestions = Array.isArray(qrData) ? qrData : (qrData.questions || []);

      const { data: quiz, error: quizError } = await supabase.from('quizzes').upsert({
        course_id: courseData.id,
        title: qrData.title || `${courseData.title} - Expertise`,
        quiz_type: 'qr',
        passing_score: 80
      }, { onConflict: 'course_id, quiz_type' }).select().single();

      if (quizError) {
        console.error(`Error inserting QR quiz for ${courseData.id}:`, quizError);
      } else if (quiz) {
        for (const q of qrQuestions) {
          await supabase.from('questions').upsert({
            quiz_id: quiz.id,
            question: q.question,
            expected_keywords: q.expectedKeywords || [],
            sample_answer: q.sampleAnswer || q.answer || ''
          }, { onConflict: 'quiz_id, question' });
        }
      }
    }
  }

  console.log('Seeding completed!');
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
