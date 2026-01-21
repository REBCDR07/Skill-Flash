import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCourses } from '@/lib/courses';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCourseProgress, useCertifications, useLeaderboard, useRealtimeSync, useQuizResults, useAllQuizProgress, useProfile } from '@/hooks/useProgress';
import Navbar from '@/components/Navbar';
import { Share2, Crown, Medal, Download, Trophy, Star, Award, TrendingUp, Zap, Sparkles, BookOpen, Activity, ArrowRight, Clock } from 'lucide-react';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Course, CourseProgress, Certification } from '@/types/course';
import { generateCertificatePDF } from '@/lib/pdf';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const Dashboard = () => {
  useRealtimeSync();
  const navigate = useNavigate();
  const { user, profile: authProfile, loading } = useAuth();
  const { data: reactiveProfile } = useProfile();
  const profile = reactiveProfile || authProfile;

  const { data: allProgress } = useCourseProgress();
  const { data: certifications } = useCertifications();

  const { data: leaderboard } = useLeaderboard(10);
  const { data: quizResults } = useQuizResults();
  const { data: allQuizProgress } = useAllQuizProgress();

  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses
  });

  // Calculate real-time points from certifications and quizzes as a fallback/sync check
  const calculatedPoints = useMemo(() => {
    return (quizResults?.reduce((acc, q) => acc + (q.score * 10), 0) || 0) +
      (certifications?.length || 0) * 100;
  }, [quizResults, certifications]);

  // Use profile points but fallback or sync visual display
  const displayPoints = Math.max(profile?.total_points || 0, calculatedPoints);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const progressArray = useMemo(() => Array.isArray(allProgress) ? allProgress : [], [allProgress]);

  const stats = useMemo(() => {
    const totalChapters = progressArray.reduce((acc, p) => acc + (p.completed_chapters?.length || 0), 0);
    const activeCount = progressArray.filter(p => (p.completed_chapters?.length || 0) > 0 && (p.completed_chapters?.length || 0) < (courses?.find(c => c.id === p.course_id)?.chapters || 0)).length;
    const certCount = certifications?.length || 0;
    return { totalChapters, activeCount, certCount };
  }, [progressArray, certifications, courses]);

  const chartData = useMemo(() => {
    // Zeroed out mock data, only current day (Dim for example) shows actual points
    // In a real app, this would fetch activity history from a dedicated table
    return [
      { name: 'Lun', points: 0 },
      { name: 'Mar', points: 0 },
      { name: 'Mer', points: 0 },
      { name: 'Jeu', points: 0 },
      { name: 'Ven', points: 0 },
      { name: 'Sam', points: 0 },
      { name: 'Dim', points: profile?.total_points || 0 },
    ];
  }, [profile]);

  const skillsData = useMemo(() => {
    const categories = courses?.reduce((acc, course) => {
      const progress = progressArray.find(p => p.course_id === course.id);
      const completedCount = progress?.completed_chapters?.length || 0;
      const progressPercent = Math.round((completedCount / course.chapters) * 100);

      if (!acc[course.category]) {
        acc[course.category] = { category: course.category, value: 0, count: 0 };
      }
      acc[course.category].value += progressPercent;
      acc[course.category].count += 1;
      return acc;
    }, {} as Record<string, { category: string; value: number; count: number }>);

    return Object.values(categories || {}).map(cat => ({
      subject: cat.category,
      value: Math.round(cat.value / cat.count),
      fullMark: 100,
    }));
  }, [courses, progressArray]);

  console.log('Dashboard: STATE -> loading:', loading, 'user:', user?.id || 'none', 'profile:', !!profile);

  if (loading && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-sky-50 to-amber-50">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-violet-400/30 via-sky-400/30 to-amber-400/30 animate-pulse rounded-full"></div>
            <div className="relative animate-spin rounded-full h-20 w-20 border-t-4 border-r-4 border-violet-600"></div>
          </div>
          <p className="text-gray-700 animate-pulse font-bold text-lg tracking-wide">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const activeCoursesData = progressArray.map(p => {
    const course = courses?.find(c => c.id === p.course_id);
    if (!course) return null;
    const completedCount = p.completed_chapters?.length || 0;
    const progressPercent = Math.round((completedCount / course.chapters) * 100);

    // Check if final quiz is passed
    const passedQuiz = quizResults?.some(
      r => r.course_id === course.id && r.quiz_type === 'final_qcm' && r.score >= 70
    );

    const savedProgress = allQuizProgress?.[course.id];

    return { ...course, progress: p, progressPercent, passedQuiz, savedProgress };
  }).filter((item): item is (Course & { progress: CourseProgress; progressPercent: number; passedQuiz: boolean; savedProgress: unknown }) =>
    !!item && (!item.passedQuiz) // Show if quiz is NOT passed, even if progress is 100%
  );

  const handleDownloadCert = async (cert: Certification) => {
    if (user) {
      await generateCertificatePDF(cert, profile?.full_name || user.email || 'Étudiant');
    }
  };

  const topCertifications = certifications?.slice(0, 3) || [];
  const otherCertifications = certifications?.slice(3) || [];

  const handleShare = async (cert: Certification) => {
    // Stateless sharing: Encode data in URL
    const payload = {
      id: cert.id,
      course_title: cert.course_title,
      final_score: cert.final_score,
      issued_at: cert.issued_at,
      verification_code: cert.verification_code,
      user_id: cert.user_id,
      userName: profile?.full_name || user?.email || 'Utilisateur'
    };
    const code = btoa(JSON.stringify(payload));
    const url = `${window.location.origin}/verify/${code}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certification SkillFlash : ${cert.course_title}`,
          text: `Je viens d'obtenir ma certification en ${cert.course_title} avec un score de ${cert.final_score}% !`,
          url
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Lien copié !", {
        description: "Le lien de vérification a été copié dans le presse-papier.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-sky-50 to-amber-50 pb-20 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-200/40 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-sky-200/40 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-amber-200/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <Navbar />

      <main className="container max-w-7xl mx-auto px-4 pt-32 relative z-10">
        <div className="mb-16 space-y-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-1.5 w-16 bg-gradient-to-r from-violet-600 via-sky-600 to-amber-600 rounded-full"></div>
            <Badge className="bg-gradient-to-r from-violet-100 to-sky-100 border-violet-300 text-violet-700 text-[10px] uppercase tracking-[0.3em] font-black px-4 py-1.5">
              PROFIL VÉRIFIÉ
            </Badge>
            <Link to={`/portfolio/${profile?.username}`}>
              <Button variant="ghost" className="h-9 px-5 rounded-full text-[10px] font-black tracking-widest uppercase gap-2 bg-white/60 hover:bg-white/80 text-violet-700 border border-violet-200 transition-all shadow-sm hover:shadow-md">
                <Share2 className="w-3.5 h-3.5" />
                VOIR MON PORTFOLIO
              </Button>
            </Link>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none text-gray-900">
            Bonjour,
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-sky-600 to-amber-600 bg-clip-text text-transparent">
              {profile?.username || profile?.full_name || 'Apprenant'}
            </span>
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl leading-relaxed font-medium">
            Votre progression est remarquable. Découvrez l'analyse détaillée de vos performances et réalisations.
          </p>
        </div>

        {topCertifications.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-10">
              <Crown className="w-8 h-8 text-amber-600" />
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Vos Certifications d'Excellence</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {topCertifications[1] && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-300/50 to-slate-400/50 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all"></div>
                  <Card className="relative bg-white border-2 border-slate-300 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transform transition-all duration-500 group-hover:scale-105">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-200/60 to-transparent rounded-bl-[100px]"></div>
                    <CardHeader className="pb-4 relative pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-lg border border-slate-300">
                          <Medal className="w-8 h-8 text-slate-600" />
                        </div>
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center border-4 border-white font-black text-2xl text-slate-700 shadow-lg">
                          2
                        </div>
                      </div>
                      <CardTitle className="text-xl font-black text-gray-900 leading-tight">{topCertifications[1].course_title}</CardTitle>
                      <CardDescription className="text-slate-600 text-xs font-bold uppercase tracking-widest mt-2">
                        {new Date(topCertifications[1].issued_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0 pb-6 gap-2">
                      <Button
                        onClick={() => handleDownloadCert(topCertifications[1])}
                        className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-black rounded-xl h-12 shadow-lg transition-all duration-300 px-2"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button
                        onClick={() => handleShare(topCertifications[1])}
                        variant="outline"
                        className="border-2 border-slate-300 hover:bg-slate-50 font-black rounded-xl h-12 px-2"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}

              {topCertifications[0] && (
                <div className="relative group md:-mt-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/60 to-yellow-500/60 rounded-[2rem] blur-2xl group-hover:blur-3xl transition-all"></div>
                  <Card className="relative bg-white border-4 border-amber-400 rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-3xl transform transition-all duration-500 group-hover:scale-110">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-200/80 to-transparent rounded-bl-[120px]"></div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white group-hover:scale-110 transition-transform">
                      <Crown className="w-10 h-10 text-white" />
                    </div>
                    <CardHeader className="pb-4 relative pt-16">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center shadow-xl border-2 border-amber-300">
                          <Trophy className="w-10 h-10 text-amber-600 fill-amber-600" />
                        </div>
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center border-4 border-white font-black text-3xl text-white shadow-xl">
                          1
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-black text-gray-900 leading-tight">{topCertifications[0].course_title}</CardTitle>
                      <CardDescription className="text-amber-700 text-xs font-black uppercase tracking-widest mt-3 flex items-center gap-2">
                        <Star className="w-4 h-4 fill-amber-600 text-amber-600" />
                        {new Date(topCertifications[0].issued_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0 pb-6 gap-3">
                      <Button
                        onClick={() => handleDownloadCert(topCertifications[0])}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-white font-black rounded-xl h-14 shadow-xl transition-all duration-300 text-base px-2"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        CERTIFICAT
                      </Button>
                      <Button
                        onClick={() => handleShare(topCertifications[0])}
                        variant="outline"
                        className="border-2 border-amber-300 hover:bg-amber-50 font-black rounded-xl h-14 w-14 p-0 shadow-lg"
                      >
                        <Share2 className="w-6 h-6 text-amber-600" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}

              {topCertifications[2] && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/50 to-orange-500/50 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all"></div>
                  <Card className="relative bg-white border-2 border-orange-400 rounded-[2rem] overflow-hidden shadow-xl hover:shadow-2xl transform transition-all duration-500 group-hover:scale-105">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/60 to-transparent rounded-bl-[100px]"></div>
                    <CardHeader className="pb-4 relative pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center shadow-lg border border-orange-300">
                          <Award className="w-8 h-8 text-orange-600" />
                        </div>
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center border-4 border-white font-black text-2xl text-white shadow-lg">
                          3
                        </div>
                      </div>
                      <CardTitle className="text-xl font-black text-gray-900 leading-tight">{topCertifications[2].course_title}</CardTitle>
                      <CardDescription className="text-orange-600 text-xs font-bold uppercase tracking-widest mt-2">
                        {new Date(topCertifications[2].issued_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="pt-0 pb-6 gap-2">
                      <Button
                        onClick={() => handleDownloadCert(topCertifications[2])}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-black rounded-xl h-12 shadow-lg transition-all duration-300 px-2"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button
                        onClick={() => handleShare(topCertifications[2])}
                        variant="outline"
                        className="border-2 border-orange-300 hover:bg-orange-50 font-black rounded-xl h-12 px-2"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </div>

            {otherCertifications.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {otherCertifications.map((cert, index) => (
                  <Card key={cert.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-100 to-sky-100 flex items-center justify-center border border-violet-200">
                          <Star className="w-5 h-5 text-violet-600" />
                        </div>
                        <span className="text-xs font-black text-gray-400">#{index + 4}</span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">{cert.course_title}</h4>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-3">
                        {new Date(cert.issued_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleDownloadCert(cert)}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl h-9 text-[10px] shadow-sm px-1"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          PDF
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleShare(cert)}
                          variant="ghost"
                          className="w-9 h-9 p-0 rounded-xl hover:bg-gray-100 text-violet-600"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mb-16">
          <div className="flex items-center gap-4 mb-10">
            <TrendingUp className="w-8 h-8 text-violet-600" />
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Courbe de Puissance</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-white border-2 border-gray-200 rounded-[2rem] overflow-hidden shadow-xl">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-black text-gray-900 mb-2">Évolution Hebdomadaire</CardTitle>
                    <CardDescription className="text-gray-600 font-medium">Progression et acquisition de points</CardDescription>
                  </div>
                  <Badge className="bg-gradient-to-r from-violet-100 to-sky-100 border-violet-300 text-violet-700 font-bold px-3 py-1.5">
                    7 derniers jours
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="h-[400px] px-8 pb-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                        <stop offset="50%" stopColor="#0ea5e9" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 700 }}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '2px solid #e5e7eb',
                        borderRadius: '16px',
                        color: '#111827',
                        fontWeight: 'bold',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      }}
                      cursor={{ stroke: '#7c3aed', strokeWidth: 2, opacity: 0.3 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="points"
                      stroke="#7c3aed"
                      strokeWidth={3}
                      fill="url(#colorGradient)"
                      animationDuration={2000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white border-2 border-gray-200 rounded-[2rem] overflow-hidden shadow-xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl font-black text-gray-900 mb-2">Expertise par Domaine</CardTitle>
                <CardDescription className="text-gray-600 font-medium text-sm">Analyse radar des compétences</CardDescription>
              </CardHeader>
              <CardContent className="h-[340px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillsData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 700 }}
                    />
                    <Radar
                      name="Expertise"
                      dataKey="value"
                      stroke="#7c3aed"
                      fill="#7c3aed"
                      fillOpacity={0.4}
                      strokeWidth={3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="relative bg-gradient-to-br from-violet-50 to-violet-100 border-2 border-violet-300 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group hover:scale-105">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-300/30 to-transparent rounded-bl-[100px]"></div>
              <CardContent className="p-8 relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center shadow-lg border border-violet-200">
                    <Zap className="w-8 h-8 text-violet-600 fill-violet-600" />
                  </div>
                  <Sparkles className="w-6 h-6 text-violet-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-6xl font-black text-gray-900 leading-none">{displayPoints}</p>
                  <p className="text-violet-700 text-sm font-black uppercase tracking-[0.3em]">Points Flash</p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="h-2 flex-1 bg-violet-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-600 to-violet-500 rounded-full transition-all duration-1000 w-[var(--progress)]"
                        style={{ '--progress': `${Math.min(100, (displayPoints / 1000) * 100)}%` } as React.CSSProperties} // eslint-disable-line
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-sky-50 to-sky-100 border-2 border-sky-300 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group hover:scale-105">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sky-300/30 to-transparent rounded-bl-[100px]"></div>
              <CardContent className="p-8 relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center shadow-lg border border-sky-200">
                    <BookOpen className="w-8 h-8 text-sky-600" />
                  </div>
                  <Activity className="w-6 h-6 text-sky-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-6xl font-black text-gray-900 leading-none">{stats.activeCount}</p>
                  <p className="text-sky-700 text-sm font-black uppercase tracking-[0.3em]">En Cours</p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="h-2 flex-1 bg-sky-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-600 to-sky-500 rounded-full transition-all duration-1000 w-[var(--progress)]"
                        style={{ '--progress': `${Math.min(100, (stats.activeCount / 10) * 100)}%` } as React.CSSProperties} // eslint-disable-line
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="relative bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group hover:scale-105">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-300/30 to-transparent rounded-bl-[100px]"></div>
              <CardContent className="p-8 relative">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center shadow-lg border border-amber-200">
                    <Award className="w-8 h-8 text-amber-600 fill-amber-600" />
                  </div>
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-6xl font-black text-gray-900 leading-none">{stats.certCount}</p>
                  <p className="text-amber-700 text-sm font-black uppercase tracking-[0.3em]">Expertises</p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="h-2 flex-1 bg-amber-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-500 rounded-full transition-all duration-1000 w-[var(--progress)]"
                        style={{ '--progress': `${Math.min(100, (stats.certCount / 5) * 100)}%` } as React.CSSProperties} // eslint-disable-line
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <Activity className="w-8 h-8 text-sky-600" />
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Cursus en Progression</h2>
            </div>
            <Link to="/catalog">
              <Button className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 font-bold rounded-2xl px-6 h-12 shadow-md hover:shadow-lg transition-all">
                Explorer le catalogue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6">
            {activeCoursesData.length > 0 ? (
              activeCoursesData.map((course) => (
                <Card key={course.id} className="bg-white border-2 border-gray-200 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group">
                  <div className={`flex flex-col md:flex-row ${course.progressPercent === 100 ? 'bg-gradient-to-r from-amber-50/50 to-orange-50/50' : ''}`}>
                    <div className="md:w-72 p-8 flex flex-col justify-center items-center isolate relative border-r-2 border-gray-100">
                      {course.progressPercent === 100 && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm -z-10"></div>
                      )}

                      <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500 border-2 
                        ${course.progressPercent === 100 ? 'bg-gradient-to-br from-amber-200 to-orange-200 border-amber-300' : 'bg-gradient-to-br from-violet-200 to-sky-200 border-violet-300'}
                      `}>
                        {course.progressPercent === 100 ? (
                          <Trophy className="w-12 h-12 text-amber-700" />
                        ) : (
                          <BookOpen className="w-12 h-12 text-violet-700" />
                        )}
                      </div>
                      <Badge className={`border font-bold text-xs tracking-wider px-4 py-1.5
                        ${course.progressPercent === 100 ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-white text-gray-700 border-gray-300'}
                      `}>
                        {course.category}
                      </Badge>
                    </div>
                    <div className="flex-1 p-8 space-y-6">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-violet-700 transition-colors">
                            {course.title}
                          </h3>
                          <div className="flex items-center gap-6 text-sm font-bold text-gray-500">
                            <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {course.duration}
                            </span>
                            {course.progressPercent === 100 && (
                              <span className="flex items-center gap-2 text-amber-600">
                                <Sparkles className="w-4 h-4" />
                                Certification en attente
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-5xl font-black bg-clip-text text-transparent leading-none
                            ${course.progressPercent === 100 ? 'bg-gradient-to-r from-amber-500 to-orange-600' : 'bg-gradient-to-r from-violet-600 to-sky-600'}
                          `}>
                            {course.progressPercent}%
                          </p>
                          <p className="text-xs uppercase font-black text-gray-400 tracking-widest mt-2">{course.progressPercent === 100 ? 'PRÊT POUR LE TEST' : 'COMPLÉTÉ'}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                          <div
                            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 shadow-md w-progress
                                ${course.progressPercent === 100 ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500' : 'bg-gradient-to-r from-violet-500 via-sky-500 to-amber-500'}
                            `}
                            style={{ "--progress": `${course.progressPercent}%` } as React.CSSProperties} // eslint-disable-line
                          ></div>
                        </div>
                        <div className="flex justify-end">
                          <Link
                            to={course.savedProgress
                              ? `/quiz/${course.id}`
                              : course.progressPercent === 100
                                ? `/quiz/${course.id}`
                                : `/course/${course.id}`
                            }
                            state={course.savedProgress ? { resume: true } : undefined}
                          >
                            <Button className={`
                              font-black rounded-2xl px-10 h-14 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300
                              ${course.savedProgress
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500'
                                : course.progressPercent === 100
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500'
                                  : 'bg-gradient-to-r from-violet-600 to-sky-600 hover:from-violet-500 hover:to-sky-500'}
                              text-white
                            `}>
                              {course.savedProgress
                                ? 'POURSUIVRE LE TEST'
                                : course.progressPercent === 100
                                  ? 'PASSER LE TEST FINAL'
                                  : 'CONTINUER LE COURS'
                              }
                              {course.savedProgress ? <Zap className="w-5 h-5 ml-3" /> : <ArrowRight className="w-5 h-5 ml-3" />}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="bg-white border-2 border-dashed border-gray-300 rounded-[2rem] flex flex-col items-center justify-center py-24">
                <Activity className="w-20 h-20 text-gray-300 mb-6" />
                <p className="text-2xl font-black text-gray-400 mb-2">Aucun cours en progression</p>
                <p className="text-gray-500 mb-8">Démarrez votre parcours d'apprentissage dès maintenant</p>
                <Link to="/catalog">
                  <Button className="bg-gradient-to-r from-violet-600 to-sky-600 hover:from-violet-500 hover:to-sky-500 text-white font-black rounded-2xl px-10 h-14 shadow-xl">
                    Explorer le catalogue
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-10">
            <Star className="w-8 h-8 text-amber-600" />
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">Élite de l'Académie</h2>
          </div>

          <Card className="bg-white border-2 border-gray-200 rounded-[2rem] overflow-hidden shadow-xl">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {leaderboard?.slice(0, 10).map((player, index) => (
                  <div key={player.user_id} className="flex items-center gap-6 p-6 hover:bg-gray-50 transition-all group cursor-default">
                    <div className={`w-12 h-12 flex items-center justify-center font-black text-lg rounded-2xl transition-all
                      ${index === 0 ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg' :
                        index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-800 shadow-md' :
                          index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-md' :
                            'bg-gray-100 text-gray-600 border border-gray-200'}
                    `}>
                      {index + 1}
                    </div>
                    <Avatar className="w-14 h-14 border-2 border-gray-200 shadow-md group-hover:border-violet-300 transition-all">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username || player.user_id}`} />
                      <AvatarFallback className="font-black text-sm bg-gradient-to-br from-violet-100 to-sky-100 text-violet-700">
                        {(player.username || player.full_name || 'U')[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-black text-gray-900 truncate group-hover:text-violet-700 transition-colors">
                        {player.username || player.full_name || 'Anonyme'}
                      </p>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Membre Actif</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black bg-gradient-to-r from-violet-600 to-sky-600 bg-clip-text text-transparent">
                        {player.total_points}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">POINTS</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-6">
              <Link to="/leaderboard" className="w-full">
                <Button className="w-full bg-gradient-to-r from-violet-600 to-sky-600 hover:from-violet-500 hover:to-sky-500 text-white font-black rounded-2xl h-14 shadow-xl hover:shadow-2xl transition-all">
                  VOIR LE CLASSEMENT COMPLET
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;


