import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Zap, LogOut, User as UserIcon, Menu, BookOpen, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navbar = () => {
    const { user, signOut } = useAuth();
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
                    <div className="flex items-center gap-6">
                        <Link to="/catalog" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Cours
                        </Link>
                        <Link to="/leaderboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                            Classement
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        {user ? (
                            <>
                                <Link to="/dashboard" className="flex items-center gap-2">
                                    <Avatar className="w-8 h-8 border border-primary/20 hover:scale-110 transition-transform">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                                        <AvatarFallback className="bg-primary/10 text-[10px]">
                                            <UserIcon className="w-4 h-4 text-primary" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button variant="ghost" className="hidden sm:inline-flex font-semibold px-2">Mon Espace</Button>
                                </Link>
                                <Button variant="ghost" size="icon" onClick={() => signOut()} className="text-muted-foreground hover:text-destructive">
                                    <LogOut className="w-5 h-5" />
                                </Button>
                            </>
                        ) : (
                            <Link to="/auth">
                                <Button className="font-semibold shadow-lg shadow-primary/20">Commencer</Button>
                            </Link>
                        )}
                    </div>
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
                                    <h3 className="text-lg font-semibold text-foreground/80">Menu</h3>
                                    <Link
                                        to="/catalog"
                                        onClick={() => setIsOpen(false)}
                                        className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <BookOpen className="w-5 h-5" />
                                        Cours
                                    </Link>
                                    <Link
                                        to="/leaderboard"
                                        onClick={() => setIsOpen(false)}
                                        className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                                    >
                                        <Trophy className="w-5 h-5" />
                                        Classement
                                    </Link>
                                </div>

                                <div className="border-t border-border/50 pt-8">
                                    {user ? (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Avatar className="w-10 h-10 border border-primary/20">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                                                    <AvatarFallback className="bg-primary/10 text-xs">
                                                        <UserIcon className="w-5 h-5 text-primary" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{user.user_metadata.full_name}</span>
                                                    <span className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</span>
                                                </div>
                                            </div>

                                            <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                                                <Button className="w-full justify-start" variant="outline">
                                                    <UserIcon className="w-4 h-4 mr-2" />
                                                    Mon Espace
                                                </Button>
                                            </Link>

                                            <Button
                                                variant="ghost"
                                                onClick={() => {
                                                    signOut();
                                                    setIsOpen(false);
                                                }}
                                                className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Se déconnecter
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            <Link to="/auth" onClick={() => setIsOpen(false)}>
                                                <Button className="w-full shadow-lg shadow-primary/20">Commencer</Button>
                                            </Link>
                                        </div>
                                    )}
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
