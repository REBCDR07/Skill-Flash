import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourse, fetchQCM, fetchQR } from '@/lib/courses';
import { useSubmitQuiz, useCreateCertification, useAddPoints } from '@/hooks/useProgress';
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
  Layout
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
  const { user } = useAuth();

  const [state, setState] = useState<QuizState>('START');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [qcmAnswers, setQcmAnswers] = useState<Record<number, number>>({});
  const [qrAnswers, setQrAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [isPassed, setIsPassed] = useState(false);

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

  if (state === 'START') {
    return (
      <div className="min-h-screen bg-background flex flex-col pt-32 pb-20 relative overflow-hidden">
        <Navbar />
        {/* Animated background element */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse delay-1000" />

        <div className="flex-1 container max-w-2xl mx-auto px-4 flex flex-col justify-center relative z-10">
          <Card className="border-2 border-primary/20 bg-card/40 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden">
            <div className="h-3 gradient-primary" />
            <CardHeader className="text-center pb-8 pt-12">
              <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce shadow-inner">
                <Zap className="w-12 h-12 text-primary fill-primary/20" />
              </div>
              <CardTitle className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
                {quizType === 'final' ? 'Test de Certification' : 'Évaluation de Module'}
              </CardTitle>
              <CardDescription className="text-xl text-muted-foreground font-medium">
                {course?.title || 'Chargement...'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 px-8 md:px-12 pb-12">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50 text-center group hover:bg-secondary/50 transition-colors">
                  <BookOpen className="w-6 h-6 text-primary mx-auto mb-3" />
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Questions</p>
                  <p className="text-3xl font-display font-black">{allQuestions.length}</p>
                </div>
                <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50 text-center group hover:bg-secondary/50 transition-colors">
                  <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-3" />
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Score Requis</p>
                  <p className="text-3xl font-display font-black text-primary">80%</p>
                </div>
              </div>

              <div className="bg-muted/30 rounded-3xl p-8 border border-border/50 space-y-4">
                <h4 className="font-bold text-lg flex items-center gap-3">
                  <Star className="w-5 h-5 text-primary animate-spin-slow" />
                  Guide de Réussite
                </h4>
                <ul className="space-y-4">
                  {[
                    "Réponses précises et réfléchies",
                    "Terminologie technique attendue",
                    "Aucune limite de temps, soyez serein",
                    "Certificat généré instantanément"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                className="w-full h-16 rounded-[1.5rem] group text-xl font-bold shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 animate-in slide-in-from-bottom-8 duration-1000"
                size="lg"
                onClick={() => setState('QUESTIONS')}
              >
                Lancer le défi
                <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (state === 'QUESTIONS') {
    return (
      <div className="min-h-screen bg-background flex flex-col pt-32 pb-20">
        <Navbar />

        {/* Sticky Header with Progress */}
        <div className="fixed top-20 left-0 w-full z-40 px-4">
          <div className="container max-w-6xl mx-auto bg-card/70 backdrop-blur-2xl border border-border/50 rounded-3xl p-5 shadow-2xl flex items-center justify-between gap-8 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-5 shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner">
                <Timer className="w-6 h-6 text-primary" />
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-0.5">Avancement</p>
                <p className="font-bold text-lg leading-none">{currentQuestionIndex + 1} <span className="text-muted-foreground font-medium text-sm">sur</span> {allQuestions.length}</p>
              </div>
            </div>

            <div className="flex-grow flex items-center gap-6">
              <div className="flex-grow">
                <Progress value={progressPercent} className="h-3 bg-secondary/50 shadow-inner rounded-full" />
              </div>
              <Badge className="hidden md:flex h-10 px-6 rounded-2xl bg-primary/10 text-primary border-none font-black text-sm">
                {Math.round(progressPercent)}%
              </Badge>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <div className="text-right hidden xl:block">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-0.5">Course</p>
                <p className="text-sm font-bold truncate max-w-[150px]">{course?.title}</p>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 container max-w-6xl mx-auto px-4 mt-24 mb-12">
          <div key={currentQuestionIndex} className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Question */}
            <div className="lg:sticky lg:top-48 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="space-y-6">
                <Badge variant="outline" className="px-4 py-1.5 border-primary/30 text-primary uppercase tracking-[0.2em] text-[10px] font-black bg-primary/5 rounded-full">
                  {currentQuestion?.type === 'qcm' ? 'Question à choix multiples' : 'Réponse libre (Expertise)'}
                </Badge>

                <h2 className="text-4xl md:text-5xl font-display font-bold leading-[1.1] text-foreground tracking-tight">
                  {currentQuestion?.question}
                </h2>

                <div className="p-8 rounded-[2rem] bg-card/40 border border-border/50 backdrop-blur-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <HelpCircle className="w-24 h-24" />
                  </div>
                  <p className="text-muted-foreground text-lg leading-relaxed relative z-10">
                    Prenez le temps de bien lire la question. {currentQuestion?.type === 'qcm'
                      ? "Choisissez la réponse qui vous semble la plus exacte parmi les options proposées."
                      : "Utilisez un vocabulaire technique précis pour démontrer votre maîtrise du sujet."}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Answers */}
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
              {currentQuestion?.type === 'qcm' ? (
                <div className="grid gap-4">
                  {currentQuestion.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setQcmAnswers({ ...qcmAnswers, [currentQuestion.id]: index })}
                      className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all duration-300 flex items-center justify-between group relative overflow-hidden
                        ${qcmAnswers[currentQuestion.id] === index
                          ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10 scale-[1.02]'
                          : 'border-border/40 hover:border-primary/30 hover:bg-card/40'
                        }
                      `}
                    >
                      <div className="flex items-center gap-6 relative z-10">
                        <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-bold font-display text-xl transition-all
                          ${qcmAnswers[currentQuestion.id] === index
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                            : 'bg-secondary/50 border-border/50 text-muted-foreground group-hover:border-primary/50'
                          }
                        `}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-xl font-medium leading-snug">{option}</span>
                      </div>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative z-10
                        ${qcmAnswers[currentQuestion.id] === index
                          ? 'border-primary bg-primary scale-110 shadow-lg shadow-primary/30'
                          : 'border-muted-foreground/20 opacity-0 group-hover:opacity-100'
                        }
                      `}>
                        {qcmAnswers[currentQuestion.id] === index && <CheckCircle2 className="w-5 h-5 text-white" />}
                      </div>

                      {/* Decorative background hover effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/5 transition-opacity duration-500 ${qcmAnswers[currentQuestion.id] === index ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-25 transition duration-500" />
                    <Textarea
                      placeholder="Développez votre réponse ici... Notre IA analysera la précision de vos termes techniques."
                      className="min-h-[350px] text-xl p-10 rounded-[2.5rem] border-2 bg-card/50 backdrop-blur-md focus-visible:ring-primary focus-visible:border-primary transition-all shadow-2xl leading-relaxed"
                      value={qrAnswers[currentQuestion.id] || ''}
                      onChange={(e) => setQrAnswers({ ...qrAnswers, [currentQuestion.id]: e.target.value })}
                    />
                  </div>
                  <div className="flex items-start gap-6 p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 text-amber-600 shadow-inner">
                    <HelpCircle className="w-8 h-8 shrink-0 mt-1" />
                    <div className="space-y-2">
                      <p className="font-black uppercase tracking-[0.2em] text-xs">Conseil de l'instructeur</p>
                      <p className="text-lg font-medium leading-relaxed">
                        Soyez précis et structuré. L'algorithme valorise l'utilisation de termes techniques appropriés et la clarté du raisonnement.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <footer className="pt-8 flex items-center justify-between gap-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-16 px-10 rounded-[1.5rem] font-bold border-border/50 hover:bg-secondary/50 transition-all disabled:opacity-20"
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="w-6 h-6 mr-3" />
                  Précédent
                </Button>
                <Button
                  size="lg"
                  className="flex-grow h-16 rounded-[1.5rem] text-xl font-bold shadow-2xl shadow-primary/20 group"
                  onClick={handleNext}
                  disabled={
                    currentQuestion?.type === 'qcm'
                      ? qcmAnswers[currentQuestion.id] === undefined
                      : !qrAnswers[currentQuestion.id]?.trim()
                  }
                >
                  {currentQuestionIndex === allQuestions.length - 1 ? 'Soumettre mes réponses' : 'Continuer'}
                  <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </Button>
              </footer>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (state === 'RESULTS') {
    return (
      <div className="min-h-screen bg-background flex flex-col pt-32 pb-20 relative overflow-hidden">
        <Navbar />
        {isPassed && (
          <div className="fixed inset-0 pointer-events-none z-50">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[150px] animate-pulse" />
          </div>
        )}

        <div className="flex-grow container max-w-5xl mx-auto px-4 flex flex-col justify-center relative z-10">
          <Card className="rounded-[3rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] bg-card/60 backdrop-blur-xl overflow-hidden animate-in zoom-in-95 duration-700">
            <div className={`h-3 ${isPassed ? 'gradient-primary' : 'bg-destructive/80'}`} />

            <div className="p-8 md:p-16 flex flex-col lg:flex-row gap-12 items-center">
              {/* Left Side: Score & Status */}
              <div className="w-full lg:w-1/3 flex flex-col items-center text-center space-y-8 animate-in slide-in-from-left-8 duration-700 delay-200">
                <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl transition-transform hover:scale-110 duration-500
                  ${isPassed ? 'bg-primary text-white shadow-primary/20' : 'bg-destructive text-white shadow-destructive/20'}
                `}>
                  {isPassed ? <Trophy className="w-16 h-16" /> : <AlertCircle className="w-16 h-16" />}
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl font-display font-black tracking-tight leading-tight">
                    {isPassed ? 'Incroyable !' : 'Continuez vos efforts'}
                  </h2>
                  <Badge variant="outline" className={`px-6 py-2 border-2 rounded-full text-sm font-bold uppercase tracking-widest
                    ${isPassed ? 'border-primary/30 text-primary bg-primary/5' : 'border-destructive/30 text-destructive bg-destructive/5'}
                  `}>
                    {isPassed ? 'Certification Validée' : 'Échec à l\'examen'}
                  </Badge>
                </div>
              </div>

              <Separator orientation="vertical" className="hidden lg:block h-64 bg-border/50" />

              {/* Right Side: Details & Actions */}
              <div className="w-full lg:flex-1 space-y-10 animate-in slide-in-from-right-8 duration-700 delay-300">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-8 rounded-[2rem] bg-secondary/30 border border-border/50 group hover:bg-secondary/40 transition-colors">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black mb-4">Score de réussite</p>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-6xl font-display font-black leading-none ${isPassed ? 'text-primary' : 'text-destructive'}`}>
                        {score}
                      </span>
                      <span className="text-2xl font-bold opacity-40">%</span>
                    </div>
                  </div>

                  <div className="p-8 rounded-[2rem] bg-secondary/30 border border-border/50 flex flex-col justify-center">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-sm font-bold">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${isPassed ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                          {isPassed ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                        </div>
                        <span className="text-lg">{isPassed ? 'Maîtrise confirmée' : 'Révision nécessaire'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm font-bold opacity-60">
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shadow-inner">
                          <Zap className="w-5 h-5" />
                        </div>
                        <span className="text-lg">+{isPassed ? '150' : '0'} points Flash</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {isPassed && quizType === 'final' && (
                    <Button
                      variant="default"
                      className="w-full h-16 rounded-[1.5rem] text-xl font-bold gap-4 shadow-2xl shadow-primary/20 group animate-in fade-in duration-700 delay-500"
                      onClick={handleDownloadCert}
                    >
                      <Download className="w-6 h-6 group-hover:animate-bounce" />
                      Obtenir mon certificat de réussite
                    </Button>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-16 rounded-[1.5rem] font-bold border-border/50 hover:bg-secondary/50 text-lg"
                      onClick={() => navigate('/catalog')}
                    >
                      <BookOpen className="w-6 h-6 mr-3" />
                      Retour au catalogue
                    </Button>
                    <Button
                      variant="secondary"
                      className="h-16 rounded-[1.5rem] font-bold border-border/50 text-lg"
                      onClick={() => navigate('/dashboard')}
                    >
                      <Layout className="w-6 h-6 mr-3" />
                      Tableau de bord
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-primary border-r-2" />
        <p className="text-xl font-display font-bold animate-pulse">Préparation du test...</p>
      </div>
    </div>
  );
};

export default Quiz;
