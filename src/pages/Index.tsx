
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Fingerprint,
  ChevronRight,
  ShieldCheck,
  Award,
  MousePointer2,
  Users,
  Search,
  GraduationCap,
  Rocket,
  Target,
  Check
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Navbar from '@/components/Navbar';
import { DashboardPreview } from '@/components/landing/DashboardPreview';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';
import { useAuth } from '@/hooks/useAuth';

const AnimatedNumber = ({ value }: { value: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  // Extract number and suffix/prefix
  const target = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const suffix = value.replace(/[0-9,.]/g, '');
  const prefix = value.match(/^[^\d]*/)?.[0] || '';

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setHasStarted(true);
      }
    }, { threshold: 0.5 });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;

    const start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(easeProgress * target);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted, target]);

  return (
    <span ref={containerRef}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

const useScrollReveal = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);
};

const Index: React.FC = () => {
  const { user } = useAuth();
  useScrollReveal();

  return (
    <div className="min-h-screen bg-white selection:bg-indigo-100 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-48 md:pb-32 px-4 md:px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] md:w-full max-w-7xl h-[450px] md:h-[650px] bg-indigo-50/40 rounded-b-[3rem] md:rounded-b-[12rem] -z-10" />

        <div className="container mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-100 text-slate-900 mb-6 md:mb-10 shadow-sm animate-[fade-in-up_0.6s_ease-out]">
            <Fingerprint className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[8px] md:text-[9px] font-black tracking-[0.2em] uppercase">Architecture Élite</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-6 md:mb-10 tracking-tighter leading-[0.9] md:leading-[0.85] animate-[fade-in-up_0.8s_ease-out_0.2s_both]">
            DEVENIR <span className="gradient-text italic">L'ÉLITE</span>.
            <br />
            <span className="text-slate-900 block">MAÎTRISER L'AVENIR.</span>
          </h1>

          <p className="text-sm md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 md:mb-16 font-medium leading-relaxed px-2 animate-[fade-in-up_0.8s_ease-out_0.4s_both]">
            L'académie de micro-formation certifiante pour les <span className="text-slate-900 font-black">architectes du digital</span>. Une approche haute performance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4 mb-12 md:mb-20 animate-[fade-in-up_0.8s_ease-out_0.6s_both]">
            <Link to={user ? "/catalog" : "/auth"} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-14 md:h-20 px-8 md:px-12 text-base md:text-xl shadow-xl">
                LANCER LE CURSUS
                <ChevronRight className="w-5 h-5 ml-1 md:ml-2" />
              </Button>
            </Link>
            <Link to="/catalog" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 md:h-20 px-8 md:px-12 text-base md:text-xl">
                CATALOGUE
              </Button>
            </Link>
          </div>

          <div className="animate-[fade-in-up_1s_ease-out_0.8s_both]">
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* Stats Section with Animated Numbers */}
      <section className="py-12 md:py-24 border-y border-slate-50 px-4 reveal">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 max-w-5xl mx-auto">
            {[
              { label: "Apprenants", value: "2,000+" },
              { label: "Validation", value: "94.2%" },
              { label: "Certifiés", value: "500+" },
              { label: "Domaines", value: "12+" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-5xl font-black text-slate-900 mb-1 tracking-tighter">
                  <AnimatedNumber value={stat.value} />
                </p>
                <p className="text-[7px] md:text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-10 md:mb-20 reveal">
            <Badge className="mb-4">Démonstration</Badge>
            <h2 className="text-3xl md:text-6xl font-black tracking-tighter leading-tight">Une Immersion <span className="gradient-text italic">Sans Précédent</span></h2>
          </div>
          <div className="reveal">
            <FeatureShowcase />
          </div>
        </div>
      </section>

      {/* Advantages Grid */}
      <section className="py-20 md:py-32 px-4 md:px-6 bg-slate-50/40">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-24 gap-6 reveal">
            <div className="max-w-xl">
              <Badge className="mb-4">Méthode</Badge>
              <h2 className="text-3xl md:text-6xl font-black tracking-tighter">Pourquoi <span className="text-indigo-600">SkillFlash</span> ?</h2>
            </div>
            <p className="text-slate-500 text-sm md:text-lg max-w-xs font-medium leading-relaxed">
              Nous avons optimisé chaque seconde de votre apprentissage.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 reveal">
            {[
              { icon: Zap, title: "Micro-Learning", desc: "Modules de 15 minutes ultra-denses." },
              { icon: MousePointer2, title: "Pragmatique", desc: "Validation par la pratique immédiate." },
              { icon: ShieldCheck, title: "Certificats", desc: "Reconnaissance réelle par l'industrie." },
              { icon: Award, title: "Expertise", desc: "Diplômes vérifiables via protocole sécurisé." }
            ].map((item, i) => (
              <Card key={i} className="p-8 hover:-translate-y-1 transition-all duration-300 border-none shadow-sm flex flex-col items-center text-center group bg-white">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <item.icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg md:text-xl font-black mb-2 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-20 md:py-32 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 md:gap-32 items-center">
            <div className="lg:w-1/2 space-y-8 md:space-y-12 reveal">
              <div className="space-y-4">
                <Badge>Public</Badge>
                <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-none">POUR QUI ?</h2>
              </div>

              <div className="space-y-6 md:space-y-8">
                {[
                  { title: "Visionnaires", desc: "Étudiants en quête d'avantage compétitif.", color: "bg-blue-500" },
                  { title: "Bâtisseurs", desc: "Professionnels en transition stratégique.", color: "bg-purple-500" },
                  { title: "Maîtres", desc: "Experts exigeant une certification d'élite.", color: "bg-amber-500" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 md:gap-6 items-start group">
                    <div className={`mt-1.5 w-1 h-10 md:h-12 rounded-full ${item.color} group-hover:scale-y-110 transition-transform duration-300`} />
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-black mb-1">{item.title}</h3>
                      <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 w-full grid grid-cols-2 gap-3 md:gap-6 relative reveal">
              <div className="absolute inset-0 bg-indigo-50/50 blur-[100px] -z-10" />
              <div className="space-y-3 md:space-y-6 pt-6 md:pt-12">
                <Card className="h-36 md:h-48 flex flex-col items-center justify-center p-4 shadow-sm border-none bg-white/80">
                  <GraduationCap className="w-8 h-8 text-blue-500 mb-2 md:mb-3" />
                  <span className="text-[8px] font-black tracking-widest text-slate-400 uppercase">Études</span>
                </Card>
                <Card className="h-52 md:h-64 flex flex-col items-center justify-center p-4 shadow-sm border-none bg-white/80">
                  <Rocket className="w-8 h-8 text-purple-500 mb-2 md:mb-3" />
                  <span className="text-[8px] font-black tracking-widest text-slate-400 uppercase">Carrière</span>
                </Card>
              </div>
              <div className="space-y-3 md:space-y-6">
                <Card className="h-52 md:h-64 flex flex-col items-center justify-center p-4 shadow-sm border-none bg-white/80">
                  <Target className="w-8 h-8 text-amber-500 mb-2 md:mb-3" />
                  <span className="text-[8px] font-black tracking-widest text-slate-400 uppercase">Focus</span>
                </Card>
                <Card className="h-36 md:h-48 flex flex-col items-center justify-center p-4 shadow-sm border-none bg-white/80">
                  <Award className="w-8 h-8 text-emerald-500 mb-2 md:mb-3" />
                  <span className="text-[8px] font-black tracking-widest text-slate-400 uppercase">Succès</span>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-32 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="relative rounded-[2rem] md:rounded-[5rem] px-6 py-12 md:p-24 text-center overflow-hidden bg-slate-900 reveal">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.1),transparent)]" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-8 md:space-y-12">
              <div className="space-y-4">
                <Badge className="bg-white/5 text-slate-400 border-white/10 px-4">Certification 2026</Badge>
                <h2 className="text-3xl sm:text-5xl md:text-7xl font-black leading-tight tracking-tighter text-white">
                  LE FUTUR S'ÉCRIT <span className="gradient-text italic">MAINTENANT.</span>
                </h2>
              </div>

              <p className="text-sm md:text-xl text-slate-400 font-medium max-w-xl mx-auto leading-relaxed px-2">
                Accédez aux protocoles de formation des leaders de demain.
              </p>

              <div className="flex flex-col items-center gap-8 pt-2">
                <Link to={user ? "/catalog" : "/auth"} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-16 md:h-20 px-10 md:px-16 text-base md:text-xl rounded-full bg-white text-slate-900 hover:bg-slate-50 transition-colors shadow-2xl">
                    COMMENCER MAINTENANT
                  </Button>
                </Link>

                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[9px] font-black tracking-widest uppercase text-slate-500">Accès Libre</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[9px] font-black tracking-widest uppercase text-slate-500">Certifié</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 md:py-24 px-4 md:px-6 border-t border-slate-100 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-20 mb-16">
            <div className="md:col-span-2 space-y-6 md:space-y-8 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-white shadow-lg">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-lg font-black tracking-tighter uppercase">SkillFlash</span>
              </div>
              <p className="text-slate-500 text-sm md:text-lg leading-relaxed max-w-sm mx-auto md:mx-0 font-medium">
                Redéfinir les standards de l'excellence digitale par l'apprentissage haute performance.
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group hover:bg-indigo-50 hover:border-indigo-100 transition-all cursor-pointer">
                  <Users className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group hover:bg-indigo-50 hover:border-indigo-100 transition-all cursor-pointer">
                  <Search className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
            </div>

            <div className="space-y-5 text-center md:text-left">
              <h5 className="text-[9px] font-black tracking-widest uppercase text-slate-300">Navigation</h5>
              <ul className="space-y-3">
                <li><Link to="/catalog" className="text-sm font-bold hover:text-indigo-600 transition-colors">Cours</Link></li>
                <li><Link to="/leaderboard" className="text-sm font-bold hover:text-indigo-600 transition-colors">Elite Board</Link></li>
              </ul>
            </div>

            <div className="space-y-5 text-center md:text-left">
              <h5 className="text-[9px] font-black tracking-widest uppercase text-slate-300">Légalité</h5>
              <ul className="space-y-3">
                <li><Link to="#" className="text-sm font-bold hover:text-indigo-600 transition-colors">Privacy</Link></li>
                <li><Link to="#" className="text-sm font-bold hover:text-indigo-600 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-[8px] font-black tracking-[0.4em] uppercase text-slate-300 text-center md:text-left">
              © 2026 SkillFlash Academy • Est. 2025
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-[7px] py-0.5 px-2">SECURE</Badge>
              <Badge variant="outline" className="text-[7px] py-0.5 px-2">PRIVACY</Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;


