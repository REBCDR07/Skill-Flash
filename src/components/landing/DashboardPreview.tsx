import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    Trophy,
    Target,
    Award,
    Zap,
    TrendingUp,
    Clock
} from "lucide-react";

export const DashboardPreview = () => {
    return (
        <div className="relative w-full max-w-4xl mx-auto mt-20 animate-fade-in-up">
            {/* Decorative glass elements */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/50 shadow-2xl relative z-10">

                {/* Course Progress Card */}
                <Card className="bg-background/60 border-none shadow-sm md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            Progression Marketing Digital
                        </CardTitle>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-none">Niveau 4</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <span className="text-2xl font-bold">75%</span>
                                <span className="text-xs text-muted-foreground">3/4 chapitres complétés</span>
                            </div>
                            <Progress value={75} className="h-2" />
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-accent" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground">Temps d'étude</p>
                                        <p className="text-xs font-bold">12h 45m</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-gold" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-muted-foreground">Série actuelle</p>
                                        <p className="text-xs font-bold">5 jours</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats / Achievement Card */}
                <div className="space-y-6">
                    <Card className="bg-background/60 border-none shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Trophy className="w-5 h-5 text-gold" />
                                    <span className="text-sm font-bold">Points SkillFlash</span>
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-foreground">
                                2,450 <span className="text-sm font-normal text-muted-foreground">XP</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-2">
                                Top 5% mondial ce mois-ci
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-background/60 border-none shadow-sm">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-2 mb-3 text-sm font-bold text-primary">
                                <Award className="w-4 h-4" />
                                Certificat prêt
                            </div>
                            <div className="flex items-center justify-center p-4 bg-muted/50 rounded-xl border border-dashed border-border/50">
                                <div className="text-center">
                                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Target className="w-5 h-5 text-primary" />
                                    </div>
                                    <p className="text-[10px] font-medium">Marketing SEO</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Floating elements to simulated interactions */}
                <div className="absolute -right-8 top-1/4 animate-bounce-slow hidden lg:block">
                    <Badge className="bg-white text-black hover:bg-white shadow-xl py-2 px-3 gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        +50 XP gagnés !
                    </Badge>
                </div>
            </div>
        </div>
    );
};
