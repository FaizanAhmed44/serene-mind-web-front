
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@/data/types/session';

export const useSessions = () => {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match the Session type
      return data.map((session: any): Session => ({
        id: session.id,
        expertName: session.expert_name,
        date: session.session_date,
        type: session.session_type,
        duration: session.duration,
        status: session.status,
        canReview: session.can_review,
        hasReviewed: session.has_reviewed
      }));
    },
  });
};

export const useUpcomingSessions = () => {
  return useQuery({
    queryKey: ['sessions', 'upcoming'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('status', 'upcoming')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return data.map((session: any): Session => ({
        id: session.id,
        expertName: session.expert_name,
        date: session.session_date,
        type: session.session_type,
        duration: session.duration,
        status: session.status,
        canReview: session.can_review,
        hasReviewed: session.has_reviewed
      }));
    },
  });
};

export const useCompletedSessions = () => {
  return useQuery({
    queryKey: ['sessions', 'completed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data.map((session: any): Session => ({
        id: session.id,
        expertName: session.expert_name,
        date: session.session_date,
        type: session.session_type,
        duration: session.duration,
        status: session.status,
        canReview: session.can_review,
        hasReviewed: session.has_reviewed
      }));
    },
  });
};
