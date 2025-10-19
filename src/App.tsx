import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Experts from "./pages/Experts";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import ExpertProfile from "./pages/ExpertProfile";
import SessionDetails from "./pages/SessionDetails";
import CourseDetail from "./pages/CourseDetail";
import CourseEnroll from "./pages/CourseEnroll";
import CourseSuccess from "./pages/CourseSuccess";
import UserProfile from "./pages/UserProfile";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import TrainingSessions from "./pages/TrainingSessions";
import BookedSessions from "./pages/BookedSessions";
import LandingPage from "./pages/landing";
import Courses from "./pages/Courses";
import EnrolledCourses from "./pages/EnrolledCourses";
import AIMinaCoach from "./pages/AIMinaCoach";
import ProfileSettings from "./components/ProfileSettings";
import PaymentHistory from "./components/PaymentHistory";
import { ASSESSMENT_ROUTES } from "./routes/routes";
import QuizPage from "./pages/assesment";
import { QuizDetail } from "./components/assesment/quizDetail";
import TalkToMina from "./pages/TalkToMina";

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <FavoritesProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Authentication routes without sidebar */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/" element={<Login />} />

                {/* Quiz detail route without sidebar */}
                <Route path={ASSESSMENT_ROUTES.ASSESSMENT_DETAILS} element={<QuizDetail />} />

                {/* Protected routes with sidebar */}
                <Route
                  path="/*"
                  element={
                    // <ProtectedRoute>
                    <SidebarProvider>
                      <div className="min-h-screen flex w-full">
                        <AppSidebar />
                        <main className="flex-1 overflow-hidden">
                          <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/courses" element={<Courses />} />
                            <Route path="/enrolled-courses" element={<EnrolledCourses />} />
                            <Route path="/experts" element={<Experts />} />
                            <Route path="/experts/:id" element={<ExpertProfile />} />
                            <Route path="/session/:id" element={<SessionDetails />} />
                            <Route path="/booked-sessions" element={<BookedSessions />} />
                            <Route path="/training-sessions" element={<TrainingSessions />} />
                            <Route path="/favorites" element={<Favorites />} />
                            <Route path="/profile" element={<UserProfile />} />
                            <Route path="/faq" element={<FAQ />} />
                            <Route path="/courses/:id" element={<CourseDetail />} />
                            <Route path="/courses/:id/enroll" element={<CourseEnroll />} />
                            <Route path="/courses/:id/success" element={<CourseSuccess />} />
                            <Route path="/ai-mina-coach" element={<AIMinaCoach />} />
                            <Route path="//talk-to-mina" element={<TalkToMina />} />
                            <Route path="/payment-history" element={<PaymentHistory />} />
                            <Route path="/settings" element={<ProfileSettings />} />
                            <Route path={ASSESSMENT_ROUTES.ASSESSMENT} element={<QuizPage />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </main>
                      </div>
                    </SidebarProvider>
                    // </ProtectedRoute>
                  }
                />
              </Routes>
            </BrowserRouter>
          </FavoritesProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
