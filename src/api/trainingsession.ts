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
  registerSession: async (sessionId: string, data: { userId: string; email: string; name: string }) => 
    expertApi.post(`/training-sessions/${sessionId}/register`, data)
      .then((res) => res.data.data),

  // Cancel registration for a training session
  cancelRegistration: async (sessionId: string, data: { userId: string }) => 
    expertApi.put(`/training-sessions/${sessionId}/cancel-registration`, data)
      .then((res) => res.data.data),

  // Get details of a training session
  getSession: async (sessionId: string) => 
    expertApi.get(`/training-sessions/${sessionId}`)
      .then((res) => res.data.data),

  // Get training session materials
  getMaterials: async (sessionId: string) => 
    expertApi.get(`/training-sessions/${sessionId}/materials`)
      .then((res) => res.data.data),
}