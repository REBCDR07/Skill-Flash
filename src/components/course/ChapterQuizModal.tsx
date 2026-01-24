import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChapterQuiz } from '@/lib/chapter-quizzes';
import { toast } from 'sonner';
import { AlertCircle, Timer, CheckCircle2 } from 'lucide-react';

interface ChapterQuizModalProps {
    isOpen: boolean;
    onClose: () => void;
    quiz: ChapterQuiz;
    onComplete: (score: number) => void;
}

export const ChapterQuizModal = ({ isOpen, onClose, quiz, onComplete }: ChapterQuizModalProps) => {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0); // Add state for score
    const [hasCheated, setHasCheated] = useState(false);

    // Timer Ref to clear interval
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Anti-cheat: Visibility Change
    useEffect(() => {
        if (!isOpen || submitted) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setHasCheated(true);
                toast.error("Attention ! Quitter l'onglet est interdit. Le test sera annulé si cela se reproduit.", {
                    duration: 5000,
                    description: "Anti-triche activé."
                });
                // In strict mode, we could auto-fail here. For now, just a warning/flag.
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [isOpen, submitted]);

    // Timer Logic
    useEffect(() => {
        if (!isOpen || submitted) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    handleSubmit(true); // Auto-submit on timeout
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, submitted]);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setAnswers({});
            setTimeLeft(120);
            setSubmitted(false);
            setHasCheated(false);
        }
    }, [isOpen, quiz]);

    const handleSubmit = (auto = false) => {
        if (submitted) return;

        let correctCount = 0;
        quiz.questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) correctCount++;
        });

        const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
        setScore(calculatedScore); // Update score state
        setSubmitted(true);

        if (auto) {
            toast.warning("Temps écoulé ! Vos réponses ont été soumises automatiquement.");
        }

        // Delay closing slightly to show results if needed, or rely on user clicking "Close"
    };

    const handleFinish = () => {
        onComplete(score);
        onClose();
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-black">Quiz de Chapitre</DialogTitle>
                        {!submitted && (
                            <div className={`flex items-center gap-2 font-mono font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                                <Timer className="w-5 h-5" />
                                {formatTime(timeLeft)}
                            </div>
                        )}
                    </div>
                    <DialogDescription>
                        Testez vos connaissances pour valider ce module. Score requis : {quiz.passingScore}%.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {hasCheated && !submitted && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5" />
                            <p className="text-sm font-bold">Alerte Anti-triche : Navigation hors page détectée.</p>
                        </div>
                    )}

                    {!submitted ? (
                        <div className="space-y-8">
                            {quiz.questions.map((q, idx) => (
                                <div key={q.id} className="space-y-3">
                                    <p className="font-bold text-lg text-gray-900">{idx + 1}. {q.question}</p>
                                    <div className="grid gap-2">
                                        {q.options.map((opt, optIdx) => (
                                            <button
                                                key={optIdx}
                                                disabled={answers[q.id] !== undefined}
                                                onClick={() => {
                                                    if (answers[q.id] === undefined) {
                                                        setAnswers({ ...answers, [q.id]: optIdx });
                                                    }
                                                }}
                                                className={`text-left p-3 rounded-xl border-2 transition-all font-medium
                           ${answers[q.id] === optIdx
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50 text-gray-700'}
                           ${answers[q.id] !== undefined && answers[q.id] !== optIdx ? 'opacity-50' : ''}
                         `}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 space-y-6">
                            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center border-4 
                 ${score >= quiz.passingScore ? 'border-green-500 bg-green-50 text-green-600' : 'border-red-500 bg-red-50 text-red-600'}
               `}>
                                <span className="text-3xl font-black">{score}%</span>
                            </div>

                            <div>
                                <h3 className="text-xl font-black mb-2">
                                    {score >= quiz.passingScore ? 'Module Validé !' : 'Module non validé'}
                                </h3>
                                <p className="text-gray-500 max-w-sm mx-auto">
                                    {score >= quiz.passingScore
                                        ? "Excellent travail. Vous pouvez passer au chapitre suivant."
                                        : "Vous n'avez pas atteint le score minimum. Révisez le chapitre et réessayez."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {!submitted ? (
                        <Button
                            onClick={() => handleSubmit()}
                            className="w-full sm:w-auto font-bold text-lg h-12 px-8"
                            disabled={Object.keys(answers).length < quiz.questions.length}
                        >
                            Soumettre mes réponses
                        </Button>
                    ) : (
                        <Button
                            onClick={handleFinish}
                            className={`w-full sm:w-auto font-bold text-lg h-12 px-8 ${score >= quiz.passingScore ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        >
                            {score >= quiz.passingScore ? 'Continuer' : 'Fermer'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
