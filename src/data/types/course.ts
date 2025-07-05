import { ExpertProfile } from "./expert";
import { TrainingSession } from "./training";
import { Enrollment } from "./training";

export interface Course {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  thumbnail?: string;
  rating?: number;
  enrolledStudents?: number;
  status?: string;
  verified?: boolean;
  expertId?: string;
  createdAt?: string;
  updatedAt?: string;
  expert?: ExpertProfile; // relation to ExpertProfile.id
  modules?: Module[];
  trainingSessions?: TrainingSession[];
  Enrollment?: Enrollment[];
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  orderIndex: number;
  courseId?: string;
  createdAt?: string;
  updatedAt?: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: string; // could be enum: video, text, quiz, etc.
  content?: string;
  textContent?: string;
  videoUrl?: string;
  duration?: string;
  orderIndex: number;
  moduleId?: string;
  createdAt?: string;
  updatedAt?: string;
}
