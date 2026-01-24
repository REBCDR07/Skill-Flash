import React, { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourse, fetchQCM, fetchQR } from '@/lib/courses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Zap,
  ChevronRight,
  ChevronLeft,
  Award,
  AlertCircle,
  Timer,
  BookOpen,
  RotateCcw,
  Sparkles,
  Trophy,
  Pause,
  Play
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { CertificatePNG } from '@/components/course/CertificatePNG';

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
  const navigate = useNavigate();

  const [state, setState] = useState<QuizState>('START');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [isPaused, setIsPaused] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [qcmAnswers, setQcmAnswers] = useState<Record<number, number>>({});
  const [qrAnswers, setQrAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [isPassed, setIsPassed] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('sf_user_name') || '');

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
    enabled: !!courseId
  });

  const allQuestions = useMemo(() => {
    const qcms = (qcmData?.questions || []).map(q => ({ ...q, type: 'qcm' as const }));
    const qrs = (qrData?.questions || []).map(q => ({ ...q, type: 'qr' as const }));
    return [...qcms, ...qrs] as Question[];
  }, [qcmData, qrData]);

  const calculateFinalScore = useCallback(() => {
    let qcmCorrect = 0;
    let qrCorrectCount = 0;

    const qcmQuestions = allQuestions.filter(q => q.type === 'qcm');
    const qrQuestions = allQuestions.filter(q => q.type === 'qr');

    qcmQuestions.forEach(q => {
      if (qcmAnswers[q.id] === q.correctAnswer) qcmCorrect++;
    });

    qrQuestions.forEach(q => {
      const answer = (qrAnswers[q.id] || '').toLowerCase();
      const keywords = q.expectedKeywords || [];
      const found = keywords.filter(kw => answer.includes(kw.toLowerCase())).length;
      if (keywords.length > 0 && (found / keywords.length) >= 0.5) qrCorrectCount++;
    });

    const totalPossible = qcmQuestions.length + qrQuestions.length;
    const finalScore = totalPossible > 0 ? ((qcmCorrect + qrCorrectCount) / totalPossible) * 100 : 0;
    const roundedScore = Math.round(finalScore);
    const passingScore = 75;

    setScore(roundedScore);
    const passed = roundedScore >= passingScore;
    setIsPassed(passed);
    setState('RESULTS');

    if (passed) {
      toast.success("Certification obtenue !");
      const certifications = JSON.parse(localStorage.getItem('sf_certs') || '{}');
      certifications[courseId!] = { score: roundedScore, date: new Date().toISOString() };
      localStorage.setItem('sf_certs', JSON.stringify(certifications));
    }
  }, [allQuestions, qcmAnswers, qrAnswers, courseId]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      calculateFinalScore();
    }
  }, [currentQuestionIndex, allQuestions.length, calculateFinalScore]);

  // Timer Effect
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state === 'QUESTIONS' && !isPaused) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            calculateFinalScore();
            toast.warning("Temps écoulé ! Soumission forcée.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [state, calculateFinalScore, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetQuiz = () => {
    setState('START');
    setIsPaused(false);
    setCurrentQuestionIndex(0);
    setQcmAnswers({});
    setQrAnswers({});
    setTimeLeft(600);
  };

  const currentQuestion = allQuestions[currentQuestionIndex];
  const progressPercent = allQuestions.length > 0
    ? ((currentQuestionIndex + 1) / allQuestions.length) * 100
    : 0;

  if (state === 'START') {
    return (
      <div className="min-h-screen bg-background flex flex-col pt-32 pb-20 relative overflow-hidden">
        <Navbar />
        <div className="flex-1 container max-w-5xl mx-auto px-4 flex flex-col justify-center relative z-10">
          <Card className="border-2 border-primary/20 bg-card/40 backdrop-blur-xl shadow-2xl rounded-[2.5rem] overflow-hidden">
            <div className="h-3 gradient-primary" />
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-2/5 bg-primary/5 p-12 flex flex-col justify-center items-center border-b lg:border-b-0 lg:border-r border-border/50">
                <div className="w-32 h-32 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-8 animate-bounce shadow-inner">
                  <Zap className="w-16 h-16 text-primary fill-primary/20" />
                </div>
                <CardTitle className="text-4xl md:text-5xl font-display font-black tracking-tight text-center mb-4 leading-tight">
                  Certification <span className="text-primary">Flash</span>
                </CardTitle>
                <div className="bg-primary/10 px-4 py-2 rounded-full">
                  <p className="text-sm font-black text-primary uppercase tracking-widest">{course?.title || 'Chargement...'}</p>
                </div>
              </div>

              <div className="flex-1 p-12 flex flex-col justify-center space-y-10">
                <div>
                  <h3 className="text-2xl font-black text-foreground mb-4">Prêt pour l'excellence ?</h3>
                  <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                    Ce test d'expertise valide vos acquis sur l'intégralité du cursus. Préparez-vous à une série intensive de questions chronométrées.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50 flex items-center gap-4 group hover:bg-secondary/50 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Modules</p>
                      <p className="text-2xl font-black">{allQuestions.length} Questions</p>
                    </div>
                  </div>
                  <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50 flex items-center gap-4 group hover:bg-secondary/50 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center shrink-0">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Réussite</p>
                      <p className="text-2xl font-black text-primary">75% Requis</p>
                    </div>
                  </div>
                  <div className="p-6 rounded-3xl bg-secondary/30 border border-border/50 flex items-center gap-4 md:col-span-2 group hover:bg-secondary/50 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center shrink-0">
                      <Timer className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Chronomètre</p>
                      <p className="text-lg font-bold">10 Minutes (Saisie automatique en fin de délai)</p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-16 rounded-[1.5rem] group text-xl font-black shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-4"
                  size="lg"
                  onClick={() => setState('QUESTIONS')}
                >
                  LANCER LE PROTOCOLE D'EXAMEN
                  <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (state === 'QUESTIONS') {
    return (
      <div className="min-h-screen bg-background flex flex-col pt-40 pb-20">
        <Navbar />
        <div className="fixed top-24 left-0 w-full z-50 px-4 pointer-events-none">
          <div className="container max-w-6xl mx-auto bg-card/80 backdrop-blur-2xl border border-border/50 rounded-3xl p-5 shadow-2xl pointer-events-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
              <div className="flex items-center gap-5 shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center shadow-inner">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-0.5">Progression</p>
                  <p className="font-bold text-lg leading-none">
                    {currentQuestionIndex + 1} <span className="text-muted-foreground font-medium text-sm">sur</span> {allQuestions.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-1">
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Temps Restant</p>
                  <Badge variant="outline" className={`h-10 px-6 rounded-2xl font-mono text-lg ${timeLeft < 60 ? 'bg-red-500 text-white animate-pulse border-none' : 'bg-secondary/50 text-primary border-none shadow-inner'}`}>
                    {formatTime(timeLeft)}
                  </Badge>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className={`w-12 h-12 rounded-2xl border-2 ${isPaused ? 'bg-primary text-white border-primary animate-pulse' : 'hover:bg-primary/10 hover:text-primary border-border/50'}`}
                  onClick={() => setIsPaused(!isPaused)}
                  title={isPaused ? "Reprendre" : "Pause"}
                >
                  {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
                </Button>
              </div>

              <div className="flex-grow max-w-md w-full">
                <Progress value={progressPercent} className="h-3 bg-secondary/50 shadow-inner rounded-full" />
              </div>
            </div>
          </div>
        </div>

        {isPaused && (
          <div className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-md flex items-center justify-center">
            <div className="text-center space-y-12 animate-in zoom-in-95 duration-300">
              <div className="w-32 h-32 bg-primary/10 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl">
                <Pause className="w-16 h-16 text-primary" />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-black tracking-tighter">EXAMEN EN PAUSE</h2>
                <p className="text-xl text-muted-foreground font-medium">Respirez, puis reprenez votre ascension vers l'expertise.</p>
              </div>
              <Button
                size="lg"
                className="h-20 px-12 rounded-[1.5rem] text-2xl font-black shadow-2xl shadow-primary/20 group"
                onClick={() => setIsPaused(false)}
              >
                REPRENDRE LE TEST
                <Play className="ml-4 w-8 h-8 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        )}

        <main className="flex-1 container max-w-6xl mx-auto px-6 mt-28 mb-12">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8 lg:sticky lg:top-48">
              <Badge variant="outline" className="px-4 py-1.5 border-primary/30 text-primary uppercase tracking-[0.2em] text-[10px] font-black bg-primary/5 rounded-full">
                {currentQuestion?.type === 'qcm' ? 'Questionnaire de Certification' : 'Défis de Réflexion'}
              </Badge>
              <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight text-foreground tracking-tight">
                {currentQuestion?.question}
              </h2>
            </div>

            <div className="space-y-8">
              {currentQuestion?.type === 'qcm' ? (
                <div className="grid gap-4">
                  {currentQuestion?.options?.map((option, index) => (
                    <button
                      key={index}
                      disabled={qcmAnswers[currentQuestion.id] !== undefined}
                      onClick={() => {
                        if (qcmAnswers[currentQuestion.id] === undefined) {
                          setQcmAnswers({ ...qcmAnswers, [currentQuestion.id]: index });
                          // Auto move to next with small delay
                          setTimeout(() => {
                            handleNext();
                          }, 600);
                        }
                      }}
                      className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all duration-300 flex items-center justify-between group relative overflow-hidden
                        ${qcmAnswers[currentQuestion.id] === index
                          ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10 scale-[1.02]'
                          : 'border-border/40 hover:border-primary/30 hover:bg-card/40'
                        }
                        ${qcmAnswers[currentQuestion.id] !== undefined && qcmAnswers[currentQuestion.id] !== index ? 'opacity-50' : ''}
                      `}
                    >
                      <div className="flex items-center gap-6 relative z-10 flex-1">
                        <div className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-bold font-display text-xl transition-all shrink-0
                          ${qcmAnswers[currentQuestion.id] === index
                            ? 'bg-primary border-primary text-white shadow-lg'
                            : 'bg-secondary/50 border-border/50 text-muted-foreground group-hover:border-primary/50'
                          }
                        `}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-lg md:text-xl font-medium leading-snug">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Développez votre réponse avec précision..."
                    className="min-h-[250px] rounded-3xl p-8 text-lg border-2 focus:ring-primary shadow-inner"
                    value={qrAnswers[currentQuestion.id] || ''}
                    onChange={(e) => setQrAnswers({ ...qrAnswers, [currentQuestion.id]: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground italic text-center">Votre réponse doit contenir le vocabulaire technique approprié.</p>
                </div>
              )}

              <footer className="pt-8 flex items-center gap-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-10 h-16 rounded-[1.5rem] font-bold text-base border-border/50 hover:bg-secondary/50 transition-all disabled:opacity-20"
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
                  disabled={currentQuestion?.type === 'qcm'
                    ? qcmAnswers[currentQuestion.id] === undefined
                    : !qrAnswers[currentQuestion.id]?.trim()
                  }
                >
                  {currentQuestionIndex === allQuestions.length - 1 ? 'Soumettre l\'examen' : 'Continuer'}
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
        <div className="flex-grow container max-w-4xl mx-auto px-6 flex flex-col justify-center relative z-10">
          <Card className="rounded-[3rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] bg-card/60 backdrop-blur-xl overflow-hidden">
            <div className={`h-3 ${isPassed ? 'gradient-primary' : 'bg-destructive/80'}`} />
            <div className="p-12 md:p-16 space-y-12">
              <div className="flex flex-col items-center text-center space-y-8">
                <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl
                  ${isPassed ? 'bg-primary text-white shadow-primary/20' : 'bg-destructive text-white shadow-destructive/20'}
                `}>
                  {isPassed ? <Award className="w-16 h-16" /> : <AlertCircle className="w-16 h-16" />}
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-display font-black tracking-tight">{isPassed ? 'Excellence Validée !' : 'Score Insuffisant'}</h2>
                  <p className="text-xl text-muted-foreground">Votre score final est de <span className="font-bold text-foreground">{score}%</span></p>
                  {!isPassed && <p className="text-amber-600 font-bold">Un minimum de 75% est requis pour la certification.</p>}
                </div>
              </div>

              {isPassed ? (
                <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
                  <div className="p-8 rounded-[2rem] bg-amber-500/5 border border-amber-500/20 space-y-6">
                    <div className="space-y-3 text-left">
                      <Label className="text-xs font-black uppercase tracking-widest text-amber-700 ml-1">VOTRE NOM POUR LE DIPLÔME</Label>
                      <Input
                        placeholder="Ex: Alexandre L."
                        value={userName}
                        onChange={(e) => {
                          setUserName(e.target.value);
                          localStorage.setItem('sf_user_name', e.target.value);
                        }}
                        className="h-14 rounded-2xl bg-white border-amber-200 text-lg font-bold focus:ring-amber-500"
                      />
                    </div>

                    {userName.length >= 3 ? (
                      <CertificatePNG
                        userName={userName}
                        courseTitle={course?.title || ''}
                        score={score}
                        date={new Date().toISOString()}
                        verificationCode={`SF-${courseId?.slice(0, 3).toUpperCase()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`}
                      />
                    ) : (
                      <p className="text-center text-xs text-amber-600 font-bold italic">Veuillez renseigner votre identité complète.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <Button
                    className="h-24 rounded-[2rem] font-black text-2xl flex flex-col items-center justify-center gap-1 group overflow-hidden relative shadow-2xl shadow-primary/20 scale-105"
                    onClick={resetQuiz}
                  >
                    <div className="absolute inset-0 bg-primary opacity-90 group-hover:bg-primary-dark transition-colors" />
                    <span className="relative z-10 flex items-center gap-4">
                      <RotateCcw className="w-8 h-8 group-hover:rotate-180 transition-transform duration-500" />
                      REPASSER LE TEST FINAL
                    </span>
                    <span className="relative z-10 text-[10px] uppercase font-black tracking-widest opacity-70">REPARTEZ DE ZÉRO POUR DÉCROCHER LE DIPLÔME</span>
                  </Button>

                  <p className="text-center text-muted-foreground text-sm font-medium italic">Prenez le temps de relire les chapitres pour consolider votre expertise.</p>
                </div>
              )}

              <div className="pt-6">
                <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary transition-colors" onClick={() => navigate('/catalog')}>
                  Retour au catalogue
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <Zap className="w-12 h-12 text-primary animate-bounce mb-4" />
      <p className="font-display font-bold text-xl tracking-tight">Initialisation du protocole d'examen d'élite...</p>
    </div>
  );
};

export default Quiz;
