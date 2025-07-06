
export interface BookedSession {
  id: string;
  expertName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed';
  notes?: string;
}
