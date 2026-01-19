import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Zap, LogOut, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
    const { user, signOut } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-glow">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-display font-bold tracking-tight">SkillFlash</span>
                </Link>
                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-6">
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
            </div>
        </nav>
    );
};

export default Navbar;
