
export interface Session {
  id: number;
  expertName: string;
  date: string;
  type: string;
  duration: string;
}

export const upcomingSessionsData: Session[] = [
  {
    id: 1,
    expertName: "Mark Thompson",
    date: "Today, 4:30 PM",
    type: "Public Speaking Consultation",
    duration: "50 minutes"
  },
  {
    id: 2,
    expertName: "Dr. Emily Chen",
    date: "Friday, 10:00 AM",
    type: "Decision Making Session",
    duration: "50 minutes"
  }
];
