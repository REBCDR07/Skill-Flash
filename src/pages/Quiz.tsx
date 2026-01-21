import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourse, fetchQCM, fetchQR } from '@/lib/courses';
import { useSubmitQuiz, useCreateCertification, useAddPoints, useQuizProgress } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';
import { generateCertificatePDF } from '@/lib/pdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Zap,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Award,
  Download,
  AlertCircle,
  HelpCircle,
  Trophy,
  Star,
  Timer,
  BookOpen,
  Layout,
  PauseCircle,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';

type QuizState = 'START' | 'QUESTIONS' | 'RESULTS';

interface Question {
  id: number;
  question: string;
  type: 'qcm' | 'qr';
  options?: string[];
  correctAnswer?: number;
  expectedKeywords?: string[];
  explanation?: string;
}

const Quiz = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [searchParams] = useSearchParams();
  const quizType = (searchParams.get('type') as 'module' | 'final') || 'final';
  const chapterId = searchParams.get('chapter') ? parseInt(searchParams.get('chapter')!) : undefined;

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { progress: savedProgressData, saveProgress, clearProgress, isLoading: progressLoading } = useQuizProgress(courseId);

  const [state, setState] = useState<QuizState>('START');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [qcmAnswers, setQcmAnswers] = useState<Record<number, number>>({});
  const [qrAnswers, setQrAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [isPassed, setIsPassed] = useState(false);

  useEffect(() => {
    console.log('Quiz: Mounting, checking for resume state');
    if (courseId && location.state?.resume && savedProgressData) {
      const progress = savedProgressData as any;
      setQcmAnswers(progress.answers?.qcm || {});
      setQrAnswers(progress.answers?.qr || {});
      setCurrentQuestionIndex(progress.currentQuestionIndex || 0);
      setState('QUESTIONS');
      toast.info('Test repris avec succès !');
    }
  }, [courseId, location.state, savedProgressData]);

  // Queries
  const { data: course } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourse(courseId!),
    enabled: !!courseId
  });

  const { data: qcmData } = useQuery({
    queryKey: ['qcm', courseId],
    queryFn: () => fetchQCM(courseId!),
    enabled: !!courseId
  });

  const { data: qrData } = useQuery({
    queryKey: ['qr', courseId],
    queryFn: () => fetchQR(courseId!),
    enabled: !!courseId && quizType === 'final'
  });

  // Mutations
  const { mutate: submitQuiz } = useSubmitQuiz();
  const { mutate: createCert } = useCreateCertification();
  const { mutate: addPoints } = useAddPoints();

  const allQuestions = useMemo(() => {
    const qcms = (qcmData?.questions || []).map(q => ({ ...q, type: 'qcm' as const }));
    const qrs = (quizType === 'final' ? (qrData?.questions || []).map(q => ({ ...q, type: 'qr' as const })) : []);
    return [...qcms, ...qrs] as Question[];
  }, [qcmData, qrData, quizType]);

  const currentQuestion = allQuestions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / allQuestions.length) * 100;

  const handlePause = () => {
    if (courseId) {
      saveProgress.mutate({
        courseId,
        progress: {
          currentQuestionIndex,
          answers: { qcm: qcmAnswers, qr: qrAnswers }
        }
      }, {
        onSuccess: () => {
          toast.success('Progression sauvegardée ! Vous pourrez reprendre plus tard.');
          navigate('/dashboard');
        }
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      calculateFinalScore();
    }
  };

  const calculateFinalScore = () => {
    let qcmCorrect = 0;
    let qrScoreTotal = 0;

    const qcmQuestions = allQuestions.filter(q => q.type === 'qcm');
    const qrQuestions = allQuestions.filter(q => q.type === 'qr');

    qcmQuestions.forEach(q => {
      if (qcmAnswers[q.id] === q.correctAnswer) {
        qcmCorrect++;
      }
    });

    qrQuestions.forEach(q => {
      const answer = (qrAnswers[q.id] || '').toLowerCase();
      const keywords = q.expectedKeywords || [];

      let foundCount = 0;
      keywords.forEach((kw: string) => {
        if (answer.includes(kw.toLowerCase())) {
          foundCount++;
        }
      });

      const qScore = keywords.length > 0 ? (foundCount / keywords.length) : 0;
      qrScoreTotal += qScore;
    });

    const totalPossibleQcm = qcmQuestions.length;
    const totalPossibleQr = qrQuestions.length;

    const finalScore = totalPossibleQcm + totalPossibleQr > 0
      ? ((qcmCorrect + qrScoreTotal) / (totalPossibleQcm + totalPossibleQr)) * 100
      : 0;

    const roundedScore = Math.round(finalScore);
    const passingScore = qcmData?.passingScore || 80;

    setScore(roundedScore);
    const passed = roundedScore >= passingScore;
    setIsPassed(passed);
    setState('RESULTS');

    if (courseId) {
      submitQuiz({
        course_id: courseId,
        quiz_type: quizType === 'final' ? 'final_qcm' : 'module',
        chapter_id: chapterId,
        score: roundedScore,
        total_questions: allQuestions.length,
        correct_answers: qcmCorrect + Math.round(qrScoreTotal),
        answers: { qcm: qcmAnswers, qr: qrAnswers }
      });

      if (quizType === 'module' && roundedScore >= 70) {
        addPoints(10);
      } else if (quizType === 'final' && passed) {
        addPoints(150);
        const verificationCode = `SF-${courseId}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        createCert({
          course_id: courseId,
          course_title: course?.title || courseId,
          final_score: roundedScore,
          verification_code: verificationCode
        });
      }
      clearProgress.mutate(courseId);
    }
  };

  const handleDownloadCert = async () => {
    const passingScore = qcmData?.passingScore || 80;
    if (score < passingScore) {
      toast.error(`Votre score (${score}%) est inférieur au seuil de réussite (${passingScore}%).`);
      return;
    }

    if (course && user) {
      const verificationCode = `SF-${courseId}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      await generateCertificatePDF({
        id: '',
        user_id: user.id,
        course_id: course.id,
        course_title: course.title,
        final_score: score,
        verification_code: verificationCode,
        issued_at: new Date().toISOString()
      }, user.user_metadata?.full_name || user.email || 'Étudiant');
      toast.success('Téléchargement du certificat lancé !');
    }
  };

  // START STATE - Mobile First
  if (state === 'START') {
    return (
      <div className="min-h-screen bg-background flex flex-col pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 relative overflow-hidden">
        <Navbar />

        {/* Animated background - responsive sizing */}
        <div className="absolute top-1/4 -right-10 sm:-right-20 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-[80px] sm:blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -left-10 sm:-left-20 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-[80px] sm:blur-[100px] animate-pulse delay-1000" />

        <div className="flex-1 container max-w-2xl mx-auto px-3 sm:px-4 md:px-6 flex flex-col justify-center relative z-10">
          <Card className="border-2 border-primary/20 bg-card/40 backdrop-blur-xl shadow-2xl rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
            <div className="h-2 sm:h-3 gradient-primary" />

            <CardHeader className="text-center pb-6 sm:pb-8 pt-8 sm:pt-10 md:pt-12 px-4 sm:px-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/10 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 md:mb-8 animate-bounce shadow-inner">
                <Zap className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary fill-primary/20" />
              </div>

              <CardTitle className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight mb-2 sm:mb-3 md:mb-4 px-2">
                {quizType === 'final' ? 'Test de Certification' : 'Évaluation de Module'}
              </CardTitle>

              <CardDescription className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium px-2">
                {course?.title || 'Chargement...'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 sm:space-y-8 px-4 sm:px-6 md:px-8 lg:px-12 pb-8 sm:pb-10 md:pb-12">
              {/* Stats Grid - Responsive */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-secondary/30 border border-border/50 text-center group hover:bg-secondary/50 transition-colors">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2 sm:mb-3" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Questions</p>
                  <p className="text-2xl sm:text-3xl font-display font-black">{allQuestions.length}</p>
                </div>

                <div className="p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl bg-secondary/30 border border-border/50 text-center group hover:bg-secondary/50 transition-colors">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 mx-auto mb-2 sm:mb-3" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Score Requis</p>
                  <p className="text-2xl sm:text-3xl font-display font-black text-primary">80%</p>
                </div>
              </div>

              {/* Guide Section - Responsive padding and text */}
              <div className="bg-muted/30 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-border/50 space-y-3 sm:space-y-4">
                <h4 className="font-bold text-base sm:text-lg flex items-center gap-2 sm:gap-3">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-spin-slow" />
                  Guide de Réussite
                </h4>
                <ul className="space-y-3 sm:space-y-4">
                  {[
                    "Réponses précises et réfléchies",
                    "Terminologie technique attendue",
                    "Aucune limite de temps, soyez serein",
                    "Certificat généré instantanément"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-foreground/80">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button - Responsive sizing */}
              <Button
                className="w-full h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] group text-base sm:text-lg md:text-xl font-bold shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 animate-in slide-in-from-bottom-8 duration-1000"
                size="lg"
                onClick={() => setState('QUESTIONS')}
              >
                Lancer le défi
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // QUESTIONS STATE - Mobile First
  if (state === 'QUESTIONS') {
    return (
      <div className="min-h-screen bg-background flex flex-col pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20">
        <Navbar />

        {/* Sticky Header - Mobile Optimized */}
        <div className="fixed top-16 sm:top-20 left-0 w-full z-40 px-2 sm:px-4">
          <div className="container max-w-6xl mx-auto bg-card/80 sm:bg-card/70 backdrop-blur-xl sm:backdrop-blur-2xl border border-border/50 rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-5 shadow-xl sm:shadow-2xl animate-in slide-in-from-top-4 duration-500">

            {/* Mobile Layout */}
            <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
              {/* Left: Question Counter */}
              <div className="flex items-center gap-2 sm:gap-3 md:gap-5 shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                  <Timer className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[8px] sm:text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-0.5">Avancement</p>
                  <p className="font-bold text-sm sm:text-base md:text-lg leading-none">
                    {currentQuestionIndex + 1} <span className="text-muted-foreground font-medium text-xs sm:text-sm">sur</span> {allQuestions.length}
                  </p>
                </div>
              </div>

              {/* Center: Progress Bar */}
              <div className="flex-grow flex items-center gap-2 sm:gap-3 md:gap-6">
                <div className="flex-grow">
                  <Progress value={progressPercent} className="h-2 sm:h-2.5 md:h-3 bg-secondary/50 shadow-inner rounded-full" />
                </div>
                <Badge className="h-7 sm:h-8 md:h-10 px-2 sm:px-4 md:px-6 rounded-xl sm:rounded-2xl bg-primary/10 text-primary border-none font-black text-xs sm:text-sm">
                  {Math.round(progressPercent)}%
                </Badge>
              </div>

              {/* Right: Pause Button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-muted-foreground hover:text-primary shrink-0"
                onClick={handlePause}
                title="Pause et Sauvegarder"
              >
                <PauseCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Mobile First Grid */}
        <main className="flex-1 container max-w-6xl mx-auto px-3 sm:px-4 md:px-6 mt-20 sm:mt-24 md:mt-28 mb-8 sm:mb-10 md:mb-12">
          <div key={currentQuestionIndex} className="space-y-6 sm:space-y-8 md:space-y-0 md:grid md:grid-cols-1 lg:grid-cols-2 md:gap-8 lg:gap-12 items-start">

            {/* Question Column - Mobile First */}
            <div className="space-y-4 sm:space-y-6 md:space-y-8 lg:sticky lg:top-48 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <Badge variant="outline" className="px-3 sm:px-4 py-1 sm:py-1.5 border-primary/30 text-primary uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[9px] sm:text-[10px] font-black bg-primary/5 rounded-full">
                  {currentQuestion?.type === 'qcm' ? 'QCM' : 'Réponse libre'}
                </Badge>

                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-display font-bold leading-tight sm:leading-[1.1] text-foreground tracking-tight">
                  {currentQuestion?.question}
                </h2>

                <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] bg-card/40 border border-border/50 backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-3 sm:p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <HelpCircle className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" />
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed relative z-10">
                    Prenez le temps de bien lire la question. {currentQuestion?.type === 'qcm'
                      ? "Choisissez la réponse qui vous semble la plus exacte."
                      : "Utilisez un vocabulaire technique précis."}
                  </p>
                </div>
              </div>
            </div>

            {/* Answers Column - Mobile First */}
            <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
              {currentQuestion?.type === 'qcm' ? (
                <div className="grid gap-3 sm:gap-4">
                  {currentQuestion.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setQcmAnswers({ ...qcmAnswers, [currentQuestion.id]: index })}
                      className={`w-full text-left p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl md:rounded-[2rem] border-2 transition-all duration-300 flex items-center justify-between group relative overflow-hidden
                        ${qcmAnswers[currentQuestion.id] === index
                          ? 'border-primary bg-primary/5 shadow-xl sm:shadow-2xl shadow-primary/10 scale-[1.01] sm:scale-[1.02]'
                          : 'border-border/40 hover:border-primary/30 hover:bg-card/40 active:scale-[0.99]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 md:gap-6 relative z-10 flex-1 min-w-0">
                        <div className={`w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center font-bold font-display text-base sm:text-lg md:text-xl transition-all shrink-0
                          ${qcmAnswers[currentQuestion.id] === index
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                            : 'bg-secondary/50 border-border/50 text-muted-foreground group-hover:border-primary/50'
                          }
                        `}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-snug break-words">{option}</span>
                      </div>

                      <div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative z-10 shrink-0 ml-2
                        ${qcmAnswers[currentQuestion.id] === index
                          ? 'border-primary bg-primary scale-110 shadow-lg shadow-primary/30'
                          : 'border-muted-foreground/20 opacity-0 group-hover:opacity-100'
                        }
                      `}>
                        {qcmAnswers[currentQuestion.id] === index && <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                      </div>

                      <div className={`absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/5 transition-opacity duration-500 ${qcmAnswers[currentQuestion.id] === index ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-25 transition duration-500" />
                    <Textarea
                      placeholder="Développez votre réponse ici..."
                      className="min-h-[200px] sm:min-h-[280px] md:min-h-[350px] text-base sm:text-lg md:text-xl p-4 sm:p-6 md:p-10 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border-2 bg-card/50 backdrop-blur-md focus-visible:ring-primary focus-visible:border-primary transition-all shadow-xl sm:shadow-2xl leading-relaxed resize-none"
                      value={qrAnswers[currentQuestion.id] || ''}
                      onChange={(e) => setQrAnswers({ ...qrAnswers, [currentQuestion.id]: e.target.value })}
                    />
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 md:gap-6 p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 text-amber-600 shadow-inner">
                    <HelpCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 shrink-0 mt-0.5 sm:mt-1" />
                    <div className="space-y-1 sm:space-y-2">
                      <p className="font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-xs">Conseil</p>
                      <p className="text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                        Soyez précis et structuré. L'algorithme valorise les termes techniques appropriés.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Footer - Mobile First */}
              <footer className="pt-4 sm:pt-6 md:pt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 md:gap-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 md:px-10 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] font-bold text-sm sm:text-base border-border/50 hover:bg-secondary/50 transition-all disabled:opacity-20 order-2 sm:order-1"
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                  <span className="hidden xs:inline">Précédent</span>
                  <span className="xs:hidden">Retour</span>
                </Button>

                <Button
                  size="lg"
                  className="flex-grow h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] text-base sm:text-lg md:text-xl font-bold shadow-xl sm:shadow-2xl shadow-primary/20 group order-1 sm:order-2"
                  onClick={handleNext}
                  disabled={
                    currentQuestion?.type === 'qcm'
                      ? qcmAnswers[currentQuestion.id] === undefined
                      : !qrAnswers[currentQuestion.id]?.trim()
                  }
                >
                  <span className="truncate">
                    {currentQuestionIndex === allQuestions.length - 1 ? 'Soumettre' : 'Continuer'}
                  </span>
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform shrink-0" />
                </Button>
              </footer>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // RESULTS STATE - Mobile First
  if (state === 'RESULTS') {
    return (
      <div className="min-h-screen bg-background flex flex-col pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 relative overflow-hidden">
        <Navbar />

        {isPassed && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[100px] sm:blur-[150px] animate-pulse" />
          </div>
        )}

        <div className="flex-grow container max-w-5xl mx-auto px-3 sm:px-4 md:px-6 flex flex-col justify-center relative z-10">
          <Card className="rounded-2xl sm:rounded-[2.5rem] md:rounded-[3rem] border-none shadow-xl sm:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] bg-card/60 backdrop-blur-xl overflow-hidden animate-in zoom-in-95 duration-700">
            <div className={`h-2 sm:h-3 ${isPassed ? 'gradient-primary' : 'bg-destructive/80'}`} />

            <div className="p-6 sm:p-8 md:p-12 lg:p-16 space-y-8 sm:space-y-10 md:space-y-12">

              {/* Top Section: Icon & Status - Mobile First */}
              <div className="flex flex-col items-center text-center space-y-5 sm:space-y-6 md:space-y-8 animate-in slide-in-from-top-8 duration-700 delay-200">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl transition-transform hover:scale-110 duration-500
                  ${isPassed ? 'bg-primary text-white shadow-primary/20' : 'bg-destructive text-white shadow-destructive/20'}
                `}>
                  {isPassed ? <Trophy className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" /> : <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16" />}
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight leading-tight px-4">
                    {isPassed ? 'Incroyable !' : 'Continuez vos efforts'}
                  </h2>
                  <Badge variant="outline" className={`px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 border-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest
                    ${isPassed ? 'border-primary/30 text-primary bg-primary/5' : 'border-destructive/30 text-destructive bg-destructive/5'}
                  `}>
                    {isPassed ? 'Certification Validée' : 'Échec à l\'examen'}
                  </Badge>
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Stats Grid - Mobile First */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                <div className="p-6 sm:p-7 md:p-8 rounded-2xl sm:rounded-[2rem] bg-secondary/30 border border-border/50 group hover:bg-secondary/40 transition-colors">
                  <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-[0.15em] sm:tracking-[0.2em] font-black mb-3 sm:mb-4">Score de réussite</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-4xl sm:text-5xl md:text-6xl font-display font-black leading-none ${isPassed ? 'text-primary' : 'text-destructive'}`}>
                      {score}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold opacity-40">%</span>
                  </div>
                </div>

                <div className="p-6 sm:p-7 md:p-8 rounded-2xl sm:rounded-[2rem] bg-secondary/30 border border-border/50 flex flex-col justify-center">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4 text-sm font-bold">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-inner ${isPassed ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                        {isPassed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </div>
                      <span className="text-base sm:text-lg">{isPassed ? 'Maîtrise confirmée' : 'Révision nécessaire'}</span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 text-sm font-bold opacity-60">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-muted flex items-center justify-center shadow-inner">
                        <Zap className="w-5 h-5" />
                      </div>
                      <span className="text-base sm:text-lg">+{isPassed ? '150' : '0'} points Flash</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Mobile First */}
              <div className="space-y-3 sm:space-y-4 animate-in fade-in duration-700 delay-500">
                {isPassed && quizType === 'final' && (
                  <Button
                    variant="default"
                    className="w-full h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] text-base sm:text-lg md:text-xl font-bold gap-3 sm:gap-4 shadow-xl sm:shadow-2xl shadow-primary/20 group"
                    onClick={handleDownloadCert}
                  >
                    <Download className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-bounce" />
                    <span className="truncate">Obtenir mon certificat</span>
                  </Button>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {!isPassed && (
                    <Button
                      variant="default"
                      className="h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] font-bold text-base sm:text-lg bg-primary text-white hover:bg-primary/90 shadow-xl shadow-primary/20 col-span-1 sm:col-span-2"
                      onClick={() => {
                        setScore(0);
                        setQcmAnswers({});
                        setQrAnswers({});
                        setCurrentQuestionIndex(0);
                        setState('START');
                      }}
                    >
                      <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                      Repasser le test
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] font-bold border-border/50 hover:bg-secondary/50 text-base sm:text-lg"
                    onClick={() => navigate('/catalog')}
                  >
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                    <span className="truncate">Catalogue</span>
                  </Button>
                  <Button
                    variant="secondary"
                    className="h-12 sm:h-14 md:h-16 rounded-xl sm:rounded-2xl md:rounded-[1.5rem] font-bold border-border/50 text-base sm:text-lg"
                    onClick={() => navigate('/dashboard')}
                  >
                    <Layout className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                    <span className="truncate">Dashboard</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Loading State
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-primary border-r-2" />
        <p className="text-lg sm:text-xl font-display font-bold animate-pulse text-center">Préparation du test...</p>
      </div>
    </div>
  );
};

export default Quiz;
