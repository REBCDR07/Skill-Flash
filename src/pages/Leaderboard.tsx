import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLeaderboard } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';
import { Zap, Trophy, Medal, Crown } from 'lucide-react';

const Leaderboard = () => {
  const { user } = useAuth();
  const { data: leaderboard, isLoading } = useLeaderboard(20);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-6 h-6 text-gold" />;
    if (index === 1) return <Medal className="w-6 h-6 text-silver" />;
    if (index === 2) return <Medal className="w-6 h-6 text-bronze" />;
    return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{index + 1}</span>;
  };

  const getRankBg = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-gold/20 to-gold/5 border-gold/30';
    if (index === 1) return 'bg-gradient-to-r from-silver/20 to-silver/5 border-silver/30';
    if (index === 2) return 'bg-gradient-to-r from-bronze/20 to-bronze/5 border-bronze/30';
    return 'bg-card';
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
            {user ? (
              <Link to="/dashboard">
                <Button>Tableau de bord</Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button>Connexion</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-28 pb-16 max-w-2xl">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl gradient-gold flex items-center justify-center mx-auto mb-6 shadow-glow">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold mb-4">Classement</h1>
          <p className="text-muted-foreground">Les meilleurs apprenants de SkillFlash</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : leaderboard && leaderboard.length > 0 ? (
          <div className="space-y-3">
            {leaderboard.map((player, index) => (
              <Card 
                key={player.user_id} 
                className={`${getRankBg(index)} ${player.user_id === user?.id ? 'ring-2 ring-primary' : ''} transition-all hover:shadow-md`}
              >
                <CardContent className="py-4 flex items-center gap-4">
                  {getRankIcon(index)}
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg font-bold">
                    {(player.username || player.full_name || 'U')[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">
                      {player.username || player.full_name || 'Utilisateur'}
                      {player.user_id === user?.id && <span className="text-primary ml-2">(vous)</span>}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-lg text-primary">{player.total_points}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Aucun apprenant dans le classement pour le moment.</p>
              <Link to="/catalog" className="mt-4 inline-block">
                <Button>Commencer un cours</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Leaderboard;
