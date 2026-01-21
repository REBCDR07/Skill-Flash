import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePublicPortfolio } from '@/hooks/useProgress';
import {
    Zap,
    Trophy,
    MapPin,
    Calendar,
    ExternalLink,
    Share2,
    ShieldCheck,
    Award,
    Star,
    Sparkles,
    ArrowLeft,
    Linkedin,
    Copy,
    CheckCircle2,
    Lock
} from 'lucide-react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PublicPortfolio = () => {
    const { username } = useParams<{ username: string }>();
    const { data, isLoading, error } = usePublicPortfolio(username || '');

    const copyUrl = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Lien copié dans le presse-papier !');
    };

    console.log('PublicPortfolio: STATE -> isLoading:', isLoading, 'data:', !!data);

    if (isLoading && !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background/95">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-primary border-r-2 shadow-glow"></div>
                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary animate-pulse" />
                    </div>
                    <p className="text-muted-foreground font-display font-bold tracking-widest text-sm uppercase">Chargement du Portfolio Elite...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background/95 p-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h1 className="text-3xl font-display font-black mb-4">Profil Introuvable</h1>
                    <p className="text-muted-foreground mb-8">Ce portfolio n'existe pas ou a été rendu privé par son propriétaire.</p>
                    <Link to="/">
                        <Button className="gradient-primary rounded-2xl h-14 px-8 font-black">
                            RETOUR À L'ACCUEIL
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const { profile, certifications, radarData } = data;

    return (
        <div className="min-h-screen bg-background/95 selection:bg-primary/20 pb-20">
            {/* Premium Header/Cover */}
            <div className="h-64 md:h-80 gradient-primary relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-foreground/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />

                <div className="container mx-auto px-4 h-full flex items-end pb-10">
                    <Link to="/" className="absolute top-8 left-8 inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors font-bold z-20 group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        SkillFlash.
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Sidebar: Profile Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="rounded-[3rem] border-none bg-card/60 backdrop-blur-2xl shadow-3xl overflow-hidden p-10 pt-12 relative flex flex-col items-center text-center group">
                            <Avatar className="w-32 h-32 md:w-40 md:h-40 border-8 border-background shadow-3xl relative z-10 -mt-20 group-hover:scale-105 transition-transform duration-700">
                                <AvatarImage src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} />
                                <AvatarFallback className="text-4xl font-black bg-primary/10 text-primary">{(profile.full_name || 'U')[0]}</AvatarFallback>
                            </Avatar>

                            <div className="mt-8 space-y-4">
                                <div className="space-y-1">
                                    <h1 className="text-3xl font-display font-black tracking-tight">{profile.full_name || profile.username}</h1>
                                    <p className="text-primary font-bold tracking-widest text-[10px] uppercase">Elite Alumnus</p>
                                </div>

                                <div className="flex flex-wrap justify-center gap-3">
                                    <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black px-4 py-1.5 rounded-full">
                                        {profile.total_points.toLocaleString()} PTS
                                    </Badge>
                                    <Badge variant="outline" className="border-border/50 text-[10px] font-black px-4 py-1.5 rounded-full uppercase">
                                        Membre Actif
                                    </Badge>
                                </div>

                                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">
                                    Apprenant sur SkillFlash Academy.
                                </p>
                            </div>

                            <div className="w-full h-px bg-border/30 my-8" />

                            <div className="w-full space-y-6">
                                <Button className="w-full h-14 rounded-2xl bg-[#0077b5] hover:bg-[#0077b5]/90 text-white font-bold gap-3 shadow-lg shadow-[#0077b5]/20 hover:scale-[1.02] transition-all">
                                    <Linkedin className="w-5 h-5 fill-white" />
                                    VOIR SUR LINKEDIN
                                </Button>
                                <Button variant="outline" onClick={copyUrl} className="w-full h-14 rounded-2xl font-bold gap-3 border-2 hover:bg-muted/50 transition-all">
                                    <Copy className="w-5 h-5" />
                                    PARTAGER LE PORTFOLIO
                                </Button>
                            </div>
                        </Card>

                        <Card className="rounded-[3rem] border-none bg-card/60 backdrop-blur-2xl shadow-2xl p-8 space-y-6">
                            <h3 className="text-lg font-display font-black tracking-tight">Expertise Flash</h3>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 800 }} />
                                        <Radar
                                            name="Points"
                                            dataKey="value"
                                            stroke="#8b5cf6"
                                            fill="#8b5cf6"
                                            fillOpacity={0.6}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content: Certifications & Stats */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Stats Header */}
                        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                            {[
                                { label: "Points Flash", val: profile.total_points.toLocaleString(), icon: Zap },
                                { label: "Diplômes", val: certifications.length, icon: Award },
                            ].map((stat, i) => (
                                <Card key={i} className="rounded-3xl border-none bg-card/40 backdrop-blur-xl p-6 flex flex-col items-center text-center group hover:scale-105 transition-all duration-500 shadow-xl">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <p className="text-2xl font-display font-black tracking-tight">{stat.val}</p>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</p>
                                </Card>
                            ))}
                        </div>

                        {/* Certifications Showcase */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between px-4">
                                <h2 className="text-3xl font-display font-black tracking-tight">Certifications <span className="gradient-text">Vérifiées</span></h2>
                                <Badge variant="outline" className="border-primary/20 text-primary uppercase text-[10px] font-black tracking-widest px-4 py-1.5">Mise à jour aujourd'hui</Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {certifications.map((cert, idx) => (
                                    <Card key={cert.id} className="rounded-[2.5rem] border-none bg-card/40 backdrop-blur-2xl p-8 relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 shadow-xl">
                                        <div className="absolute top-0 left-0 w-full h-2 gradient-primary" />

                                        <div className="flex flex-col h-full justify-between">
                                            <div className="space-y-4">
                                                <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center border border-border/30 group-hover:bg-primary/10 transition-colors">
                                                    <Award className="w-8 h-8 text-primary" />
                                                </div>
                                                <h3 className="text-xl font-display font-black leading-tight">{cert.course_title}</h3>
                                                <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">ID: {cert.verification_code}</p>
                                            </div>

                                            <div className="mt-8 flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <ShieldCheck className="w-5 h-5 text-success" />
                                                    <span className="text-xs font-bold text-success uppercase tracking-widest">Validé</span>
                                                </div>
                                                <Button asChild size="sm" variant="outline" className="flex-1 rounded-xl font-bold gap-2 border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm">
                                                    <Link to={`/verify/${cert.verification_code}`}>
                                                        Vérifier <ExternalLink className="w-4 h-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>

                            {certifications.length === 0 && (
                                <div className="text-center py-20 bg-card/20 rounded-[3rem] border border-dashed border-border/30">
                                    <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-6" />
                                    <p className="text-muted-foreground font-bold tracking-tight">Aucune certification obtenue pour le moment.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicPortfolio;
