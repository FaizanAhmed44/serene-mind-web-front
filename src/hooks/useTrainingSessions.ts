
import { useQuery } from '@tanstack/react-query';
import { expertApi } from '@/lib/expert_api';
import type { GetTrainingSessionsResponse } from '@/data/types/trainingSession';

export const useTrainingSessions = () => {
  return useQuery({
    queryKey: ['training-sessions'],
    queryFn: async () => {
      const response = await expertApi.get<GetTrainingSessionsResponse>('/training-sessions');
      return response.data;
    },
  });
};
