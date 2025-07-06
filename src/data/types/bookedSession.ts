
export interface BookedSession {
  id: string;
  expertName: string;
  avatar?: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed';
  notes?: string;
}
