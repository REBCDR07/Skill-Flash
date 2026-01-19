import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Zap, Award, BarChart3, ShieldCheck, Search, Users, FileCheck } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const mockChartData = [
    { name: 'Lun', val: 10 },
    { name: 'Mar', val: 25 },
    { name: 'Mer', val: 20 },
    { name: 'Jeu', val: 45 },
    { name: 'Ven', val: 38 },
    { name: 'Sam', val: 65 },
    { name: 'Dim', val: 80 },
];

export const FeatureShowcase = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto py-24">
            {/* 1. Quiz Experience Card */}
            <Card className="h-[450px] relative overflow-hidden border-none rounded-[3rem] bg-card/40 backdrop-blur-xl group hover:shadow-3xl transition-all duration-700">
                <div className="absolute top-0 left-0 w-full h-2 gradient-primary" />
                <div className="p-10 flex flex-col h-full">
                    <Badge className="w-fit mb-6 bg-primary/10 text-primary border-none text-[10px] font-black tracking-widest px-4 py-1">EXPÉRIENCE INTERACTIVE</Badge>
                    <h3 className="text-3xl font-display font-black mb-4 leading-tight">Quiz Adaptatifs & <br /><span className="gradient-text">Validation Réelle</span></h3>
                    <p className="text-muted-foreground font-medium mb-10">Nos tests ne sont pas de simples formulaires. Ils analysent votre raisonnement en temps réel.</p>

                    <div className="flex-1 bg-background/50 rounded-3xl border border-border/50 p-6 space-y-4 shadow-inner transform group-hover:scale-[1.02] transition-transform duration-500">
                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                            <p className="text-sm font-black mb-2 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-primary" /> QUESTION 12/50
                            </p>
                            <p className="text-sm font-medium">Quel est le principal avantage de l'architecture Serverless ?</p>
                        </div>
                        <div className="space-y-2 opacity-60">
                            <div className="p-3 rounded-xl border border-border/50 bg-background flex items-center justify-between">
                                <span className="text-xs font-bold">A) Performance accrue</span>
                            </div>
                            <div className="p-3 rounded-xl border border-primary/40 bg-primary/5 flex items-center justify-between">
                                <span className="text-xs font-bold text-primary">B) Scalabilité automatique</span>
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 2. Pro Analytics Card */}
            <Card className="h-[450px] relative overflow-hidden border-none rounded-[3rem] bg-card/40 backdrop-blur-xl group hover:shadow-3xl transition-all duration-700">
                <div className="absolute top-0 left-0 w-full h-2 bg-accent" />
                <div className="p-10 flex flex-col h-full">
                    <Badge className="w-fit mb-6 bg-accent/10 text-accent-foreground border-none text-[10px] font-black tracking-widest px-4 py-1">ANALYSES AVANCÉES</Badge>
                    <h3 className="text-3xl font-display font-black mb-4 leading-tight">Votre <span className="text-accent-foreground underline decoration-accent/30 underline-offset-8">Progression</span> <br />en Temps Réel</h3>
                    <p className="text-muted-foreground font-medium mb-10">Suivez l'évolution de vos compétences avec des courbes de performance de niveau professionnel.</p>

                    <div className="flex-1 bg-background/50 rounded-3xl border border-border/50 p-4 shadow-inner">
                        <div className="flex justify-between items-center mb-4 px-2">
                            <span className="text-[10px] font-black tracking-widest text-muted-foreground">SCORE D'EXPERTISE</span>
                            <span className="text-xl font-black text-accent-foreground">+450 XP</span>
                        </div>
                        <div className="h-32 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={mockChartData}>
                                    <defs>
                                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Area type="monotone" dataKey="val" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 3. Official Certification Card */}
            <Card className="h-[450px] relative overflow-hidden border-none rounded-[3rem] bg-card/40 backdrop-blur-xl group hover:shadow-3xl transition-all duration-700">
                <div className="absolute top-0 left-0 w-full h-2 bg-success" />
                <div className="p-10 flex flex-col h-full">
                    <Badge className="w-fit mb-6 bg-success/10 text-success border-none text-[10px] font-black tracking-widest px-4 py-1">CERTIFICATION OFFICIELLE</Badge>
                    <h3 className="text-3xl font-display font-black mb-4 leading-tight">Diplômes <br /><span className="text-success underline decoration-success/30 underline-offset-8">Vérifiables</span></h3>
                    <p className="text-muted-foreground font-medium mb-10">Partagez vos réussites. Chaque certificat est sécurisé par un ID unique et infalsifiable.</p>

                    <div className="flex-1 bg-white/50 backdrop-blur-md rounded-3xl border border-border/50 p-6 shadow-2xl relative overflow-hidden group-hover:rotate-1 transition-transform duration-700">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-black text-xs">SF</div>
                            <Badge variant="outline" className="border-success/30 text-success bg-white/50 font-black text-[8px]">VERIFIED GRADUATE</Badge>
                        </div>
                        <div className="text-center py-4">
                            <p className="text-[8px] tracking-[0.3em] font-black text-muted-foreground/50 mb-1">DIPLÔME DE RÉUSSITE</p>
                            <p className="text-xl font-display font-black text-black leading-none mb-1">Alexandre Leroux</p>
                            <p className="text-[8px] font-bold text-success">EXPERT MARKETING DIGITAL</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6 border-t border-dashed border-black/10 pt-4">
                            <div className="space-y-1">
                                <p className="text-[6px] font-black text-muted-foreground uppercase">Validation</p>
                                <p className="text-[10px] font-black text-black tracking-tighter">SCORE: 98%</p>
                            </div>
                            <div className="flex justify-end items-end">
                                <ShieldCheck className="w-8 h-8 text-primary/20" />
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* 4. Authority Center Card */}
            <Card className="h-[450px] relative overflow-hidden border-none rounded-[3rem] bg-card/40 backdrop-blur-xl group hover:shadow-3xl transition-all duration-700">
                <div className="absolute top-0 left-0 w-full h-2 bg-gold" />
                <div className="p-10 flex flex-col h-full">
                    <Badge className="w-fit mb-6 bg-gold/10 text-gold-foreground border-none text-[10px] font-black tracking-widest px-4 py-1">PORTAIL D'AUTORITÉ</Badge>
                    <h3 className="text-3xl font-display font-black mb-4 leading-tight">Centre de <br /><span className="text-gold underline decoration-gold/30 underline-offset-8">Vérification</span></h3>
                    <p className="text-muted-foreground font-medium mb-10">Un espace dédié aux recruteurs pour confirmer instantanément l'authenticité de vos titres.</p>

                    <div className="flex-1 bg-background/50 rounded-3xl border border-border/50 p-6 shadow-inner space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center border border-success/20">
                                <CheckCircle2 className="w-6 h-6 text-success" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-muted-foreground tracking-widest leading-none mb-1 uppercase">Statut du Titre</p>
                                <p className="text-sm font-black text-success">AUTHENTICITÉ CONFIRMÉE</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-2 w-full bg-muted/30 rounded-full" />
                            <div className="h-2 w-2/3 bg-muted/30 rounded-full" />
                            <div className="h-2 w-1/2 bg-muted/10 rounded-full" />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                            <FileCheck className="w-10 h-10 text-primary opacity-20" />
                            <div className="text-right">
                                <p className="text-[8px] font-black text-muted-foreground">DIGITAL HASH</p>
                                <p className="text-[8px] font-mono text-muted-foreground/50">8f2e...93c1</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};
