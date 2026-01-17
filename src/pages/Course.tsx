import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

const Course = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <Zap className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-display font-bold mb-4">Page de cours en construction</h1>
        <p className="text-muted-foreground mb-6">Cette page sera disponible prochainement.</p>
        <Link to="/catalog">
          <Button>Retour au catalogue</Button>
        </Link>
      </div>
    </div>
  );
};

export default Course;
