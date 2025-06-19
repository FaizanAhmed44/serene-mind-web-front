
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
}
