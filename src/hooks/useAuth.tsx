// import React, { useState, useEffect, createContext, useContext } from "react";
// import axios from "@/lib/axios";
// import { AuthContextType, User } from "@/data/types/auth";

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       localStorage.removeItem("user"); // Clear stale user data
//       setUser(null);
//       setLoading(false);
//       return;
//     }

//     axios
//       .get("/profile")
//       .then((res) => {
//         const fetchedUser = res.data.user as User;
//         setUser(fetchedUser);
//         localStorage.setItem("user", JSON.stringify(fetchedUser));
//       })
//       .catch(() => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         setUser(null);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const signIn = async (email: string, password: string) => {
//     setLoading(true);
//     try {
//       const res = await axios.post("/auth/login", { email, password });
//       const { token, user } = res.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       setUser(user);
//       return { error: null };
//     } catch (error: any) {
//       return {
//         error: {
//           message: error.response?.data?.error || "Login failed. Try again.",
//         },
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
//     setLoading(true);
//     try {
//       const res = await axios.post("/auth/register", {
//         name: `${firstName} ${lastName}`,
//         email,
//         password,
//       });
//       const { token, user } = res.data;
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       setUser(user);
//       return { error: null };
//     } catch (error: any) {
//       return {
//         error: {
//           message: error.response?.data?.error || "Signup failed. Please try again.",
//         },
//       };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const signOut = async () => {    
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     setLoading(false);
//   };

//   return (
//     <AuthContext.Provider value={{ user, setUser, loading, signIn, signUp, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };


import React, { useState, useEffect, createContext, useContext } from "react";
import axios from "@/lib/axios";
import { AuthContextType, User } from "@/data/types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      localStorage.removeItem("user"); // Clear stale user data
      setUser(null);
      setLoading(false);
      return;
    }

    axios
      .get("/profile")
      .then((res) => {
        const fetchedUser = res.data.user as User;
        // Only set user if email is verified
        if (fetchedUser.email_verified) {
          setUser(fetchedUser);
          localStorage.setItem("user", JSON.stringify(fetchedUser));
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await axios.post("/auth/login", { email, password });
      const { token, user } = res.data;
      if (user.email_verified) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
      } else {
        return { error: { message: "Please verify your email first." } };
      }
      return { error: null };
    } catch (error: any) {
      return {
        error: {
          message: error.response?.data?.error || "Login failed. Try again.",
        },
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true);
    try {
      const res = await axios.post("/auth/register", {
        name: `${firstName} ${lastName}`,
        email,
        password,
      });
      // No token or user is set here; just return success
      return { error: null };
    } catch (error: any) {
      return {
        error: {
          message: error.response?.data?.error || "Signup failed. Please try again.",
        },
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, signIn, signUp, signOut }}>
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