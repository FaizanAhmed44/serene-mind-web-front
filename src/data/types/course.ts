
export interface Course {
  id: string; // Changed from number to string
  title: string;
  description: string;
  longDescription: string;
  duration: string;
  modules: number;
  category: string;
  instructor: {
    name: string;
    title: string;
    bio: string;
    photo: string;
  };
  rating: number;
  students: number;
  progress?: number;
  price: string;
  originalPrice?: number;
  language: string;
  level: string;
  certificate: boolean;
  image: string;
  outcomes: string[];
  modules_detail: {
    week: number;
    title: string;
    lessons: string[];
    duration: string;
  }[];
  reviews: {
    name: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}
