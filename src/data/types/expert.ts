export interface ExpertProfile {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  bio?: string;
  title?: string;
  experience?: string;
  specializations: string[];
  credentials: string[];
  rating?: number;
  totalCourses?: number;
  totalStudents?: number;
  joinedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  verified?: boolean;
}

export interface AvailabilitySlot {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
  expertId?: string;
}

export interface SessionType {
  id: string;
  expertId: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: string;
  currency: string;
  isActive: boolean;
  maxParticipants: number;
  sessionFormat: string;
  requirements: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
    id: string;
    expertId: string;
    sessionTypeId: string;
    userId: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    notes: string;
}

export interface BlockedDate {
  id: string;
  date: string;
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
  expertId?: string;
}


