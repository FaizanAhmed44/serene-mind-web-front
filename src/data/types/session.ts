
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
