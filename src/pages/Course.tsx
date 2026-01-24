import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchCourse, fetchChapters, fetchChapterContent } from '@/lib/courses';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Zap,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Clock,
  ArrowRight,
  Lock,
  Layout,
  Trophy,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

const Course = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [currentChapterId, setCurrentChapterId] = useState<number>(1);
  const [localProgress, setLocalProgress] = useState<{ completedChapters: number[] }>({
    completedChapters: [],
  });

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sf_progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed[courseId!]) {
          setLocalProgress(parsed[courseId!]);
        }
      } catch (e) {
        console.error('Failed to load progress', e);
      }
    }
  }, [courseId]);

  // Save progress to localStorage
  const saveProgress = (newProgress: typeof localProgress) => {
    const saved = localStorage.getItem('sf_progress') || '{}';
    const allProgress = JSON.parse(saved);
    allProgress[courseId!] = newProgress;
    localStorage.setItem('sf_progress', JSON.stringify(allProgress));
    setLocalProgress(newProgress);
  };

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourse(courseId!),
    enabled: !!courseId
  });

  const { data: chapters, isLoading: chaptersLoading } = useQuery({
    queryKey: ['chapters', courseId],
    queryFn: () => fetchChapters(courseId!),
    enabled: !!courseId
  });

  const { data: content, isLoading: contentLoading } = useQuery({
    queryKey: ['chapter-content', courseId, currentChapterId],
    queryFn: () => fetchChapterContent(courseId!, currentChapterId),
    enabled: !!courseId && !!currentChapterId
  });

  const isCompleted = (id: number) => localProgress.completedChapters.includes(id);

  const handleChapterAction = () => {
    // Validate current chapter
    const newCompleted = [...new Set([...localProgress.completedChapters, currentChapterId])];
    saveProgress({ completedChapters: newCompleted });

    const currentIndex = chapters?.findIndex(c => c.id === currentChapterId) ?? -1;
    if (currentIndex < (chapters?.length ?? 0) - 1) {
      // Go to next chapter
      setCurrentChapterId(chapters![currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Last chapter reached, redirect to final test
      navigate(`/quiz/${courseId}`);
    }
  };

  if ((courseLoading || chaptersLoading) && (!course || !chapters)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!course) return <div>Cours non trouvé</div>;

  const currentChapter = chapters?.find(c => c.id === currentChapterId);
  const isLastChapter = currentChapterId === (chapters?.[chapters.length - 1]?.id);

  return (
    <div className="min-h-screen bg-background flex flex-col pt-[73px]">
      <Navbar />

      {/* Header */}
      <header className="sticky top-[73px] z-40 glass border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/catalog">
            <Button variant="ghost" size="icon" className="rounded-xl">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-display font-bold leading-tight">{course.title}</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              Chapitre {currentChapterId} sur {course.chapters}
            </p>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto flex gap-12 relative">
        {/* Sidebar - Sticky */}
        <aside className="hidden lg:block w-80 shrink-0 sticky top-[146px] h-[calc(100vh-146px)] overflow-y-auto py-8 no-scrollbar">
          <div className="mb-6 px-2">
            <h2 className="font-display font-black text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <Layout className="w-3.5 h-3.5" />
              SOMMAIRE DU CURSUS
            </h2>
          </div>
          <div className="space-y-1">
            {chapters?.map((chapter, index) => {
              const active = chapter.id === currentChapterId;
              const completed = isCompleted(chapter.id);
              const isLocked = index > 0 && !isCompleted(chapters[index - 1].id) && !active;

              return (
                <button
                  key={chapter.id}
                  disabled={isLocked}
                  onClick={() => !isLocked && setCurrentChapterId(chapter.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all text-left group relative
                    ${active ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02] z-10' : 'hover:bg-secondary/50 text-foreground'}
                    ${isLocked ? 'opacity-40 cursor-not-allowed grayscale' : ''}
                  `}
                >
                  <div className="mt-0.5 shrink-0">
                    {completed ? (
                      <CheckCircle2 className={`w-5 h-5 ${active ? 'text-white' : 'text-success'}`} />
                    ) : isLocked ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${active ? 'border-white text-white' : 'border-muted-foreground text-muted-foreground'}`}>
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold leading-tight truncate ${active ? 'text-white' : 'text-foreground'}`}>
                      {chapter.title}
                    </p>
                    <div className={`flex items-center gap-2 mt-1 text-[10px] font-medium ${active ? 'text-white/70' : 'text-muted-foreground'}`}>
                      <Clock className="w-3 h-3" />
                      {chapter.duration}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 py-12 px-2 lg:px-0">
          <div className="max-w-3xl mx-auto">
            {currentChapter && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Badge variant="outline" className="px-4 py-1.5 border-primary/30 text-primary uppercase tracking-[0.2em] text-[10px] font-black bg-primary/5 rounded-full">
                    ÉTAPE {currentChapterId} / {course.chapters}
                  </Badge>
                  {isCompleted(currentChapterId) && (
                    <Badge className="bg-success/10 text-success border-success/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest">
                      LU
                    </Badge>
                  )}
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-black mb-8 leading-[1.1] tracking-tight">{currentChapter.title}</h2>
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pb-8 border-b border-border/50">
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary/30 rounded-xl font-bold">
                    <Clock className="w-4 h-4 text-primary" /> {currentChapter.duration} de lecture
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary/30 rounded-xl font-bold">
                    <Layout className="w-4 h-4 text-primary" /> Niveau {course.difficulty}
                  </div>
                </div>
              </div>
            )}

            <div className="prose prose-slate dark:prose-invert max-w-none 
              prose-headings:font-display prose-headings:font-black 
              prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:tracking-tight
              prose-p:text-xl prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-400
              prose-strong:text-foreground prose-strong:font-black
              prose-pre:bg-slate-900 prose-pre:rounded-2xl prose-pre:p-8 prose-pre:shadow-2xl
              prose-code:text-primary prose-code:bg-primary/5 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-lg prose-code:font-bold
              prose-img:rounded-[2.5rem] prose-img:shadow-2xl
              prose-ul:list-disc prose-li:text-lg prose-li:font-medium
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl
            ">
              {contentLoading ? (
                <div className="space-y-8 py-12">
                  <div className="h-10 bg-muted animate-pulse rounded-2xl w-3/4"></div>
                  <div className="space-y-4">
                    <div className="h-6 bg-muted animate-pulse rounded-xl w-full"></div>
                    <div className="h-6 bg-muted animate-pulse rounded-xl w-full"></div>
                    <div className="h-6 bg-muted animate-pulse rounded-xl w-5/6"></div>
                  </div>
                  <div className="h-[300px] bg-muted animate-pulse rounded-[2.5rem] w-full"></div>
                </div>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || ''}
                </ReactMarkdown>
              )}
            </div>

            <div className="mt-20 pt-10 border-t-2 border-border/30 flex flex-col sm:flex-row items-center justify-between gap-8 pb-20">
              <Button
                variant="ghost"
                size="lg"
                className="rounded-2xl h-16 px-8 font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/50 group"
                disabled={currentChapterId === 1}
                onClick={() => {
                  const prevId = chapters?.[chapters?.findIndex(c => c.id === currentChapterId) - 1]?.id;
                  if (prevId) {
                    setCurrentChapterId(prevId);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                <ChevronLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" />
                Chapitre précédent
              </Button>

              <Button
                size="lg"
                className={`h-20 px-12 rounded-[1.5rem] text-xl font-black shadow-2xl transition-all active:scale-95 group overflow-hidden relative
                   ${isLastChapter ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'gradient-primary text-white shadow-primary/20'}
                `}
                onClick={handleChapterAction}
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-3">
                  {isLastChapter ? 'PASSER LE TEST FINAL' : 'CHAPITRE SUIVANT'}
                  {isLastChapter ? <Sparkles className="w-6 h-6 animate-pulse" /> : <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
                </span>
                {isLastChapter && (
                  <div className="absolute -right-4 -top-4 w-12 h-12 bg-white/20 rounded-full blur-xl" />
                )}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Course;
