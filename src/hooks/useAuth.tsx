import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserProfile } from '@/types/course';
import { toast } from 'sonner';

// Mock User type to replace Supabase User
interface LocalUser {
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
  };
}

interface AuthContextType {
  user: LocalUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'sf_users',
  SESSION: 'sf_session',
  PROFILES: 'sf_profiles'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (savedSession && savedSession !== 'undefined') {
        const sessionData = JSON.parse(savedSession);
        if (sessionData && sessionData.user) {
          setUser(sessionData.user);

          const savedProfiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
          const userProfile = savedProfiles.find((p: UserProfile) => p.user_id === sessionData.user.id);
          if (userProfile) {
            setProfile(userProfile);
          }
        }
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const savedProfiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
      const userProfile = savedProfiles.find((p: UserProfile) => p.user_id === user.id);
      if (userProfile) {
        setProfile(userProfile);
      }
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');

      if (users.find((u: { email: string }) => u.email === email)) {
        throw new Error('Cet email est déjà utilisé.');
      }

      const newUserId = Math.random().toString(36).substr(2, 9);
      const newUser = { id: newUserId, email, password, full_name: fullName };

      users.push(newUser);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

      // Create Profile
      const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
      const newProfile: UserProfile = {
        id: newUserId,
        user_id: newUserId,
        username: email.split('@')[0],
        full_name: fullName,
        avatar_url: null,
        total_points: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      profiles.push(newProfile);
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));

      // Auto login
      const localUser: LocalUser = {
        id: newUserId,
        email,
        user_metadata: { full_name: fullName }
      };

      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ user: localUser }));
      setUser(localUser);
      setProfile(newProfile);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
      const foundUser = users.find((u: { email: string; password: string; id: string; full_name: string }) => u.email === email && u.password === password);

      if (!foundUser) {
        throw new Error('Email ou mot de passe incorrect.');
      }

      const localUser: LocalUser = {
        id: foundUser.id,
        email: foundUser.email,
        user_metadata: { full_name: foundUser.full_name }
      };

      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify({ user: localUser }));
      setUser(localUser);

      const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '[]');
      const userProfile = profiles.find((p: UserProfile) => p.user_id === foundUser.id);
      setProfile(userProfile || null);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
