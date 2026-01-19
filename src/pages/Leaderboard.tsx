import React from 'react';
import { Trophy, Medal, Crown, User as UserIcon, Zap, Star, ShieldCheck, ArrowLeft, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLeaderboard } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';

const Leaderboard = () => {
  const { data: leaderboard, isLoading } = useLeaderboard(50);
  const { user } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  const topThree = leaderboard?.slice(0, 3) || [];
  const others = leaderboard?.slice(3) || [];

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest">
              L'Élite de SkillFlash Academy
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black text-slate-900 tracking-tight leading-none">
              Le Panthéon de <span className="text-amber-500">l'Excellence</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium italic">
              "La discipline est le pont entre les objectifs et l'accomplissement. Rejoignez les sommets."
            </p>
          </div>

          {/* Podium Section */}
          <div className="grid md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto px-4 pt-12">
            {/* Silver - 2nd */}
            {topThree[1] && (
              <div className="order-2 md:order-1 transform transition-all hover:scale-105">
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <Avatar className="w-24 h-24 border-4 border-slate-300 shadow-2xl ring-8 ring-slate-100">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1].username || topThree[1].user_id}`} />
                      <AvatarFallback>{(topThree[1].username || 'U')[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-slate-400 rounded-full p-2 shadow-lg border-2 border-white">
                      <Medal className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="w-full bg-white border border-slate-200 rounded-[2rem] p-6 text-center shadow-xl mb-[-2rem] relative z-10">
                    <p className="font-bold text-slate-900 truncate">{topThree[1].username || 'Anonyme'}</p>
                    <p className="text-xl font-black text-slate-400">{topThree[1].total_points} PTS</p>
                  </div>
                  <div className="w-full h-32 bg-slate-100 border-x border-b border-slate-200 rounded-b-[2rem] flex items-center justify-center">
                    <span className="text-5xl font-black text-slate-200 italic">2</span>
                  </div>
                </div>
              </div>
            )}

            {/* Gold - 1st */}
            {topThree[0] && (
              <div className="order-1 md:order-2 transform transition-all hover:scale-110 z-20">
                <div className="flex flex-col items-center">
                  <div className="relative mb-8">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce">
                      <Crown className="w-12 h-12 text-amber-500" />
                    </div>
                    <Avatar className="w-32 h-32 border-4 border-amber-400 shadow-2xl ring-8 ring-amber-50">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0].username || topThree[0].user_id}`} />
                      <AvatarFallback>{(topThree[0].username || 'U')[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full p-2.5 shadow-lg border-2 border-white">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="w-full bg-white border-2 border-amber-200 rounded-[2.5rem] p-8 text-center shadow-2xl mb-[-2.5rem] relative z-10 scale-105">
                    <p className="text-lg font-black text-slate-900 truncate">{topThree[0].username || 'Anonyme'}</p>
                    <p className="text-3xl font-black text-amber-500">{topThree[0].total_points} PTS</p>
                    <Badge variant="secondary" className="mt-2 bg-amber-100 text-amber-700 hover:bg-amber-100">Grand Master</Badge>
                  </div>
                  <div className="w-full h-44 bg-gradient-to-b from-amber-50 to-amber-100 border-x border-b border-amber-200 rounded-b-[2.5rem] flex items-center justify-center">
                    <span className="text-7xl font-black text-amber-200 italic">1</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bronze - 3rd */}
            {topThree[2] && (
              <div className="order-3 transform transition-all hover:scale-105">
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <Avatar className="w-24 h-24 border-4 border-orange-300 shadow-2xl ring-8 ring-orange-50">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2].username || topThree[2].user_id}`} />
                      <AvatarFallback>{(topThree[2].username || 'U')[0]}</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-orange-400 rounded-full p-2 shadow-lg border-2 border-white">
                      <Star className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="w-full bg-white border border-orange-100 rounded-[2rem] p-6 text-center shadow-xl mb-[-2rem] relative z-10">
                    <p className="font-bold text-slate-900 truncate">{topThree[2].username || 'Anonyme'}</p>
                    <p className="text-xl font-black text-orange-600">{topThree[2].total_points} PTS</p>
                  </div>
                  <div className="w-full h-24 bg-orange-50 border-x border-b border-orange-100 rounded-b-[2rem] flex items-center justify-center">
                    <span className="text-4xl font-black text-orange-200 italic">3</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Others List */}
          <div className="max-w-3xl mx-auto space-y-4 pb-12">
            <div className="flex items-center justify-between px-8 mb-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Poursuivants Immédiats</h3>
              <div className="h-px bg-slate-100 flex-1 mx-6"></div>
              <ShieldCheck className="w-4 h-4 text-slate-200" />
            </div>

            {others.map((player, index) => (
              <Card key={player.user_id} className="p-4 border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                <div className="flex items-center gap-6">
                  <div className="w-8 text-center text-lg font-black text-slate-300">
                    #{index + 4}
                  </div>
                  <Avatar className="w-12 h-12 rounded-full border border-slate-100 group-hover:scale-110 transition-transform">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username || player.user_id}`} />
                    <AvatarFallback>{(player.username || 'U')[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 flex items-center gap-2">
                      {player.username || player.full_name || 'Anonyme'}
                      {player.user_id === user?.id && <Badge variant="default" className="text-[8px] py-0 px-1 bg-primary/10 text-primary border-none">C'est vous</Badge>}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Expert Certifié SkillFlash</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900">{player.total_points}</p>
                    <p className="text-[9px] text-slate-400 uppercase font-black">Points Flash</p>
                  </div>
                </div>
              </Card>
            ))}

            {others.length === 0 && topThree.length === 0 && (
              <div className="text-center py-20 bg-muted/20 rounded-[2rem] border-2 border-dashed border-slate-200">
                <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">En attente des premiers champions...</p>
              </div>
            )}

            <div className="pt-8 text-center">
              <Link to="/catalog">
                <Button variant="outline" className="w-full max-w-xs mx-auto rounded-2xl group border-2">
                  Continuer mon apprentissage
                  <Zap className="w-4 h-4 ml-2 group-hover:text-primary transition-colors fill-amber-400 stroke-amber-400" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;

