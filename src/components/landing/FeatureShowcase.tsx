
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Zap, Award, ShieldCheck, FileCheck } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const mockChartData = [
    { val: 10 }, { val: 25 }, { val: 20 }, { val: 45 }, { val: 38 }, { val: 65 }, { val: 80 }
];

export const FeatureShowcase: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-6xl mx-auto py-6 md:py-12">
            {/* Quiz Card */}
            <Card className="p-6 md:p-10 flex flex-col min-h-[400px] md:min-h-[480px] shadow-sm hover:shadow-md transition-all border-none bg-slate-50/50">
                <Badge className="w-fit mb-6 bg-indigo-100 text-indigo-700">Interactif</Badge>
                <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-4">Quiz <span className="gradient-text italic">Dynamiques</span></h3>
                <p className="text-slate-500 font-medium text-xs md:text-base mb-6 md:mb-10 leading-relaxed">Algorithmes d'adaptation pour une mémorisation haute fréquence.</p>

                <div className="flex-1 bg-white rounded-2xl md:rounded-3xl border border-slate-100 p-5 md:p-8 space-y-3 md:space-y-4 shadow-sm">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="text-[8px] font-black mb-1.5 flex items-center gap-2 text-indigo-500 uppercase tracking-widest">
                            <Zap className="w-3 h-3 fill-current" /> Question 12
                        </p>
                        <p className="text-xs md:text-sm font-bold text-slate-800">Concept de Scalabilité ?</p>
                    </div>
                    <div className="space-y-2">
                        <div className="p-3 rounded-xl bg-slate-50/50 border border-slate-100 text-[10px] md:text-[11px] font-bold text-slate-400">A) Statique</div>
                        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between text-[10px] md:text-[11px] font-bold text-indigo-600">
                            B) Élastique
                            <CheckCircle2 className="w-3 h-3 md:w-3.5 md:h-3.5" />
                        </div>
                    </div>
                </div>
            </Card>

            {/* Analytics Card */}
            <Card className="p-6 md:p-10 flex flex-col min-h-[400px] md:min-h-[480px] shadow-sm hover:shadow-md transition-all border-none bg-slate-50/50">
                <Badge className="w-fit mb-6 bg-purple-100 text-purple-700">Performance</Badge>
                <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-4">Suivi <span className="text-purple-600 italic">Précis</span></h3>
                <p className="text-slate-500 font-medium text-xs md:text-base mb-6 md:mb-10 leading-relaxed">Visualisez chaque étape de votre montée en compétence.</p>

                <div className="flex-1 bg-white rounded-2xl md:rounded-3xl border border-slate-100 p-5 md:p-6 flex flex-col justify-end shadow-sm">
                    <div className="flex justify-between items-center mb-6 px-1">
                        <span className="text-[8px] font-black tracking-widest text-slate-400 uppercase">Progression</span>
                        <span className="text-base md:text-xl font-black text-purple-600">+85%</span>
                    </div>
                    <div className="h-28 md:h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockChartData}>
                                <Area type="monotone" dataKey="val" stroke="#8b5cf6" strokeWidth={3} fill="#8b5cf605" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </Card>

            {/* Cert Card */}
            <Card className="p-6 md:p-10 flex flex-col min-h-[400px] md:min-h-[480px] shadow-sm hover:shadow-md transition-all border-none bg-slate-50/50">
                <Badge className="w-fit mb-6 bg-emerald-100 text-emerald-700">Certifié</Badge>
                <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-4">Preuve de <span className="text-emerald-600 italic">Valeur</span></h3>
                <p className="text-slate-500 font-medium text-xs md:text-base mb-6 md:mb-10 leading-relaxed">Validations infalsifiables reconnues par les recruteurs.</p>

                <div className="flex-1 bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-6 md:p-8 flex flex-col justify-between shadow-sm">
                    <div className="flex justify-between">
                        <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-[9px]">SF</div>
                        <Badge className="bg-emerald-50 text-emerald-600 border-none text-[7px] py-0.5">VALIDÉ</Badge>
                    </div>
                    <div className="text-center">
                        <p className="text-[6px] tracking-[0.3em] font-black text-slate-300 mb-1 uppercase">Attestation d'élite</p>
                        <p className="text-lg md:text-2xl font-black tracking-tight text-slate-900 leading-none">Alexandre L.</p>
                        <p className="text-[8px] font-bold text-emerald-500 uppercase mt-2">Expert Lead</p>
                    </div>
                    <div className="flex justify-between items-end border-t border-slate-50 pt-4">
                        <div className="space-y-0.5">
                            <p className="text-[5px] font-black text-slate-400 uppercase tracking-widest">ID Unique</p>
                            <p className="text-[8px] font-mono text-slate-300">8F2E...93C1</p>
                        </div>
                        <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-slate-200" />
                    </div>
                </div>
            </Card>

            {/* Portal Card */}
            <Card className="p-6 md:p-10 flex flex-col min-h-[400px] md:min-h-[480px] shadow-sm hover:shadow-md transition-all border-none bg-slate-900 text-white">
                <Badge className="w-fit mb-6 bg-white/10 text-slate-300 border-none">Liberté</Badge>
                <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-4">Accès <span className="text-emerald-400 italic">Universel</span></h3>
                <p className="text-slate-400 font-medium text-xs md:text-base mb-6 md:mb-10 leading-relaxed">Pas de compte, pas de mot de passe. Apprenez et certifiez-vous instantanément.</p>

                <div className="flex-1 bg-white/5 rounded-2xl md:rounded-3xl p-6 md:p-8 space-y-4 md:space-y-6">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/10 rounded-xl md:rounded-2xl flex items-center justify-center border border-emerald-500/20">
                            <Zap className="w-5 h-5 md:w-6 md:h-6 text-emerald-400" />
                        </div>
                        <div className="text-left">
                            <p className="text-[7px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Status</p>
                            <p className="text-sm md:text-base font-black text-emerald-400 tracking-tight">VITESSE MAXIMALE</p>
                        </div>
                    </div>
                    <div className="space-y-1.5 opacity-5">
                        <div className="h-1 w-full bg-white rounded-full" />
                        <div className="h-1 w-3/4 bg-white rounded-full" />
                        <div className="h-1 w-1/2 bg-white rounded-full" />
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <FileCheck className="w-7 h-7 md:w-8 md:h-8 text-indigo-400 opacity-20" />
                        <div className="text-right">
                            <p className="text-[6px] font-black text-slate-500 uppercase">Protocole</p>
                            <p className="text-[8px] font-mono text-slate-400">SF_LOCAL_v1</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

