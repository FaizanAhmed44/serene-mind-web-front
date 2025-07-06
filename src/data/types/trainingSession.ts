
export interface TrainingSession {
  id: string;
  title: string;
  description: string;
  type: "live" | "online";
  date: string;
  time: string;
  duration: string;
  location: string | null;
  meetingLink: string | null;
  maxParticipants: number;
  currentParticipants: number;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  expertId: string;
  courseId: string | null;
  createdAt: string;
  updatedAt: string;
  verified: boolean;
}

export interface GetTrainingSessionsResponse {
  success: boolean;
  data: TrainingSession[];
  count: number;
}
