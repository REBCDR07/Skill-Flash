import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourses } from '@/lib/courses';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Zap, Code, Palette, Braces, TrendingUp, MessageCircle, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { useCourseProgress, useCertifications } from '@/hooks/useProgress';
import { useAuth } from '@/hooks/useAuth';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code, Palette, Braces, TrendingUp, MessageCircle
};

const colorMap: Record<string, string> = {
  html: 'bg-html',
  css: 'bg-css',
  javascript: 'bg-javascript',
  marketing: 'bg-marketing',
  communication: 'bg-communication'
};

const Catalog = () => {
  const { user } = useAuth();
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
            <Link to="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Classement
            </Link>
            {user ? (
              <Link to="/dashboard">
                <Button>Tableau de bord</Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button>Connexion</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-28 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold mb-4">Catalogue des cours</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choisissez un cours et commencez votre apprentissage. Obtenez des certifications en réussissant les tests finaux.
          </p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            Développement Web
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {courses?.filter(c => c.category === 'development').map(course => {
              const Icon = iconMap[course.icon] || Code;
              const progress = getProgressForCourse(course.id);
              const certified = hasCertification(course.id);
              const progressPercent = progress 
                ? Math.round((progress.completed_chapters.length / course.chapters) * 100) 
                : 0;

              return (
                <Link to={`/course/${course.id}`} key={course.id}>
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden group">
                    {certified && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-success text-success-foreground">Certifié ✓</Badge>
                      </div>
                    )}
                    <div className={`h-2 ${colorMap[course.color]}`} />
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-xl ${colorMap[course.color]} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="font-display">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" /> {course.chapters} chapitres
                        </span>
                      </div>
                      <Badge variant="secondary">{course.difficulty}</Badge>
                      
                      {progress && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progression</span>
                            <span>{progressPercent}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full gradient-primary transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <Button variant="ghost" className="w-full mt-4 group-hover:text-primary">
                        {progress ? 'Continuer' : 'Commencer'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-marketing" />
            Business & Communication
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {courses?.filter(c => c.category === 'business').map(course => {
              const Icon = iconMap[course.icon] || TrendingUp;
              const progress = getProgressForCourse(course.id);
              const certified = hasCertification(course.id);
              const progressPercent = progress 
                ? Math.round((progress.completed_chapters.length / course.chapters) * 100) 
                : 0;

              return (
                <Link to={`/course/${course.id}`} key={course.id}>
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer relative overflow-hidden group">
                    {certified && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-success text-success-foreground">Certifié ✓</Badge>
                      </div>
                    )}
                    <div className={`h-2 ${colorMap[course.color]}`} />
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-xl ${colorMap[course.color]} flex items-center justify-center mb-4`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="font-display">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" /> {course.chapters} chapitres
                        </span>
                      </div>
                      <Badge variant="secondary">{course.difficulty}</Badge>
                      
                      {progress && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progression</span>
                            <span>{progressPercent}%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full gradient-primary transition-all duration-500"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <Button variant="ghost" className="w-full mt-4 group-hover:text-primary">
                        {progress ? 'Continuer' : 'Commencer'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Catalog;
