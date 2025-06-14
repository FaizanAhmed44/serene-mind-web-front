
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import Index from "./pages/Index";
import Experts from "./pages/Experts";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import ExpertProfile from "./pages/ExpertProfile";
import SessionDetails from "./pages/SessionDetails";
import CourseDetail from "./pages/CourseDetail";
import CourseEnroll from "./pages/CourseEnroll";
import UserProfile from "./pages/UserProfile";
import FAQ from "./pages/FAQ";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FavoritesProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Authentication routes without sidebar */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Main app routes with sidebar */}
            <Route path="/*" element={
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 overflow-hidden">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/experts" element={<Experts />} />
                      <Route path="/experts/:id" element={<ExpertProfile />} />
                      <Route path="/session/:id" element={<SessionDetails />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/profile" element={<UserProfile />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/courses/:id" element={<CourseDetail />} />
                      <Route path="/courses/:id/enroll" element={<CourseEnroll />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </SidebarProvider>
            } />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
