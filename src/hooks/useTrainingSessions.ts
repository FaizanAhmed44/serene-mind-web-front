import { useQuery } from "@tanstack/react-query";
import { TrainingSessionAPI } from "@/api/trainingsession";
import { useToast } from "@/hooks/use-toast";

export const useTrainingSessions = () => {
  const { toast } = useToast();

  // Query: Fetch all training sessions
  const {
    data: trainingSessionsResponse,
    isLoading: loadingTrainingSessions,
    isError: trainingSessionsError,
    refetch: refetchTrainingSessions,
  } = useQuery({
    queryKey: ["training-sessions"],
    queryFn: TrainingSessionAPI.getTrainingSessions,
  });

  // Query: Fetch training session by ID (disabled by default)
  const {
    data: trainingSessionByIdResponse,
    isLoading: loadingTrainingSessionById,
    refetch: refetchTrainingSessionById,
  } = useQuery({
    queryKey: ["training-sessionById"],
    queryFn: () => null, // placeholder
    enabled: false, // only enable with ID
  });

  // Optional: dynamic fetch function if you want to dynamically query by id
  // const fetchTrainingSessionById = (id: string) =>
  //   useQuery({
  //     queryKey: ["training-sessionById", id],
  //     queryFn: () => trainingSessionAPI.getTrainingSessionById(id),
  //   });

  return {
    trainingSessions: trainingSessionsResponse,
    loadingTrainingSessions,
    trainingSessionsError,
    refetchTrainingSessions,
    trainingSessionById: trainingSessionByIdResponse?.data || null,
    loadingTrainingSessionById,
    refetchTrainingSessionById,
  };
};
