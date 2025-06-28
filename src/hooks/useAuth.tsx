import React, {
  useState,
  useEffect,
  createContext,
  useContext,
} from "react";
import axios from "@/lib/axios";
import { AuthContextType, User } from "@/data/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get("/profile")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post("/auth/login", { email, password });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      setUser(user);

      return { error: null };
    } catch (error: any) {
      return {
        error: {
          message:
            error.response?.data?.error || "Login failed. Try again.",
        },
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Placeholder: You can implement registration in next steps
  const signUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    setLoading(true);
    try {
      const res = await axios.post("/auth/register", {
        name: `${firstName} ${lastName}`,
        email,
        password,
      });
  
      return { error: null }; // success
    } catch (error: any) {
      return {
        error: {
          message:
            error.response?.data?.error ||
            "Signup failed. Please try again.",
        },
      };
    } finally {
      setLoading(false);
    }
  };
  
  // const signUp = async (
  //   email: string,
  //   password: string,
  //   firstName: string,
  //   lastName: string
  // ) => {
  //   return { error: { message: "Not implemented" } };
  // };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};


// import { useState, useEffect, createContext, useContext } from 'react';
// import { User as SupabaseUser, Session } from '@supabase/supabase-js';
// import { supabase } from '@/integrations/supabase/client';
// import { AuthContextType, User } from '@/data/types/auth';

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [session, setSession] = useState<Session | null>(null);
//   const [loading, setLoading] = useState(true);

//   const transformUser = (supabaseUser: SupabaseUser | null): User | null => {
//     if (!supabaseUser) return null;
    
//     return {
//       id: supabaseUser.id,
//       email: supabaseUser.email || '',
//       name: supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name,
//       avatar: supabaseUser.user_metadata?.avatar_url,
//     };
//   };

//   useEffect(() => {
//     // Set up auth state listener
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       (event, session) => {
//         setSession(session);
//         setUser(transformUser(session?.user ?? null));
//         setLoading(false);
//       }
//     );

//     // Check for existing session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//       setUser(transformUser(session?.user ?? null));
//       setLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const signIn = async (email: string, password: string) => {
//     setLoading(true);
//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });
//     setLoading(false);
//     return { error };
//   };

//   const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
//     setLoading(true);
//     const redirectUrl = `${window.location.origin}/`;
    
//     const { error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         emailRedirectTo: redirectUrl,
//         data: {
//           name: `${firstName} ${lastName}`,
//           first_name: firstName,
//           last_name: lastName,
//         }
//       }
//     });
//     setLoading(false);
//     return { error };
//   };

//   const signOut = async () => {
//     setLoading(true);
//     await supabase.auth.signOut();
//     setLoading(false);
//   };

//   const value = {
//     user,
//     session,
//     loading,
//     signIn,
//     signUp,
//     signOut,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
