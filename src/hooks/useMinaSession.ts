// src/hooks/useMinaSession.ts  (or add to your existing file)

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuth } from '@/hooks/useAuth';


// ---------- Types ----------
interface EndMinaSessionResponse {
  success: boolean;
  message: string;
  remainingSessions: number;
}

interface CreateSessionDetailPayload {
  sessionId: string;
  sessionMode: string;
  sessionReportJson: string;
}

interface SessionDetail {
  id: string;
  sessionId: string;
  sessionMode: string;
  sessionReportJson: string;
  createdAt: string;
}

interface CreateSessionDetailResponse {
  success: boolean;
  message: string;
  session: SessionDetail;
}

interface GetSessionDetailsResponse {
  success: boolean;
  count: number;
  sessions: SessionDetail[];
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


// ---------- 2. Create Session Detail ----------
export const useCreateSessionDetail = () => {
  return useMutation({
    mutationFn: async (payload: CreateSessionDetailPayload): Promise<CreateSessionDetailResponse> => {
      const res = await api.post('/session-details/add', payload);
      return res.data;
    },

    onSuccess: (data) => {
      console.log('✅ Session created successfully:', data.session);
      // Optionally refetch sessions list
      // queryClient.invalidateQueries(['sessionDetails']);
    },

    onError: (error: any) => {
      console.error('❌ Failed to create session detail:', error);
    },
  });
};

// ---------- 3. Get All User Sessions ----------
export const useGetSessionDetails = () => {
  const { user } = useAuth();

  return useQuery<GetSessionDetailsResponse>({
    queryKey: ['sessionDetails', user.id],
    queryFn: async () => {
      const res = await api.get('/session-details/get');
      return res.data;
    },
    enabled: !!user?.id, // only fetch when user exists
  });
};
