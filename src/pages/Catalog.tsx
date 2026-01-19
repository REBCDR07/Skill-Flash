import * as React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourses } from '@/lib/courses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Zap,
  Code,
  Palette,
  Braces,
  TrendingUp,
  MessageCircle,
  Clock,
  BookOpen,
  ArrowRight,
  Search,
  CheckCircle2,
  Lock,
  Star,
  Layers,
  Sparkles
} from 'lucide-react';
import { useCourseProgress, useCertifications } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { Progress } from '@/components/ui/progress';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code, Palette, Braces, TrendingUp, MessageCircle
};

const colorMap: Record<string, string> = {
  html: 'text-orange-500 bg-orange-500/10',
  css: 'text-blue-500 bg-blue-500/10',
  javascript: 'text-yellow-500 bg-yellow-500/10',
  marketing: 'text-purple-500 bg-purple-500/10',
  communication: 'text-green-500 bg-green-500/10'
};

const gradientMap: Record<string, string> = {
  html: 'from-orange-500/20 to-orange-600/5',
  css: 'from-blue-500/20 to-blue-600/5',
  javascript: 'from-yellow-500/20 to-yellow-600/5',
  marketing: 'from-purple-500/20 to-purple-600/5',
  communication: 'from-green-500/20 to-green-600/5'
};

const Catalog = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<'all' | 'development' | 'business'>('all');

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses
  });
  const { data: allProgress } = useCourseProgress();
  const { data: certifications } = useCertifications();

  const getProgressForCourse = (courseId: string) => {
    if (!Array.isArray(allProgress)) return null;
    return allProgress.find(p => p.course_id === courseId);
  };

  const hasCertification = (courseId: string) => {
    return certifications?.some(c => c.course_id === courseId);
  };

  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background/95">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-primary border-r-2 shadow-glow"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground font-display font-bold tracking-widest text-sm uppercase">Synchronisation du catalogue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/95 selection:bg-primary/20">
      <Navbar />

      <main className="container mx-auto px-4 pt-36 pb-24">
        {/* Authority Header */}
        <div className="max-w-5xl mx-auto text-center mb-20 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
            <Layers className="w-4 h-4" />
            <span className="text-[10px] font-black tracking-widest uppercase">Centre d'Excellence Numérique</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-black mb-8 tracking-tighter animate-in fade-in slide-in-from-bottom-4 duration-700">
            Bibliothèque d'<span className="gradient-text">Élite</span>
          </h1>

          <p className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Découvrez des parcours conçus pour transformer votre <span className="text-foreground font-bold">potentiel</span> en <span className="text-primary font-bold">expertise</span>.
          </p>

          {/* Ultra-Pro Search & Filter */}
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4 bg-card/40 backdrop-blur-2xl p-3 rounded-[2.5rem] border border-border/50 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="relative flex-grow group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Rechercher une expertise..."
                className="pl-14 h-14 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-lg placeholder:text-muted-foreground/50 tracking-tight"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 p-1 bg-muted/30 rounded-[2.2rem]">
              {(['all', 'development', 'business'] as const).map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? 'default' : 'ghost'}
                  size="sm"
                  className={`rounded-[1.8rem] capitalize h-12 px-8 font-bold transition-all ${activeCategory === cat
                      ? 'gradient-primary shadow-lg shadow-primary/20 scale-105'
                      : 'hover:bg-muted/50'
                    }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat === 'all' ? 'Tous' : cat === 'development' ? 'Dev' : 'Business'}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Premium Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCourses?.map((course, idx) => {
            const Icon = iconMap[course.icon] || Code;
            const progress = getProgressForCourse(course.id);
            const certified = hasCertification(course.id);
            const progressPercent = progress
              ? Math.round((progress.completed_chapters.length / course.chapters) * 100)
              : 0;

            return (
              <Link to={`/course/${course.id}`} key={course.id} className="group">
                <Card className={`h-full border-none rounded-[3rem] bg-card/60 backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:shadow-3xl relative overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-12 duration-700`} style={{ animationDelay: `${idx * 100}ms` }}>

                  {/* Decorative Background Gradient */}
                  <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full bg-gradient-to-br ${gradientMap[course.color]} opacity-0 group-hover:opacity-40 blur-3xl transition-opacity duration-700`} />

                  <CardHeader className="p-10 pb-6 relative z-10">
                    <div className="flex justify-between items-start mb-10">
                      <div className={`w-20 h-20 rounded-[2rem] bg-background/80 shadow-inner flex items-center justify-center border border-border/50 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 overflow-hidden`}>
                        <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${gradientMap[course.color]}`} />
                        <Icon className="w-10 h-10 relative z-10" />
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        {certified && (
                          <Badge className="bg-success text-white border-none px-4 py-1.5 rounded-full flex items-center gap-2 font-black text-[10px] tracking-widest shadow-lg shadow-success/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> CERTIFIÉ
                          </Badge>
                        )}
                        <Badge variant="outline" className="border-border/50 bg-background/50 backdrop-blur-md px-4 py-1.5 rounded-full font-black text-[10px] tracking-widest uppercase">
                          {course.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <CardTitle className="text-3xl font-display font-black tracking-tight group-hover:text-primary transition-colors leading-tight mb-4">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground/80 font-medium line-clamp-3">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="px-10 pb-10 flex-grow flex flex-col justify-end relative z-10">
                    {/* Activity or Info Section */}
                    {progress ? (
                      <div className="mb-8 space-y-4 bg-background/30 p-6 rounded-[2rem] border border-border/30">
                        <div className="flex justify-between items-end">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">Ma Progression</p>
                            <p className="text-xl font-black">{progressPercent}%</p>
                          </div>
                          <Zap className="w-5 h-5 text-primary animate-pulse" />
                        </div>
                        <Progress value={progressPercent} className="h-2.5 bg-muted/40" />
                      </div>
                    ) : (
                      <div className="mb-8 flex items-center justify-between border-y border-border/30 py-6 px-4">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Clock className="w-5 h-5" />
                          <span className="text-xs font-black uppercase tracking-widest">{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <BookOpen className="w-5 h-5" />
                          <span className="text-xs font-black uppercase tracking-widest">{course.chapters} MODULES</span>
                        </div>
                      </div>
                    )}

                    <Button className="w-full h-16 rounded-[1.8rem] font-black text-lg gap-3 transition-all duration-500 overflow-hidden group-hover:gradient-primary group-hover:text-white shadow-xl shadow-primary/5 hover:shadow-primary/20">
                      <span className="relative z-10">{progress ? 'REPRENDRE LE CURSUS' : 'COMMENCER L\'EXPÉRIENCE'}</span>
                      <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Empty State Redesign */}
        {filteredCourses?.length === 0 && (
          <div className="text-center py-24 bg-card/40 backdrop-blur-xl rounded-[4rem] border border-dashed border-border/50 animate-in fade-in zoom-in duration-700">
            <div className="max-w-md mx-auto space-y-8">
              <div className="w-24 h-24 bg-muted/50 rounded-[2.5rem] flex items-center justify-center mx-auto border border-border/50">
                <Search className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-display font-black tracking-tight">Aucun résultat</h3>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed px-10">
                  Notre académie ne semble pas encore avoir de cursus correspondant à cette requête. Essayez d'autres mots-clés.
                </p>
              </div>
              <Button
                variant="outline"
                className="h-14 px-10 rounded-[1.5rem] font-black border-2 hover:bg-muted/50 transition-all"
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              >
                RÉINITIALISER LES FILTRES
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Catalog;
