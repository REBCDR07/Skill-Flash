import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { GraduationCap, Trophy, BookOpen, Zap, Star, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-display font-bold">SkillFlash</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/catalog" className="text-muted-foreground hover:text-foreground transition-colors">
              Cours
            </Link>
            <Link to="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Classement
            </Link>
            {user ? (
              <Link to="/dashboard">
                <Button>Mon tableau de bord</Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button>Commencer</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground mb-6 animate-fade-in">
            <Star className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium">Plateforme de micro-formation gamifiée</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-fade-in">
            Apprenez. Progressez.
            <span className="gradient-text block">Certifiez-vous.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in">
            Maîtrisez HTML, CSS, JavaScript, Marketing et Communication avec des cours interactifs, 
            des QCM et obtenez des certifications vérifiables.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Link to={user ? "/catalog" : "/auth"}>
              <Button size="lg" className="gradient-primary text-white shadow-glow hover:shadow-glow-accent transition-all">
                Commencer gratuitement
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/catalog">
              <Button size="lg" variant="outline">
                Voir les cours
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Pourquoi choisir SkillFlash ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow animate-fade-in">
              <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Cours Structurés</h3>
              <p className="text-muted-foreground">
                5 cours complets avec chapitres progressifs, exemples pratiques et mini-activités.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow animate-fade-in">
              <div className="w-14 h-14 rounded-xl gradient-accent flex items-center justify-center mb-6">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Certifications</h3>
              <p className="text-muted-foreground">
                Obtenez des certificats vérifiables avec QR code en réussissant le test final (≥80%).
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow animate-fade-in">
              <div className="w-14 h-14 rounded-xl gradient-gold flex items-center justify-center mb-6">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Gamification</h3>
              <p className="text-muted-foreground">
                Gagnez des points, montez dans le classement et débloquez des badges de réussite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="gradient-hero rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Prêt à booster vos compétences ?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Rejoignez des milliers d'apprenants et commencez votre parcours dès aujourd'hui.
            </p>
            <Link to={user ? "/catalog" : "/auth"}>
              <Button size="lg" variant="secondary" className="shadow-lg">
                Commencer maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 SkillFlash. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
