import { expertApi } from "@/lib/expert_api";
import {
  GetTrainingSessionsResponse,
} from "../data/types/training";

export const trainingSessionAPI = {
  // fetch all training sessions
  getTrainingSessions: () =>
    expertApi
      .get<GetTrainingSessionsResponse>("training-sessions")
      .then((res) => res.data),

  // fetch a single training session by ID
  getTrainingSessionById: (id: string) =>
    expertApi.get<GetTrainingSessionsResponse>(`training-sessions/${id}`).then((res) => res.data),
};
