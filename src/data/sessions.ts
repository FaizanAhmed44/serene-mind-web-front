
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

export const upcomingSessionsData: Session[] = [
  {
    id: 1,
    expertName: "Mark Thompson",
    date: "Today, 4:30 PM",
    type: "Public Speaking Consultation",
    duration: "50 minutes",
    status: 'upcoming',
    canReview: false,
    hasReviewed: false
  },
  {
    id: 2,
    expertName: "Dr. Emily Chen",
    date: "Friday, 10:00 AM",
    type: "Decision Making Session",
    duration: "50 minutes",
    status: 'upcoming',
    canReview: false,
    hasReviewed: false
  }
];

export const completedSessionsData: Session[] = [
  {
    id: 3,
    expertName: "Dr. Sarah Johnson",
    date: "Yesterday, 2:00 PM",
    type: "Anxiety Management Session",
    duration: "50 minutes",
    status: 'completed',
    canReview: true,
    hasReviewed: false
  },
  {
    id: 4,
    expertName: "Mark Thompson",
    date: "Last Week",
    type: "Confidence Building",
    duration: "45 minutes",
    status: 'completed',
    canReview: true,
    hasReviewed: true
  }
];
