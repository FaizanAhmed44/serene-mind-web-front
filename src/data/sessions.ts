
import sessionsData from "./sessions.json";

export interface Session {
  id: number;
  expertName: string;
  date: string;
  type: string;
  duration: string;
  status: 'upcoming' | 'completed';
  canReview: boolean;
  hasReviewed: boolean;
}

export const upcomingSessionsData: Session[] = sessionsData.upcomingSessions;
export const completedSessionsData: Session[] = sessionsData.completedSessions;
