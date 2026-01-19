import * as React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useVerifyCertificate } from '@/hooks/useProgress';
import { Certification } from '@/types/course';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, CheckCircle2, AlertTriangle, Calendar, Award, User, ExternalLink, ShieldCheck, FileCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';

interface VerifiedCertificate extends Certification {
    profiles: {
        full_name: string | null;
        username: string | null;
    } | null;
}

const CertificateVisual = ({ cert, profileName }: { cert: VerifiedCertificate, profileName: string }) => {
    const formattedDate = new Date(cert.issued_at).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="w-full max-w-5xl mx-auto mb-16 relative perspective-1000">
            {/* Decorative background shadow */}
            <div className="absolute -inset-4 bg-gold-500/10 blur-3xl rounded-[4rem] -z-10 animate-pulse"></div>

            {/* Main Certificate Content */}
            <div className="aspect-[1.414/1] bg-white rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden relative border-[16px] border-[#2c1810]/5 p-6 md:p-12">

                {/* Subtle background texture */}
                <div className="absolute inset-0 bg-guilloche opacity-10 pointer-events-none"></div>

                {/* Inner Border Lines */}
                <div className="absolute inset-4 border-2 border-gold-600/30 rounded-sm"></div>
                <div className="absolute inset-6 border-[1px] border-gold-600/10 rounded-sm"></div>

                <div className="h-full border-[1px] border-gold-600/20 bg-white/40 backdrop-blur-[1px] rounded-sm p-8 flex flex-col items-center justify-between relative shadow-inner">

                    {/* Top Branding Section */}
                    <div className="text-center w-full">
                        <div className="flex justify-center items-center gap-4 mb-6">
                            <div className="h-[1px] w-12 md:w-24 bg-gold-600/40"></div>
                            <div className="w-14 h-14 bg-[#1e293b] rounded-full flex items-center justify-center border-4 border-gold-500/40 shadow-lg">
                                <Zap className="w-6 h-6 text-gold-400" />
                            </div>
                            <div className="h-[1px] w-12 md:w-24 bg-gold-600/40"></div>
                        </div>

                        <h2 className="text-[10px] md:text-xs font-black tracking-[0.6em] uppercase text-slate-500 mb-2">SkillFlash International Academy</h2>
                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#2c1810] tracking-tight mb-4">CERTIFICAT D'ACHÈVEMENT</h1>
                        <div className="h-[2px] w-32 bg-gold-600/40 mx-auto rounded-full"></div>
                    </div>

                    {/* Recipient and Course Body */}
                    <div className="text-center space-y-4 md:space-y-6 flex-1 flex flex-col justify-center py-6">
                        <p className="text-sm md:text-lg font-medium text-slate-500 italic">Ce document atteste solennellement que</p>

                        <div className="relative inline-block">
                            <h3 className="text-3xl md:text-6xl font-serif font-black text-slate-900 leading-tight lowercase first-letter:uppercase">
                                {profileName}
                            </h3>
                            <div className="absolute -bottom-2 left-0 right-0 h-[1px] bg-gold-600/20"></div>
                        </div>

                        <p className="text-sm md:text-lg font-medium text-slate-500 italic">a validé avec distinction l'intégralité du programme d'expertise</p>

                        <h4 className="text-2xl md:text-4xl font-sans font-black text-primary uppercase tracking-tighter">
                            {cert.course_title}
                        </h4>
                    </div>

                    {/* Footer Details */}
                    <div className="w-full flex justify-between items-end pt-8 border-t border-gold-600/10">
                        <div className="text-left space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Date de délivrance</p>
                            <p className="text-xs md:text-sm font-bold text-slate-800">{formattedDate}</p>
                            <div className="h-[1px] w-16 bg-gold-600/20 mt-4"></div>
                            <p className="text-[8px] italic text-slate-400">SkillFlash Certificat</p>
                        </div>

                        <div className="text-right space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Vérification Numérique</p>
                            <code className="text-[9px] font-mono font-bold text-slate-400">
                                {cert.verification_code}
                            </code>
                            <div className="h-[1px] w-16 bg-gold-600/20 mt-4 ml-auto"></div>
                            <p className="text-[8px] italic text-slate-400">SkillFlash Digital Ledger</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const VerifyCertificate = () => {
    const { code } = useParams<{ code: string }>();
    const { data: certData, isLoading } = useVerifyCertificate(code);
    const cert = certData as unknown as VerifiedCertificate | null;

    return (
        <div className="min-h-screen bg-background/95 flex flex-col pt-[73px] selection:bg-primary/20">
            <Navbar />

            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-12">
                {/* Authority Header */}
                <div className="max-w-4xl w-full text-center space-y-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-sm font-black tracking-widest uppercase">Système de Vérification Officiel</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter">
                        Authentification du <span className="gradient-text">Diplôme</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        SkillFlash Academy garantit l'intégrité de ses certifications via un système de traçabilité cryptographique unique.
                    </p>
                </div>

                <div className="max-w-4xl w-full">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-6 py-20">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-primary border-r-2 shadow-glow"></div>
                                <ShieldCheck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-pulse" />
                            </div>
                            <p className="text-muted-foreground font-display font-bold tracking-widest">SÉCURISATION DES DONNÉES...</p>
                        </div>
                    ) : cert ? (
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            {/* Visual Certificate Preview */}
                            <CertificateVisual cert={cert} profileName={cert.profiles?.full_name || cert.profiles?.username || 'Utilisateur Certifié'} />

                            {/* Technical Details Card */}
                            <Card className="border-none rounded-[3rem] shadow-3xl bg-card/60 backdrop-blur-xl overflow-hidden mb-12">
                                <div className="h-3 gradient-primary" />

                                <div className="flex flex-col lg:flex-row h-full">
                                    {/* Left Side: Branding & Status */}
                                    <div className="lg:w-1/3 p-12 flex flex-col items-center justify-center text-center bg-muted/20 border-r border-border/50">
                                        <div className="w-24 h-24 bg-success/10 rounded-3xl flex items-center justify-center mb-6 border border-success/20 shadow-inner">
                                            <CheckCircle2 className="w-12 h-12 text-success" />
                                        </div>
                                        <Badge variant="outline" className="bg-success/10 text-success border-success/20 font-black mb-4 py-1 px-4 text-xs uppercase tracking-widest">
                                            STATUT : VALIDÉ
                                        </Badge>
                                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                            Ce certificat est authentique et a été délivré après réussite des tests de certification SkillFlash.
                                        </p>
                                    </div>

                                    {/* Right Side: Data */}
                                    <div className="flex-1 p-12 space-y-10">
                                        <div className="grid md:grid-cols-2 gap-10">
                                            <div className="space-y-2">
                                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                                                    <User className="w-3.5 h-3.5" /> TITULAIRE DU DIPLÔME
                                                </p>
                                                <p className="text-2xl font-display font-black tracking-tight">{cert.profiles?.full_name || cert.profiles?.username || 'Utilisateur Certifié'}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                                                    <Award className="w-3.5 h-3.5" /> DOMAINE D'EXPERTISE
                                                </p>
                                                <p className="text-2xl font-display font-black tracking-tight text-primary">{cert.course_title}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5" /> DATE DE DÉLIVRANCE
                                                </p>
                                                <p className="text-xl font-bold">
                                                    {new Date(cert.issued_at).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                                                    <Zap className="w-3.5 h-3.5" /> SCORE DE RÉUSSITE
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-3xl font-black">{cert.final_score}%</span>
                                                    <Badge className="bg-primary/10 text-primary border-primary/20 font-black">NIVEAU EXPERT</Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-background/50 p-6 rounded-[2rem] space-y-3 border border-border/50 shadow-inner group transition-all">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                                                    <FileCheck className="w-3.5 h-3.5" /> EMPREINTE NUMÉRIQUE (CODE)
                                                </p>
                                                <ShieldCheck className="w-4 h-4 text-primary opacity-30 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <code className="text-xs font-mono block break-all p-4 bg-muted/30 rounded-2xl border border-border/30 text-muted-foreground group-hover:text-foreground transition-colors">
                                                {cert.verification_code}
                                            </code>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-6 pt-6">
                                            <Link to="/catalog" className="flex-1">
                                                <Button variant="outline" className="w-full h-14 rounded-2xl font-black border-2 hover:bg-muted/50 transition-all">
                                                    S'INSCRIRE À UN COURS
                                                </Button>
                                            </Link>
                                            <Link to="/" className="flex-1">
                                                <Button className="w-full h-14 rounded-2xl font-black gradient-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                                    DÉCOUVRIR SKILLFLASH
                                                    <ExternalLink className="w-4 h-4 ml-2" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <Card className="border-none rounded-[3rem] shadow-3xl bg-card/60 backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="h-3 bg-destructive" />
                            <CardHeader className="text-center py-16 px-12 space-y-6">
                                <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-destructive/20 shadow-xl">
                                    <AlertTriangle className="w-12 h-12 text-destructive" />
                                </div>
                                <div className="space-y-4">
                                    <CardTitle className="text-4xl font-display font-black text-destructive tracking-tight">Vérification Échouée</CardTitle>
                                    <CardDescription className="text-lg max-w-lg mx-auto leading-relaxed">
                                        Il est impossible de confirmer l'authenticité de cette certification. Ce lien est peut-être expiré ou le code a été altéré.
                                    </CardDescription>
                                </div>
                                <div className="pt-6">
                                    <Link to="/">
                                        <Button className="h-14 px-12 rounded-2xl font-black gradient-primary shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                                            RETOUR AU CENTRE D'EXCELLENCE
                                        </Button>
                                    </Link>
                                </div>
                            </CardHeader>
                        </Card>
                    )}
                </div>
            </main>

            <footer className="py-12 text-center text-muted-foreground text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                &copy; 2026 SkillFlash International Academy &bull; Secure Digital Certification
            </footer>
        </div>
    );
};

export default VerifyCertificate;
