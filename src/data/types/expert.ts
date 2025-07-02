import { Course } from "./course";
import { TrainingSession } from "./training";
import { SessionType } from "./training";
import { Booking } from "./training";

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
  courses?: Course[];
  trainingSessions?: TrainingSession[];
  sessionTypes?: SessionType[];
  bookings?: Booking[];
  availabilitySlots?: AvailabilitySlot[];
  blockedDates?: BlockedDate[];
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

export interface BlockedDate {
  id: string;
  date: string;
  reason?: string;
  createdAt?: string;
  updatedAt?: string;
  expertId?: string;
}
   

