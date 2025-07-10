import { expertApi } from "@/lib/expert_api";
import { GetTrainingSessionsResponse, TrainingSession } from "@/data/types/training";

export const TrainingSessionAPI = {  
  getTrainingSessions: async (): Promise<TrainingSession[]> => 
    expertApi.get<GetTrainingSessionsResponse>("/training-sessions").then((res) => 
      res.data.data.map((session) => ({
        ...session,
        type: session.type === "webinar" ? "online" : "live",
        verified: true,
        location: session.location || null,
        meetingLink: session.meetingLink || null,
        courseId: session.courseId || null,
      }))
  ),
}