import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchCourse, fetchChapters, fetchChapterContent } from '@/lib/courses';
import { useCourseProgress, useUpdateProgress, useAddPoints } from '@/hooks/useProgress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  User,
  Lock,
  Layout
} from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navbar from '@/components/Navbar';

const Course = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [currentChapterId, setCurrentChapterId] = useState<number>(1);
  const { mutate: updateProgress } = useUpdateProgress();
  const { mutate: addPoints } = useAddPoints();

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

  const { data: progressData } = useCourseProgress(courseId);
  const progress = progressData as import('@/types/course').CourseProgress | undefined;

  const isCompleted = (id: number) => progress?.completed_chapters?.includes(id) || false;

  const handleChapterComplete = () => {
    if (!courseId) return;

    const currentCompleted = progress?.completed_chapters || [];
    const newCompleted = [...new Set([...currentCompleted, currentChapterId])];

    updateProgress({
      courseId,
      currentChapter: currentChapterId,
      completedChapters: newCompleted
    }, {
      onSuccess: () => {
        if (!currentCompleted.includes(currentChapterId)) {
          addPoints(10);
          toast.success('Chapitre terminé ! +10 points');
        }

        // Go to next chapter or quiz
        const currentIndex = chapters?.findIndex(c => c.id === currentChapterId) ?? -1;
        if (currentIndex < (chapters?.length ?? 0) - 1) {
          setCurrentChapterId(chapters![currentIndex + 1].id);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          toast.success('Félicitations ! Vous avez terminé tous les chapitres. Vous pouvez maintenant passer le test final.');
        }
      },
      onError: () => {
        toast.error('Erreur lors de la sauvegarde de la progression. Veuillez réessayer.');
      }
    });
  };

  console.log('Course: STATE -> courseLoading:', courseLoading, 'chaptersLoading:', chaptersLoading, 'course:', !!course, 'chapters:', chapters?.length || 0);

  if ((courseLoading || chaptersLoading) && (!course || !chapters)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!course) return <div>Cours non trouvé</div>;

  const currentChapter = chapters?.find(c => c.id === currentChapterId);

  return (
    <div className="min-h-screen bg-background flex flex-col pt-[73px]">
      <Navbar />
      {/* Header */}
      <header className="sticky top-[73px] z-40 glass border-b border-border/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/catalog">
            <Button variant="ghost" size="icon">
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
        <div className="flex items-center gap-2">
          {progress?.completed_chapters?.length === course.chapters ? (
            <Button onClick={() => navigate(`/quiz/${courseId}`)}>
              Passer le test final
              <Zap className="w-4 h-4 ml-2 fill-current" />
            </Button>
          ) : (
            <Link to="/dashboard">
              <Button variant="outline" size="sm" className="hidden md:flex">Quitter</Button>
            </Link>
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-80 border-r border-border/50 flex-col bg-sidebar-background">
          <div className="p-4 border-b border-sidebar-border/50">
            <h2 className="font-display font-semibold flex items-center gap-2">
              <Layout className="w-4 h-4 text-primary" />
              Sommaire
            </h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {chapters?.map((chapter, index) => {
                const active = chapter.id === currentChapterId;
                const completed = isCompleted(chapter.id);
                // Lock if previous chapter is not completed (ignoring first chapter)
                const isLocked = index > 0 && !isCompleted(chapters[index - 1].id);

                return (
                  <button
                    key={chapter.id}
                    disabled={isLocked}
                    onClick={() => {
                      if (!isLocked) {
                        setCurrentChapterId(chapter.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left group relative
                      ${active ? 'bg-primary text-white shadow-lg' : 'hover:bg-sidebar-accent text-sidebar-foreground'}
                      ${isLocked ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''}
                    `}
                  >
                    <div className="mt-0.5 shrink-0">
                      {completed ? (
                        <CheckCircle2 className={`w-4 h-4 ${active ? 'text-white' : 'text-success'}`} />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <PlayCircle className={`w-4 h-4 ${active ? 'text-white' : 'text-muted-foreground group-hover:text-primary'}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-tight truncate ${active ? 'text-white' : 'text-sidebar-foreground'}`}>
                        {chapter.title}
                      </p>
                      <div className={`flex items-center gap-2 mt-1 text-[10px] ${active ? 'text-white/80' : 'text-muted-foreground'}`}>
                        <Clock className="w-3 h-3" />
                        {chapter.duration}
                      </div>
                    </div>
                    {isLocked && (
                      <div className="absolute inset-0 bg-background/10 backdrop-blur-[1px] rounded-lg" />
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 py-8 lg:px-12 bg-background">
          <div className="max-w-3xl mx-auto">
            {currentChapter && (
              <div className="mb-8">
                <Badge variant="outline" className="mb-2 text-primary border-primary/20 bg-primary/5">
                  Chapitre {currentChapterId}
                </Badge>
                <h2 className="text-3xl font-display font-bold mb-4">{currentChapter.title}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground pb-8 border-b border-border/50">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-4 h-4" /> {currentChapter.duration}
                  </span>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="flex items-center gap-1.5 font-medium">
                    <Layout className="w-4 h-4" /> {course.difficulty}
                  </span>
                </div>
              </div>
            )}

            <div className="prose prose-slate dark:prose-invert max-w-none 
              prose-headings:font-display prose-headings:font-bold 
              prose-h1:text-4xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
              prose-p:text-lg prose-p:leading-relaxed prose-p:text-muted-foreground
              prose-strong:text-foreground prose-strong:font-bold
              prose-pre:bg-secondary prose-pre:rounded-xl prose-pre:p-6
              prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1 prose-code:rounded
              prose-img:rounded-2xl prose-img:shadow-xl
              prose-ul:list-disc prose-li:text-muted-foreground
            ">
              {contentLoading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-5/6"></div>
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
                </div>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || ''}
                </ReactMarkdown>
              )}
            </div>

            {progress?.completed_chapters?.length === course.chapters ? (
              <div className="mt-16 animate-in slide-in-from-bottom-8 duration-700">
                <div className="p-8 rounded-[2rem] bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-2 border-amber-500/20 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg rotate-3">
                    <Zap className="w-10 h-10 text-white fill-white" />
                  </div>
                  <div className="text-center md:text-left flex-1 space-y-2">
                    <h3 className="text-2xl font-black text-gray-900">Cours terminé !</h3>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      Vous avez acquis toutes les connaissances nécessaires. Lancez le test final pour valider votre expertise et obtenir votre certificat.
                    </p>
                  </div>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black h-14 px-8 rounded-xl shadow-xl hover:shadow-amber-500/25 transition-all hover:scale-105 shrink-0"
                    onClick={() => navigate(`/quiz/${courseId}`)}
                  >
                    PASSER LE TEST FINAL
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-6 pb-12">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    disabled={currentChapterId === 1}
                    onClick={() => {
                      const prevId = chapters?.[chapters?.findIndex(c => c.id === currentChapterId) - 1]?.id;
                      if (prevId) {
                        setCurrentChapterId(prevId);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    disabled={currentChapterId === chapters?.[chapters.length - 1]?.id}
                    onClick={() => {
                      const nextId = chapters?.[chapters?.findIndex(c => c.id === currentChapterId) + 1]?.id;
                      // Strict progression: only allow next if current is completed
                      if (nextId && isCompleted(currentChapterId)) {
                        setCurrentChapterId(nextId);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      } else {
                        toast.error("Veuillez terminer ce chapitre avant de passer au suivant.");
                      }
                    }}
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    size="lg"
                    className="gradient-primary text-white shadow-glow"
                    onClick={handleChapterComplete}
                  >
                    {isCompleted(currentChapterId) ? 'Chapitre suivant' : 'Marquer comme terminé'}
                    <CheckCircle2 className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Course;
