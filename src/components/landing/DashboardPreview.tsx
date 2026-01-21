
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Award, Zap, TrendingUp, Clock } from "lucide-react";

export const DashboardPreview: React.FC = () => {
    return (
        <div className="relative w-full max-w-5xl mx-auto mt-12 md:mt-24 px-2 md:px-0">
            <div className="absolute -top-12 -left-12 w-32 md:w-48 h-32 md:h-48 bg-indigo-500/10 rounded-full blur-[60px] md:blur-[80px]" />
            <div className="absolute -bottom-12 -right-12 w-32 md:w-48 h-32 md:h-48 bg-purple-500/10 rounded-full blur-[60px] md:blur-[80px]" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 p-3 md:p-4 rounded-[2rem] md:rounded-[3rem] bg-white/60 backdrop-blur-2xl border border-white/50 shadow-2xl relative z-10">
                <Card className="md:col-span-2 p-6 md:p-8 shadow-sm border-none bg-white">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                                <TrendingUp className="w-4.5 h-4.5 text-indigo-600" />
                            </div>
                            <div className="text-left">
                                <h4 className="text-xs md:text-sm font-black text-slate-900 leading-tight">Progression Marketing</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Masterclass</p>
                            </div>
                        </div>
                        <Badge className="text-[8px] md:text-[9px]">Niveau 4</Badge>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        <div className="flex justify-between items-end">
                            <span className="text-3xl md:text-4xl font-black tracking-tighter">75%</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">3/4 chapitres</span>
                        </div>
                        <Progress value={75} className="h-2 md:h-3" />

                        <div className="grid grid-cols-2 gap-4 pt-4 md:pt-6">
                            <div className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <div className="text-left">
                                    <p className="text-[8px] font-black text-slate-400 uppercase">Temps</p>
                                    <p className="text-xs font-bold">12h 45m</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <Zap className="w-4 h-4 text-amber-500" />
                                <div className="text-left">
                                    <p className="text-[8px] font-black text-slate-400 uppercase">Série</p>
                                    <p className="text-xs font-bold">5 jours</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="flex flex-row md:flex-col gap-4 md:gap-6">
                    <Card className="p-6 md:p-8 flex-1 shadow-sm border-none bg-white flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-2 mb-3">
                            <Trophy className="w-4 h-4 text-amber-500" />
                            <span className="text-xs font-bold text-slate-900">Points</span>
                        </div>
                        <div className="text-2xl md:text-3xl font-black tracking-tighter">2,450</div>
                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-1">
                            Top 5%
                        </p>
                    </Card>

                    <Card className="p-6 md:p-8 flex-1 shadow-sm border-none bg-white border-dashed border-slate-200 hidden sm:flex flex-col items-center md:items-start text-center md:text-left">
                        <div className="flex items-center gap-2 mb-4">
                            <Award className="w-4 h-4 text-indigo-500" />
                            <span className="text-xs font-bold text-slate-900">Examen</span>
                        </div>
                        <div className="w-full flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl">
                            <Target className="w-6 h-6 text-slate-300 mb-1" />
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                Prêt
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

