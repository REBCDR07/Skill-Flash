import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Zap, Mail, Lock, User, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().email('Email invalide');
const passwordSchema = z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères');
const nameSchema = z.string().min(2, 'Le nom est requis');

const Auth = () => {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (user) return null;

  const validateSignUp = () => {
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      nameSchema.parse(firstName);
      nameSchema.parse(lastName);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return false;
    }
  };

  const validateSignIn = () => {
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return false;
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignIn()) return;

    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Email ou mot de passe incorrect');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Heureux de vous revoir !');
      navigate('/dashboard');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUp()) return;

    setLoading(true);
    const fullName = `${firstName} ${lastName}`;
    const { error } = await signUp(email, password, fullName);
    setLoading(false);

    if (error) {
      if (error.message.includes('already registered')) {
        toast.error('Cet email est déjà utilisé');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Bienvenue dans l\'aventure !');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
      {/* Left Column: Brand & Value Prop */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary p-20 flex-col justify-between relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-foreground/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 text-white/90 hover:text-white transition-all group mb-20">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="text-3xl font-display font-black tracking-tighter">SkillFlash.</span>
          </Link>

          <div className="space-y-10 max-w-lg">
            <h2 className="text-6xl font-display font-black text-white leading-tight tracking-tighter">
              L'excellence à la vitesse <span className="text-white/60">de la pensée.</span>
            </h2>
            <p className="text-white/80 text-xl font-light leading-relaxed">
              Rejoignez une élite d'apprenants et transformez votre potentiel en expertise certifiée en un temps record.
            </p>

            <div className="space-y-6 pt-10">
              {[
                { icon: ShieldCheck, text: "Diplômes certifiés et vérifiables par QR Code" },
                { icon: Star, text: "Curriculum conçu par des experts de l'industrie" },
                { icon: Sparkles, text: "Expérience d'apprentissage immersive et interactive" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-white/90">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold tracking-tight">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 max-w-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-muted overflow-hidden">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <p className="text-white/60 text-xs font-bold uppercase tracking-widest">+12k Learners</p>
            </div>
            <p className="text-white font-medium italic">"La plateforme la plus efficace pour monter en compétence rapidement."</p>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Forms */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24 bg-background relative">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="mb-12 flex items-center justify-between lg:hidden">
            <Link to="/" className="flex items-center gap-2 text-primary">
              <Zap className="w-6 h-6 fill-primary" />
              <span className="font-display font-black text-xl tracking-tighter">SkillFlash.</span>
            </Link>
          </div>

          <div className="mb-12">
            <h1 className="text-4xl font-display font-black tracking-tight mb-2">Commencez ici.</h1>
            <p className="text-muted-foreground text-lg">Entrez dans la nouvelle ère de l'apprentissage.</p>
          </div>

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-[1.5rem] p-1.5 bg-muted/50 mb-10 h-14">
              <TabsTrigger value="signin" className="rounded-2xl font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-lg">Connexion</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-2xl font-bold transition-all data-[state=active]:bg-background data-[state=active]:shadow-lg">Inscription</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-0 animate-in fade-in duration-500">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="font-bold text-sm uppercase tracking-widest text-muted-foreground ml-1">VOTRE EMAIL</Label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="nom@domaine.com"
                      className="h-14 pl-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary transition-all text-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="font-bold text-sm uppercase tracking-widest text-muted-foreground ml-1">MOT DE PASSE</Label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      className="h-14 pl-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary transition-all text-base"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold gradient-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" disabled={loading}>
                  {loading ? 'Connexion en cours...' : 'Accéder au Dashboard'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-0 animate-in fade-in duration-500">
              <form onSubmit={handleSignUp} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstname" className="font-bold text-sm uppercase tracking-widest text-muted-foreground ml-1">PRÉNOM</Label>
                    <Input
                      id="firstname"
                      placeholder="Jean"
                      className="h-14 px-6 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary transition-all text-base"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastname" className="font-bold text-sm uppercase tracking-widest text-muted-foreground ml-1">NOM</Label>
                    <Input
                      id="lastname"
                      placeholder="Dupont"
                      className="h-14 px-6 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary transition-all text-base"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="font-bold text-sm uppercase tracking-widest text-muted-foreground ml-1">EMAIL PRO</Label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="vous@exemple.com"
                      className="h-14 pl-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary transition-all text-base"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="font-bold text-sm uppercase tracking-widest text-muted-foreground ml-1">CRÉEZ UN MOT DE PASSE</Label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="6 caractères minimum"
                      className="h-14 pl-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary transition-all text-base"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <p className="text-xs text-muted-foreground font-medium">En vous inscrivant, vous acceptez nos conditions d'utilisation.</p>
                </div>

                <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold gradient-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" disabled={loading}>
                  {loading ? 'Création de votre univers...' : 'Forger mon Destin'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-12 text-center">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-sm group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Retour à l'académie
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
