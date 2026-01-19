import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  GraduationCap,
  Trophy,
  BookOpen,
  Zap,
  Star,
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
  Target,
  Users,
  Award,
  Rocket,
  ShieldCheck,
  MousePointer2,
  Calendar,
  Sparkles,
  Search,
  Check,
  ChevronRight,
  Shield,
  Fingerprint
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { DashboardPreview } from '@/components/landing/DashboardPreview';
import { FeatureShowcase } from '@/components/landing/FeatureShowcase';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const Index = () => {
  const { user } = useAuth();

  const roadmapItems = [
    { date: "T1 2026", title: "Certification IA Avancée", status: "Terminé", icon: Sparkles },
    { date: "T2 2026", title: "App Mobile (iOS/Android)", status: "En cours", icon: Rocket },
    { date: "T3 2026", title: "Projets Collaboratifs", status: "À venir", icon: Users },
    { date: "T4 2026", title: "Mentorat Personnalisé", status: "À venir", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/20 font-sans">
      <Navbar />

      {/* Hero Section - Ultra Pro Redesign */}
      <section className="relative pt-40 pb-32 px-4 overflow-hidden">
        {/* Deep Field Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-card/40 backdrop-blur-md border border-border/50 text-foreground mb-12 animate-in fade-in slide-in-from-top-4 duration-700 hover:border-primary/30 transition-all cursor-default shadow-xl">
            <Fingerprint className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Architecture d'Apprentissage Haute Performance</span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-black mb-10 tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            DEVENIR <span className="gradient-text italic">L'ÉLITE</span>.
            <br />
            <span className="text-foreground -mt-4 block">MAÎTRISER L'AVENIR.</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16 font-light leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
            La première académie de micro-formation certifiante conçue pour les <span className="text-foreground font-bold">architectes du digital</span>. Apprenez vite, validez fort, brillez partout.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-400">
            <Link to={user ? "/catalog" : "/auth"}>
              <Button size="lg" className="h-20 px-12 text-xl font-black rounded-3xl gradient-primary text-white shadow-3xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                LANCER MON CURSUS
                <ChevronRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
            <Link to="/catalog">
              <Button size="lg" variant="outline" className="h-20 px-12 text-xl font-black rounded-3xl border-2 background-blur-md hover:bg-muted/50 transition-all">
                EXPLORER LE CATALOGUE
              </Button>
            </Link>
          </div>

          {/* Integration of FeatureShowcase as detailed demonstration */}
          <div className="mt-40">
            <div className="mb-12">
              <Badge variant="outline" className="mb-4 border-primary/20 text-primary font-black px-4 py-1.5 rounded-full tracking-widest text-[10px] uppercase">DÉTAILS DE L'EXPÉRIENCE</Badge>
              <h2 className="text-4xl md:text-6xl font-display font-black tracking-tight">Une Immersion <span className="gradient-text">Sans Précédent</span></h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto mt-4">Plus qu'une simple lecture, une plateforme conçue pour l'action immédiate.</p>
            </div>
            <FeatureShowcase />
          </div>
        </div>
      </section>

      {/* Authority Stats Section */}
      <section className="py-24 border-y border-border/50 bg-muted/20 backdrop-blur-sm px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
            {[
              { label: "Apprenants d'Élite", value: "2,000+" },
              { label: "Validation de Cursus", value: "94.2%" },
              { label: "ID Certifiés Uniques", value: "500+" },
              { label: "Domaines d'Expertise", value: "12+" },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <p className="text-4xl md:text-6xl font-black font-display text-foreground mb-2 group-hover:scale-110 group-hover:text-primary transition-all duration-500 tracking-tighter">{stat.value}</p>
                <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground uppercase">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why SkillFlash Section - Premium Clean Redesign */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <Badge className="mb-4 bg-primary/10 text-primary border-none font-black text-[10px] px-6 py-1.5 tracking-widest uppercase">L'AVANTAGE ACADÉMIQUE</Badge>
              <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter">Pourquoi SkillFlash <br />est <span className="gradient-text italic">Différent</span> ?</h2>
            </div>
            <p className="text-muted-foreground text-xl max-w-xs font-light leading-relaxed mb-2">
              Nous avons supprimé tout le superflu pour ne garder que ce qui crée de la valeur.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                icon: Zap,
                title: "Micro-Learning",
                desc: "Des formats denses de 15 min. L'essentiel, sans fioritures, prêt à être appliqué."
              },
              {
                icon: MousePointer2,
                title: "100% Pragmatique",
                desc: "Apprendre par l'action. Chaque concept est immédiatement suivi d'un test pratique."
              },
              {
                icon: ShieldCheck,
                title: "Titre de Valeur",
                desc: "Nos certifications prouvent la maîtrise réelle, pas seulement la lecture passive."
              },
              {
                icon: Award,
                title: "Expertise Certifiée",
                desc: "Obtenez un diplôme officiel, vérifiable par QR Code et reconnu sur le marché."
              }
            ].map((item, i) => (
              <div key={i} className="group p-10 rounded-[3rem] bg-card/60 backdrop-blur-xl border border-border/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:gradient-primary group-hover:text-white group-hover:shadow-glow transition-all duration-500">
                  <item.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-display font-black mb-4">{item.title}</h3>
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Who Section - Modernized Grid */}
      <section className="py-32 px-4 bg-muted/10">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <div className="lg:w-1/2 space-y-12">
              <div className="space-y-4">
                <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] px-6 py-1.5 tracking-widest uppercase">AUDIENCE CIBLE</Badge>
                <h2 className="text-4xl md:text-7xl font-display font-black tracking-tighter leading-none">À QUI S'ADRESSE <br /><span className="text-primary italic underline decoration-primary/20 underline-offset-8">CE CENTRE ?</span></h2>
              </div>

              <div className="space-y-10">
                {[
                  {
                    title: "Les Visionnaires",
                    desc: "Étudiants cherchant l'avantage concurrentiel immédiat dès la sortie d'école.",
                    color: "bg-blue-500"
                  },
                  {
                    title: "Les Bâtisseurs",
                    desc: "Professionnels en transition souhaitant reconstruire leur socle de compétences.",
                    color: "bg-purple-500"
                  },
                  {
                    title: "Les Maîtres",
                    desc: "Experts désirant une preuve irréfutable de leurs connaissances pointues.",
                    color: "bg-orange-500"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className={`mt-2 w-3 h-12 rounded-full ${item.color} group-hover:scale-y-125 transition-transform duration-500`} />
                    <div className="space-y-2">
                      <h3 className="text-2xl font-display font-black">{item.title}</h3>
                      <p className="text-muted-foreground text-lg font-medium leading-normal">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 w-full grid grid-cols-2 gap-8 relative">
              <div className="absolute inset-0 bg-primary/20 blur-[150px] -z-10" />
              <div className="space-y-8 pt-16">
                <div className="h-56 rounded-[3rem] bg-card/60 backdrop-blur-xl border border-blue-500/20 flex flex-col items-center justify-center p-8 group hover:scale-105 transition-transform duration-500">
                  <GraduationCap className="w-16 h-16 text-blue-500 mb-4 group-hover:animate-bounce" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-blue-500">ACADÉMIQUE</span>
                </div>
                <div className="h-80 rounded-[3rem] bg-card/60 backdrop-blur-xl border border-purple-500/20 flex flex-col items-center justify-center p-8 group hover:scale-105 transition-transform duration-500">
                  <Rocket className="w-16 h-16 text-purple-500 mb-4 group-hover:animate-pulse" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-purple-500">CARRIÈRE</span>
                </div>
              </div>
              <div className="space-y-8">
                <div className="h-80 rounded-[3rem] bg-card/60 backdrop-blur-xl border border-orange-500/20 flex flex-col items-center justify-center p-8 group hover:scale-105 transition-transform duration-500">
                  <Target className="w-16 h-16 text-orange-500 mb-4 group-hover:scale-125 transition-transform" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-orange-500">OBJECTIFS</span>
                </div>
                <div className="h-56 rounded-[3rem] bg-card/60 backdrop-blur-xl border border-green-500/20 flex flex-col items-center justify-center p-8 group hover:scale-105 transition-transform duration-500">
                  <Award className="w-16 h-16 text-green-500 mb-4 group-hover:animate-pulse" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-green-500">TITRES</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Ultra Dynamic Design */}
      <section className="py-40 px-4 relative">
        <div className="container mx-auto">
          <div className="relative rounded-[4rem] p-16 md:p-32 text-center overflow-hidden border border-primary/20 shadow-3xl">
            {/* Multi-layered background */}
            <div className="absolute inset-0 gradient-hero opacity-100" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay" />

            <div className="relative z-10 max-w-4xl mx-auto text-white space-y-12">
              <div className="space-y-6">
                <Badge className="bg-white/10 text-white border-white/20 font-black text-[10px] px-8 py-2 tracking-widest uppercase">ÉDITION 2026</Badge>
                <h2 className="text-5xl md:text-8xl font-display font-black leading-none tracking-tighter">
                  LE FUTUR <br />S'ÉCRIT <span className="italic opacity-80 decoration-white/30 underline underline-offset-8">MAINTENANT.</span>
                </h2>
              </div>

              <p className="text-xl md:text-3xl opacity-90 font-light max-w-2xl mx-auto leading-relaxed italic">
                Rejoignez le cercle fermé des apprenants d'élite et dominez votre secteur.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-4">
                <Link to={user ? "/catalog" : "/auth"}>
                  <Button size="lg" className="h-24 px-16 text-2xl font-black rounded-full bg-white text-primary shadow-2xl hover:scale-105 active:scale-95 transition-all">
                    COMMENCER GRATUITEMENT
                  </Button>
                </Link>
                <div className="flex flex-col items-start gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/30 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-black tracking-widest uppercase">ZÉRO ENGAGEMENT</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/30 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-black tracking-widest uppercase">CERTIFICATS ILLIMITÉS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Authority Styled */}
      <footer className="py-24 px-4 border-t border-border bg-background relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-4 gap-20 mb-20">
            <div className="md:col-span-2 space-y-10">
              <Link to="/" className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <span className="text-3xl font-display font-black tracking-tighter uppercase">SkillFlash</span>
              </Link>
              <p className="text-muted-foreground text-xl leading-relaxed max-w-md font-light italic">
                L'écosystème de formation qui redéfinit les standards de l'excellence digitale. <br />Apprenez. Validez. Dominez.
              </p>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer">
                  <Users className="w-5 h-5" />
                </div>
                <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer">
                  <Search className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h5 className="text-[10px] font-black tracking-[0.4em] uppercase text-foreground/50">Explorer</h5>
              <ul className="space-y-4">
                <li><Link to="/catalog" className="text-lg font-black hover:text-primary transition-colors">Catalogues</Link></li>
                <li><Link to="/leaderboard" className="text-lg font-black hover:text-primary transition-colors">Elite Board</Link></li>
                <li><Link to="/auth" className="text-lg font-black hover:text-primary transition-colors">Cercle Privé</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h5 className="text-[10px] font-black tracking-[0.4em] uppercase text-foreground/50">Légalité</h5>
              <ul className="space-y-4">
                <li><Link to="#" className="text-lg font-black hover:text-primary transition-colors">Protocole de Confidentialité</Link></li>
                <li><Link to="#" className="text-lg font-black hover:text-primary transition-colors">Conditions d'Accès</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-20 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="text-[10px] font-black tracking-[0.5em] uppercase text-muted-foreground opacity-60">
              © 2026 SkillFlash International Academy &bull; Est. 2025
            </div>
            <div className="flex items-center gap-6">
              <Badge variant="outline" className="opacity-40 font-black text-[8px]">SSL SECURE DATA</Badge>
              <Badge variant="outline" className="opacity-40 font-black text-[8px]">SUPABASE ARCHITECTURE</Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
