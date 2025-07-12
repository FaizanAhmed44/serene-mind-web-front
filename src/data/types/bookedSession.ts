
// export interface BookedSession {
//   id: string;
//   expertName: string;
//   avatar?: string;
//   date: string;
//   time: string;
//   status: 'upcoming' | 'completed';
//   notes?: string;
// }
export interface Session {
  id: string;
  sessionDate: string; // e.g., "2025-07-23T00:00:00.000Z"
  startTime: string; // e.g., "09:00"
  endTime: string; // e.g., "10:30"
  status: string; // e.g., "PENDING"
  notes: string;
  paymentStatus: string; // e.g., "PENDING"
  sessionType: {
    id: string;
    name: string; // e.g., "EMDR Therapy Session"
    price: string; // e.g., "250"
    expert: {
      id: string;
      name: string; // e.g., "Emily Rodriguez"
      avatar: string; // URL
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
  date: string; // Formatted, e.g., "July 23, 2025"
  time: string; // e.g., "09:00"
  status: 'upcoming' | 'completed';
  notes?: string;
}