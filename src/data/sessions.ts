
import sessionsData from "./sessions.json";
import type { Session } from "./types/session";

export const upcomingSessionsData: Session[] = sessionsData.upcomingSessions as Session[];
export const completedSessionsData: Session[] = sessionsData.completedSessions as Session[];
