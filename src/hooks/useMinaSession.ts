// src/hooks/useMinaSession.ts  (or add to your existing file)

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuth } from '@/hooks/useAuth';

interface EndMinaSessionResponse {
  success: boolean;
  message: string;
  remainingSessions: number;
}

export const useDecrementMinaSession = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuth();

  return useMutation({
    mutationFn: async (): Promise<EndMinaSessionResponse> => {
      const res = await api.post('/mina-session/end', {
        userId: user.id,
      });
      return res.data; // { success, message, remainingSessions }
    },

    onSuccess: (data) => {
      const newCount = data.remainingSessions;

      // 1. Update local auth state
      const updatedUser = {
        ...user,
        minaSessionCount: newCount,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // 2. Update React Query cache instantly (no refetch)
      queryClient.setQueryData(['userProfile'], (old: any) => ({
        ...old,
        minaSessionCount: newCount,
      }));
    },

    onError: (error: any) => {
      console.error('Failed to decrement minaSessionCount:', error);
      // Optional: show toast
      // toast.error('Could not start session. Try again.');
    },
  });
};