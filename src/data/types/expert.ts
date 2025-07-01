
export interface SessionType {
  type: string;
  duration: string;
  price: string;
  session_id?: string;
}

export interface AvailabilitySlot {
  date: string;
  times: string[];
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  rating: number;
  reviews: number;
  experience: string;
  verified: boolean;
  nextAvailable: string;
  photo: string;
  bio: string;
  sessionTypes: SessionType[];
  availability: AvailabilitySlot[];
  credentials?: string[];
}


// export interface Expert {
//   id: string;
//   name: string;
//   title: string | null;
//   bio: string | null;
//   avatar: string | null;
//   credentials: string[];
//   specializations: string[];
//   rating: number | null;
//   totalCourses: number | null;
//   totalStudents: number | null; 
//   experience: string | null;

//   // Fake fields for now (until added in backend)
//   reviews?: number;
//   nextAvailable?: string;
//   photo?: string;
//   sessionTypes?: SessionType[];
//   availability?: AvailabilitySlot[];
// }
