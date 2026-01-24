import React, { useRef, useState } from 'react';
import { toPng, toBlob } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Download, Award, ShieldCheck, Zap, Share2, Facebook, Twitter, Linkedin, Copy, Check, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface CertificateProps {
    userName: string;
    courseTitle: string;
    score: number;
    date: string;
    verificationCode: string;
}

export const CertificatePNG = ({ userName, courseTitle, score, date, verificationCode }: CertificateProps) => {
    const certificateRef = useRef<HTMLDivElement>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    const shareMessage = `Je viens de valider mon expertise "${courseTitle}" sur SkillFlash Academy ! 🚀 \nScore : ${score}% de réussite. \nRejoignez l'élite du digital : https://skill-flash.vercel.app #SkillFlash #Expert #Certification`;

    const getFilename = () => `SF-Certificat-${courseTitle.replace(/\s+/g, '-')}`.toUpperCase();

    const handleDownload = async () => {
        if (certificateRef.current === null) return;
        setIsExporting(true);
        try {
            const dataUrl = await toPng(certificateRef.current, { cacheBust: true, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `${getFilename()}.png`;
            link.href = dataUrl;
            link.click();
            toast.success("Certificat enregistré !");
        } catch (err) {
            console.error('Error generating image:', err);
            toast.error("Échec de l'export.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleNativeShare = async () => {
        if (certificateRef.current === null) return;

        if (!navigator.share) {
            toast.error("Le partage natif n'est pas supporté sur ce navigateur.");
            return;
        }

        setIsSharing(true);
        try {
            const blob = await toBlob(certificateRef.current, { cacheBust: true, pixelRatio: 2 });
            if (!blob) throw new Error("Blob generation failed");

            const file = new File([blob], `${getFilename()}.png`, { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: `Certificat SkillFlash - ${courseTitle}`,
                    text: shareMessage,
                });
                toast.success("Partage réussi !");
            } else {
                // Fallback to text only share if file share is not supported
                await navigator.share({
                    title: `Certificat SkillFlash - ${courseTitle}`,
                    text: shareMessage,
                    url: 'https://skill-flash.vercel.app'
                });
            }
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                console.error('Error sharing:', err);
                toast.error("Échec du partage.");
            }
        } finally {
            setIsSharing(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareMessage);
        setIsCopied(true);
        toast.success("Message professionnel copié !");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const shareSocial = (platform: string) => {
        const url = encodeURIComponent('https://skill-flash.vercel.app');
        const text = encodeURIComponent(shareMessage);
        let shareUrl = '';

        switch (platform) {
            case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${text}`; break;
            case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
            case 'linkedin': shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`; break;
            case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${text}`; break;
        }
        window.open(shareUrl, '_blank');
    };

    const CertificateTemplate = ({ isPreview = false }: { isPreview?: boolean }) => (
        <div
            ref={isPreview ? null : certificateRef}
            className={`${isPreview ? 'w-full aspect-[4/3] max-w-[500px] shadow-2xl rounded-xl mx-auto mb-8 cursor-zoom-in' : 'w-[800px] h-[600px]'} bg-white p-8 md:p-12 relative flex flex-col justify-between overflow-hidden text-slate-950 font-sans border-8 border-double border-slate-100`}
        >
            {/* Background Branding */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] rotate-12 pointer-events-none">
                <Award className="w-[300px] h-[300px] md:w-[500px] md:h-[500px]" />
            </div>

            {/* Decorative Borders */}
            <div className="absolute inset-2 border border-slate-200 pointer-events-none" />
            <div className="absolute inset-4 border-2 border-primary/10 rounded-lg pointer-events-none" />

            {/* Header */}
            <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white fill-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter">SkillFlash Academy</span>
                </div>
                <p className="text-[8px] uppercase font-black tracking-[0.4em] text-primary">DIPLÔME DE COMPÉTENCES DIGITALES</p>
            </div>

            {/* Body */}
            <div className="text-center relative z-10 flex-1 flex flex-col justify-center py-4">
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-slate-900 mb-6">
                    CERTIFICAT DE RÉUSSITE
                </h1>

                <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Ce document atteste l'expertise de</p>
                    <h2 className="text-2xl md:text-4xl font-black text-primary underline decoration-2 underline-offset-4">{userName}</h2>
                </div>

                <div className="mt-8 space-y-2">
                    <p className="text-xs md:text-sm font-medium text-slate-600">
                        A complété avec brio le protocole d'examen final :
                    </p>
                    <h3 className="text-lg md:text-2xl font-black text-slate-900 px-4 py-2 border-y border-slate-100 uppercase">
                        {courseTitle}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-widest">
                        Score de validation : <span className="text-primary font-black">{score}%</span>
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="relative z-10 flex justify-between items-end px-2 sm:px-4">
                <div className="text-left space-y-0.5">
                    <p className="text-[7px] font-black text-slate-400 tracking-widest uppercase">Émis le</p>
                    <p className="text-[10px] font-black text-slate-900">{new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>

                <div className="text-center">
                    <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center border border-primary/20 mb-1">
                        <ShieldCheck className="w-7 h-7 text-primary" />
                    </div>
                    <p className="text-[6px] font-mono text-slate-400">ID: {verificationCode}</p>
                </div>

                <div className="text-right">
                    <p className="text-[7px] font-black text-slate-400 tracking-widest uppercase mb-1">Validation</p>
                    <p className="text-lg text-primary/30 font-black italic select-none">SkillFlash_Auth</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="w-full space-y-10">
            <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-center block tracking-widest text-muted-foreground animate-pulse">Prévisualisation du Diplôme</Label>
                <CertificateTemplate isPreview />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <Button
                    onClick={handleNativeShare}
                    disabled={isSharing}
                    className="h-20 rounded-[1.5rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl shadow-2xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-4"
                >
                    {isSharing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Share2 className="w-6 h-6" />}
                    PARTAGER MON DIPLÔME
                </Button>

                <div className="grid grid-cols-2 gap-4">
                    <Button
                        onClick={handleDownload}
                        disabled={isExporting}
                        variant="secondary"
                        className="h-16 rounded-2xl font-bold group transition-all"
                    >
                        {isExporting ? <Loader2 className="mr-2 w-5 h-5 animate-spin" /> : <Download className="mr-2 w-5 h-5 group-hover:animate-bounce" />}
                        TÉLÉCHARGER PNG
                    </Button>

                    <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        className="h-16 rounded-2xl border-2 font-bold gap-3"
                    >
                        {isCopied ? <Check className="text-green-500 w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        {isCopied ? "COPIÉ !" : "COPIER LE TEXTE"}
                    </Button>
                </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-widest mb-6">Partage Direct Réseaux</p>
                <div className="flex justify-center flex-wrap gap-4">
                    <button onClick={() => shareSocial('linkedin')} title="LinkedIn" className="p-4 rounded-2xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm">
                        <Linkedin className="w-6 h-6" />
                    </button>
                    <button onClick={() => shareSocial('twitter')} title="Twitter" className="p-4 rounded-2xl bg-slate-50 text-slate-900 hover:bg-black hover:text-white transition-all transform hover:-translate-y-1 shadow-sm">
                        <Twitter className="w-6 h-6" />
                    </button>
                    <button onClick={() => shareSocial('facebook')} title="Facebook" className="p-4 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm">
                        <Facebook className="w-6 h-6" />
                    </button>
                    <button onClick={() => shareSocial('whatsapp')} title="WhatsApp" className="p-4 rounded-2xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm">
                        <Share2 className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="fixed -left-[2000px] top-0">
                <CertificateTemplate />
            </div>
        </div>
    );
};
