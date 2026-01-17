import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { CourseProgress, QuizResult, Certification } from '@/types/course';

export function useCourseProgress(courseId?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['course-progress', user?.id, courseId],
    queryFn: async () => {
      if (!user) return null;
      
      let query = supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', user.id);
      
      if (courseId) {
        query = query.eq('course_id', courseId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return courseId ? (data?.[0] as CourseProgress | undefined) : (data as CourseProgress[]);
    },
    enabled: !!user
  });
}

export function useUpdateProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ courseId, currentChapter, completedChapters }: {
      courseId: string;
      currentChapter: number;
      completedChapters: number[];
    }) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('course_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          current_chapter: currentChapter,
          completed_chapters: completedChapters
        }, {
          onConflict: 'user_id,course_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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

      const { data, error } = await supabase
        .from('certifications')
        .insert({
          ...cert,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      // Add points for certification
      await supabase.rpc('add_points', { p_user_id: user.id, p_points: 100 });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    }
  });
}

export function useLeaderboard(limit = 10) {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, username, full_name, avatar_url, total_points')
        .order('total_points', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
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
    }
  });
}
