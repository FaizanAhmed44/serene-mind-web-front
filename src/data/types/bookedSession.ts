export interface Session {
  id: string;
  sessionDate: string; 
  startTime: string;
  endTime: string; 
  status: string; 
  notes: string;
  paymentStatus: string; 
  sessionType: {
    id: string;
    name: string;
    price: string;
    expert: {
      id: string;
      name: string;
      avatar: string; 
      email: string;
    };
  };
}

export interface BookedSession {
  id: string;
  expertName: string;
  sessionName: string;
  paymentStatus:String;
  sessionPrice: string;
  avatar?: string;
  date: string; 
  time: string; 
  status: 'upcoming' | 'completed';
  notes?: string;
}