import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { CourseProgress, QuizResult, Certification, UserProfile } from '@/types/course';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Hook for real-time sync
export function useRealtimeSync() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const channels = [
      supabase.channel('course_progress_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'course_progress', filter: `user_id=eq.${user.id}` },
          () => queryClient.invalidateQueries({ queryKey: ['course-progress'] }))
        .subscribe(),
      supabase.channel('profile_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `user_id=eq.${user.id}` },
          () => queryClient.invalidateQueries({ queryKey: ['profile'] }))
        .subscribe()
    ];

    return () => {
      channels.forEach(ch => supabase.removeChannel(ch));
    };
  }, [user, queryClient]);
}

export function useCourseProgress(courseId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['course-progress', user?.id, courseId],
    queryFn: async () => {
      if (!user) return null;

      if (courseId) {
        const { data, error } = await supabase
          .from('course_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .maybeSingle();
        if (error) {
          console.error('Error fetching course progress for courseId:', courseId, error);
          throw error;
        }
        return (data as unknown as CourseProgress) || null;
      }

      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id);
      if (error) {
        console.error('Error fetching all course progress:', error);
        throw error;
      }
      return (data as unknown as CourseProgress[]) || [];
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

      const { data, error } = await supabase
        .from('course_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          current_chapter: currentChapter,
          completed_chapters: completedChapters,
          completed_at: completedAt,
          started_at: new Date().toISOString()
        }, { onConflict: 'user_id, course_id' })
        .select()
        .single();

      if (error) throw error;
      return data as CourseProgress;
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

      let query = supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', user.id);

      if (courseId) {
        query = query.eq('course_id', courseId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as QuizResult[];
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

      const { data, error } = await supabase
        .from('quiz_results')
        .insert({
          ...result,
          user_id: user.id,
          completed_at: new Date().toISOString(),
          answers: result.answers as Record<string, unknown>
        })
        .select()
        .single();

      if (error) throw error;
      return data as QuizResult;
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

      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      return data as Certification[];
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

      // 1. Create certification
      const { data, error: certError } = await supabase
        .from('certifications')
        .insert({
          ...cert,
          user_id: user.id,
          issued_at: new Date().toISOString()
        })
        .select()
        .single();

      if (certError) throw certError;

      // 2. Add points to profile
      const { error: pointError } = await supabase.rpc('add_points', {
        p_user_id: user.id,
        p_points: 100
      });

      if (pointError) console.error('Error adding points:', pointError);

      return data as Certification;
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

      // Try stateless decode first
      try {
        const decoded = atob(code);
        const data = JSON.parse(decoded);
        if (data && data.course_title && data.final_score) {
          return {
            ...data,
            issued_at: data.issued_at || new Date().toISOString(),
            profiles: {
              full_name: data.userName || 'Étudiant Certifié',
              username: data.userName || 'anonyme'
            }
          };
        }
      } catch (e) {
        // Fallback to DB lookup if stateless decode fails
      }

      // Lookup in DB
      const { data, error } = await supabase
        .from('certifications')
        .select('*, profiles(full_name, username)')
        .eq('verification_code', code)
        .maybeSingle();

      if (error) {
        console.error('Error verifying certificate:', code, error);
        throw error;
      }
      return data as unknown;
    },
    enabled: !!code
  });
}

export function useLeaderboard(limit = 10) {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: async () => {
      console.log('useLeaderboard: Fetching starting...');
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('total_points', { ascending: false })
          .limit(limit);

        if (error) {
          console.error('useLeaderboard: Supabase error:', error);
          throw error;
        }

        if (data && data.length > 0) {
          console.log('useLeaderboard: Fetched', data.length, 'items from Supabase');
          return data as UserProfile[];
        }

        console.warn('useLeaderboard: No data in Supabase. Falling back to mock data.');
      } catch (err) {
        console.warn('useLeaderboard: Fetch failed. Falling back to mock data.', err);
      }

      // Mock Data Fallback
      return [
        { user_id: 'mock-1', username: 'Alexandre', total_points: 1250, full_name: 'Alexandre D.', avatar_url: null, bio: null, location: null, website: null, created_at: new Date().toISOString() },
        { user_id: 'mock-2', username: 'Sophie', total_points: 1100, full_name: 'Sophie L.', avatar_url: null, bio: null, location: null, website: null, created_at: new Date().toISOString() },
        { user_id: 'mock-3', username: 'Thomas', total_points: 950, full_name: 'Thomas M.', avatar_url: null, bio: null, location: null, website: null, created_at: new Date().toISOString() },
        { user_id: 'mock-4', username: 'Léa', total_points: 800, full_name: 'Léa R.', avatar_url: null, bio: null, location: null, website: null, created_at: new Date().toISOString() },
        { user_id: 'mock-5', username: 'Nicolas', total_points: 750, full_name: 'Nicolas V.', avatar_url: null, bio: null, location: null, website: null, created_at: new Date().toISOString() }
      ] as UserProfile[];
    }
  });
}

export function useAddPoints() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (points: number) => {
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.rpc('add_points', {
        p_user_id: user.id,
        p_points: points
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    }
  });
}

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data as UserProfile;
    },
    enabled: !!user
  });
}

export function usePublicPortfolio(username: string) {
  return useQuery({
    queryKey: ['public-portfolio', username],
    queryFn: async () => {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError) throw profileError;

      const { data: certifications, error: certError } = await supabase
        .from('certifications')
        .select('*')
        .eq('user_id', profile.user_id);

      if (certError) throw certError;

      // Mock radar data
      const categories = ['Développement', 'Business', 'Marketing', 'Soft Skills', 'Design'];
      const radarData = categories.map(cat => ({
        subject: cat,
        value: Math.floor(Math.random() * 40) + 60,
        fullMark: 100
      }));

      return {
        profile: profile as UserProfile,
        certifications: certifications as Certification[],
        radarData
      };
    },
  });
}

export function useAllQuizProgress() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['all-quiz-progress', user?.id],
    queryFn: async () => {
      if (!user) return {};
      const { data, error } = await supabase
        .from('user_quiz_progress')
        .select('course_id, progress')
        .eq('user_id', user.id);

      if (error) return {};
      return data.reduce((acc, curr) => {
        acc[curr.course_id] = curr.progress;
        return acc;
      }, {} as Record<string, unknown>);
    },
    enabled: !!user
  });
}

export function useQuizProgress(courseId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const progressQuery = useQuery({
    queryKey: ['quiz-progress', user?.id, courseId],
    queryFn: async () => {
      if (!user || !courseId) return null;
      const { data, error } = await supabase
        .from('user_quiz_progress')
        .select('progress')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (error) return null;
      return data?.progress;
    },
    enabled: !!user && !!courseId
  });

  const saveProgress = useMutation({
    mutationFn: async ({ courseId: cid, progress }: { courseId: string, progress: unknown }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_quiz_progress')
        .upsert({
          user_id: user.id,
          course_id: cid,
          progress: {
            ...progress,
            updatedAt: new Date().toISOString()
          }
        })
        .select()
        .single();

      if (error) throw error;
      return data.progress;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quiz-progress', user?.id, variables.courseId] });
      queryClient.invalidateQueries({ queryKey: ['all-quiz-progress', user?.id] });
    }
  });

  const clearProgress = useMutation({
    mutationFn: async (cid: string) => {
      if (!user) return;
      await supabase
        .from('user_quiz_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('course_id', cid);
    },
    onSuccess: (_, cid) => {
      queryClient.invalidateQueries({ queryKey: ['quiz-progress', user?.id, cid] });
      queryClient.invalidateQueries({ queryKey: ['all-quiz-progress', user?.id] });
    }
  });

  return {
    progress: progressQuery.data,
    isLoading: progressQuery.isLoading,
    saveProgress,
    clearProgress
  };
}
