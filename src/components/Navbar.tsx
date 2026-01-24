import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, Menu, BookOpen } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-glow">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-display font-bold tracking-tight">SkillFlash</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/catalog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Catalogue de Cours
                    </Link>
                    <Link to="/catalog">
                        <Button className="font-semibold shadow-lg shadow-primary/20 rounded-xl">Commencer l'apprentissage</Button>
                    </Link>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <div className="flex flex-col gap-8 mt-8">
                                <div className="flex flex-col gap-4">
                                    <h3 className="text-lg font-semibold text-foreground/80">Menu Principal</h3>
                                    <Link
                                        to="/catalog"
                                        onClick={() => setIsOpen(false)}
                                        className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <BookOpen className="w-5 h-5" />
                                        Catalogue de Cours
                                    </Link>
                                    <Link to="/catalog" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full mt-4 shadow-lg shadow-primary/20 rounded-xl">Commencer</Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
