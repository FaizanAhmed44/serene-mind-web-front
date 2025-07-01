export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
  expertId?: string;
  courseId?: string;
  bookings?: Booking[];
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
