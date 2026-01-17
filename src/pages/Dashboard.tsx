import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useCourseProgress, useCertifications, useLeaderboard } from '@/hooks/useProgress';
import { Zap, Trophy, BookOpen, Award, LogOut, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, loading } = useAuth();
  const { data: allProgress } = useCourseProgress();
  const { data: certifications } = useCertifications();
  const { data: leaderboard } = useLeaderboard(10);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const userRank = leaderboard?.findIndex(p => p.user_id === user.id) ?? -1;
  const progressArray = Array.isArray(allProgress) ? allProgress : [];
  const coursesInProgress = progressArray.filter(p => !p.completed_at).length;
  const coursesCompleted = progressArray.filter(p => p.completed_at).length;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-display font-bold">SkillFlash</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/catalog" className="text-muted-foreground hover:text-foreground transition-colors">
              Cours
            </Link>
            <Link to="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Classement
            </Link>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-28 pb-16">
        {/* Welcome */}
        <div className="mb-12">
          <h1 className="text-3xl font-display font-bold mb-2">
            Bonjour, {profile?.username || profile?.full_name || 'Apprenant'} 👋
          </h1>
          <p className="text-muted-foreground">Continuez votre apprentissage et atteignez vos objectifs.</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader className="pb-2">
              <CardDescription>Points totaux</CardDescription>
              <CardTitle className="text-3xl font-display text-primary">
                {profile?.total_points || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Trophy className="w-8 h-8 text-primary/50" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Classement</CardDescription>
              <CardTitle className="text-3xl font-display">
                #{userRank >= 0 ? userRank + 1 : '-'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Award className="w-8 h-8 text-gold/50" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Cours en cours</CardDescription>
              <CardTitle className="text-3xl font-display">{coursesInProgress}</CardTitle>
            </CardHeader>
            <CardContent>
              <BookOpen className="w-8 h-8 text-accent/50" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Certifications</CardDescription>
              <CardTitle className="text-3xl font-display">{certifications?.length || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <Award className="w-8 h-8 text-success/50" />
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="gradient-hero text-white">
          <CardContent className="py-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-display font-bold mb-2">Continuez à apprendre</h2>
              <p className="opacity-90">Explorez notre catalogue et gagnez des points !</p>
            </div>
            <Link to="/catalog">
              <Button variant="secondary" size="lg">
                Voir les cours
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
