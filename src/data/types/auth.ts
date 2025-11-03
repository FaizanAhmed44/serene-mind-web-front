
// export interface User {
//   id: string;
//   email: string;
//   name?: string;
//   avatar?: string;
//   phone?: string;
//   location?: string;
//   bio?: string;
// }

// export interface AuthContextType {
//   user: User | null;
//   session: any;
//   loading: boolean;
//   signIn: (email: string, password: string) => Promise<{ error: any }>;
//   signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any }>;
//   signOut: () => Promise<void>;
// }

// export interface SignUpFormData {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
// }
export type User = {
  id: string;
  name: string;
  email: string;
  bio?: string | null;
  phone?: string | null;
  location?: string | null;
  avatar?: string | null;
  email_verified: boolean;
  minaSessionCount: number;
  created_at: string;
  updated_at: string;
};

export type SignUpFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: null | { message: string } }>;
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<{ error: null | { message: string } }>;
  signOut: () => void;
};
