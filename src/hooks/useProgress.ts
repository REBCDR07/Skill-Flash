import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { CourseProgress, QuizResult, Certification, UserProfile } from '@/types/course';
import { useEffect } from 'react';

const STORAGE_KEYS = {
  PROGRESS: 'sf_progress',
  RESULTS: 'sf_results',
  CERTS: 'sf_certs'
};

// Hook for real-time sync (now null action as it's local)
export function useRealtimeSync() {
  // No-op for localStorage version
  useEffect(() => { }, []);
}

export function useCourseProgress(courseId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['course-progress', user?.id, courseId],
    queryFn: async () => {
      if (!user) return null;

      try {
        const allProgress = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || '[]');
        const userProgress = Array.isArray(allProgress) ? allProgress.filter((p: CourseProgress) => p.user_id === user.id) : [];

        if (courseId) {
          const singleProgress = userProgress.find((p: CourseProgress) => p.course_id === courseId);
          return singleProgress || null;
        }

        return userProgress;
      } catch (e) {
        console.error('Error loading progress:', e);
        return courseId ? null : [];
      }
    },
    enabled: !!user
  });
}

export function useUpdateProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, currentChapter, completedChapters, completedAt }: {
      courseId: string;
      currentChapter: number;
      completedChapters: number[];
      completedAt?: string | null;
    }) => {
      if (!user) throw new Error('Not authenticated');

      const allProgress = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || '[]');
      const index = allProgress.findIndex((p: CourseProgress) => p.user_id === user.id && p.course_id === courseId);

      const updatedProgress: CourseProgress = {
        id: index !== -1 ? allProgress[index].id : Math.random().toString(36).substr(2, 9),
        user_id: user.id,
        course_id: courseId,
        current_chapter: currentChapter,
        completed_chapters: completedChapters,
        started_at: index !== -1 ? allProgress[index].started_at : new Date().toISOString(),
        completed_at: completedAt || (index !== -1 ? allProgress[index].completed_at : null)
      };

      if (index !== -1) {
        allProgress[index] = updatedProgress;
      } else {
        allProgress.push(updatedProgress);
      }

      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
      return updatedProgress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-progress'] });
    }
  });
}

export function useQuizResults(courseId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['quiz-results', user?.id, courseId],
    queryFn: async () => {
      if (!user) return [];

      try {
        const allResults = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || '[]');
        const userResults = Array.isArray(allResults) ? allResults.filter((r: QuizResult) => r.user_id === user.id) : [];

        if (courseId) {
          return userResults.filter((r: QuizResult) => r.course_id === courseId);
        }

        return userResults;
      } catch (e) {
        console.error('Error loading quiz results:', e);
        return [];
      }
    },
    enabled: !!user
  });
}

export function useSubmitQuiz() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (result: Omit<QuizResult, 'id' | 'user_id' | 'completed_at'>) => {
      if (!user) throw new Error('Not authenticated');

      const allResults = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || '[]');
      const newResult: QuizResult = {
        ...result,
        id: Math.random().toString(36).substr(2, 9),
        user_id: user.id,
        completed_at: new Date().toISOString()
      };

      allResults.push(newResult);
      localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(allResults));
      return newResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-results'] });
    }
  });
}

export function useCertifications() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['certifications', user?.id],
    queryFn: async () => {
      if (!user) return [];

      try {
        const allCerts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CERTS) || '[]');
        return Array.isArray(allCerts) ? allCerts.filter((c: Certification) => c.user_id === user.id) : [];
      } catch (e) {
        console.error('Error loading certifications:', e);
        return [];
      }
    },
    enabled: !!user
  });
}

export function useCreateCertification() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cert: Omit<Certification, 'id' | 'user_id' | 'issued_at'>) => {
      if (!user) throw new Error('Not authenticated');

      const allCerts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CERTS) || '[]');
      const newCert: Certification = {
        ...cert,
        id: Math.random().toString(36).substr(2, 9),
        user_id: user.id,
        issued_at: new Date().toISOString()
      };

      allCerts.push(newCert);
      localStorage.setItem(STORAGE_KEYS.CERTS, JSON.stringify(allCerts));

      // Add points locally
      const profiles = JSON.parse(localStorage.getItem('sf_profiles') || '[]');
      const pIndex = profiles.findIndex((p: UserProfile) => p.user_id === user.id);
      if (pIndex !== -1) {
        profiles[pIndex].total_points += 100;
        profiles[pIndex].updated_at = new Date().toISOString();
        localStorage.setItem('sf_profiles', JSON.stringify(profiles));
      }

      return newCert;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });
}

export function useVerifyCertificate(code?: string) {
  return useQuery({
    queryKey: ['verify-certificate', code],
    queryFn: async () => {
      if (!code) return null;

      const allCerts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CERTS) || '[]');
      const cert = allCerts.find((c: Certification) => c.verification_code === code);

      if (!cert) return null;

      const profiles = JSON.parse(localStorage.getItem('sf_profiles') || '[]');
      const profile = profiles.find((p: UserProfile) => p.user_id === cert.user_id);

      return {
        ...cert,
        profiles: {
          full_name: profile?.full_name || 'Étudiant',
          username: profile?.username || 'anonyme'
        }
      };
    },
    enabled: !!code
  });
}

export function useLeaderboard(limit = 10) {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: async () => {
      try {
        const profiles = JSON.parse(localStorage.getItem('sf_profiles') || '[]');
        if (!Array.isArray(profiles)) return [];
        return (profiles as UserProfile[])
          .sort((a: UserProfile, b: UserProfile) => b.total_points - a.total_points)
          .slice(0, limit);
      } catch (e) {
        console.error('Error loading leaderboard:', e);
        return [];
      }
    }
  });
}

export function useAddPoints() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (points: number) => {
      if (!user) throw new Error('Not authenticated');

      const profiles = JSON.parse(localStorage.getItem('sf_profiles') || '[]');
      const pIndex = profiles.findIndex((p: UserProfile) => p.user_id === user.id);
      if (pIndex !== -1) {
        profiles[pIndex].total_points += points;
        profiles[pIndex].updated_at = new Date().toISOString();
        localStorage.setItem('sf_profiles', JSON.stringify(profiles));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });
}

export function usePublicPortfolio(username: string) {
  return useQuery({
    queryKey: ['public-portfolio', username],
    queryFn: async () => {
      const profiles = JSON.parse(localStorage.getItem('sf_profiles') || '[]');
      const profile = profiles.find((p: UserProfile) => p.username === username);

      if (!profile) throw new Error('Profil non trouvé');

      const allCerts = JSON.parse(localStorage.getItem(STORAGE_KEYS.CERTS) || '[]');
      const certifications = allCerts.filter((c: Certification) => c.user_id === profile.user_id);

      // Mocked radar data as before
      const categories = ['Développement', 'Business', 'Marketing', 'Soft Skills', 'Design'];
      const radarData = categories.map(cat => ({
        subject: cat,
        value: Math.floor(Math.random() * 40) + 60,
        fullMark: 100
      }));

      return {
        profile,
        certifications,
        radarData
      };
    },
    enabled: !!username
  });
}
