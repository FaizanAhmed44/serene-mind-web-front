export interface TrainingSession {
  id: string;
  title: string;
  description: string;
  type: "live" | "online";           // can be extended to an enum if you wish
  date: string;                     // e.g. "2024-07-15"
  time: string;                     // e.g. "14:00"
  duration: string;                 // e.g. "1 hour"
  location: string | null;
  meetingLink: string | null;
  maxParticipants: number;
  currentParticipants: number;
  status: "scheduled" | "ongoing" | "completed" | "cancelled"; // best to use enum
  expertId: string;
  courseId: string | null;
  createdAt: string;
  updatedAt: string;
  verified: boolean;
}


export interface SessionType {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
  expertId?: string;
}

export interface Booking {
  id: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  expertId?: string;
  trainingSessionId?: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt?: string;
  progress?: number;
  completed?: boolean;
}

export interface GetTrainingSessionsResponse {
  success: boolean;
  data: TrainingSession[];
  count: number;
}

