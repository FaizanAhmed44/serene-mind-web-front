import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, User, BookOpen, Star, TrendingUp, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import ReviewDialog from "@/components/ReviewDialog";
import { BookingSessionsAPI } from '@/api/bookingSessions';

interface Session {
  id: number;
  sessionType: {
    expert: {
      name: string;
      avatar?: string;
    };
    name: string;
    price: number;
  };
  sessionDate: string;
  paymentStatus: string;
  startTime: string;
  status: "PENDING" | "COMPLETED";
  notes?: string;
}

interface BookedSession {
  id: number;
  expertName: string;
  avatar?: string;
  date: string;
  paymentStatus: string;
  sessionName: string;
  sessionPrice: number;
  time: string;
  status: "upcoming" | "completed";
  notes?: string;
  type: string;
  duration: string;
  canReview: boolean;
  hasReviewed: boolean;
}

const statsColors =
 [
  {
    gradient: "from-primary/10 via-primary/5 to-transparent",
    iconBg: "bg-primary/10",
    textColor: "text-primary",
  },
  {
    gradient: "from-amber-50 via-amber-25 to-transparent",
    iconBg: "bg-amber-100",
    textColor: "text-amber-700",
  },
  {
    gradient: "from-green-50 via-green-25 to-transparent",
    iconBg: "bg-green-100",
    textColor: "text-green-700",
  },
  {
    gradient: "from-blue-50 via-blue-25 to-transparent",
    iconBg: "bg-blue-100",
    textColor: "text-blue-700",
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: dashboardStats = [], isLoading: statsLoading } = useDashboardStats();

  const { data: apiSessions = [], isLoading, error } = useQuery<Session[]>({
    queryKey: ["bookedSessions", user?.id],
    queryFn: () => BookingSessionsAPI.getBooking(user?.id || ""),
    enabled: !!user?.id,
  });

  // Map API sessions to BookedSession format
  const sessions: BookedSession[] = apiSessions.map((session) => ({
    id: session.id,
    expertName: session.sessionType.expert.name,
    avatar: session.sessionType.expert.avatar,
    date: new Date(session.sessionDate).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    paymentStatus: session.paymentStatus,
    sessionName: session.sessionType.name,
    sessionPrice: session.sessionType.price,
    time: session.startTime,
    status: session.status === "PENDING" ? "upcoming" : "completed",
    notes: session.notes,
    type: session.sessionType.name, // Map sessionName to type
    duration: "1 hr", // Hardcoded; adjust if API provides duration
    canReview: session.status === "COMPLETED" && session.paymentStatus === "PAID",
    hasReviewed: false, // Initialize as false; updated via handleReviewSubmitted
  }));

  const upcomingSessions = sessions.filter((session) => session.status === "upcoming");
  const completedSessions = sessions.filter((session) => session.status === "completed");
  const [completedSessionsState, setCompletedSessionsState] = useState(completedSessions);

  // Update state when completedSessions changes
  useState(() => {
    setCompletedSessionsState(completedSessions);
  });

  const handleReviewSubmitted = (sessionId: number) => {
    setCompletedSessionsState((prev) =>
      prev.map((session) =>
        session.id === sessionId ? { ...session, hasReviewed: true } : session
      )
    );
  };

  function formatTo12Hour(time) {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(hour, minute);
    return date.toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  }

  const defaultStats = 
  [
    {
      title: "Total Sessions",
      value: upcomingSessions.length + completedSessions.length,
      icon: Calendar,
      change: `+${upcomingSessions.length + completedSessions.length} this month`,
    },
    {
      title: "Hours of Therapy",
      value: "24.5",
      icon: Clock,
      change: "+4.2 hours",
    },
    {
      title: "Progress Score",
      value: "85%",
      icon: TrendingUp,
      change: "+12% improvement",
    },
    {
      title: "Completed Goals",
      value: "7/10",
      icon: CheckCircle,
      change: "3 remaining",
    },
  ];

  const stats = dashboardStats.length > 8 ? dashboardStats : defaultStats;

  if (isLoading || statsLoading) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.div
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
        >
          <div className="flex items-center justify-between p-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <SidebarTrigger />
            </motion.div>
            <motion.h1
              className="text-xl font-semibold text-foreground"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
            >
              Dashboard
            </motion.h1>
            <div className="w-10" />
          </div>
        </motion.div>
        <motion.div
          className="p-6 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
        >
          <div className="text-lg text-muted-foreground">
            Loading Dashboard details...
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    // Check for authentication errors (401, 403)
    const errorStatus = (error as any).response?.status;
    if (errorStatus === 401 || errorStatus === 403) {
      localStorage.removeItem("token");
      navigate("/login");
    }
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <motion.div
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
        >
          <div className="flex items-center justify-between p-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <SidebarTrigger />
            </motion.div>
            <motion.h1
              className="text-xl font-semibold text-foreground"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
            >
              Dashboard
            </motion.h1>
            <div className="w-10" />
          </div>
        </motion.div>
        <motion.div
          className="max-w-7xl mx-auto px-6 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
        >
          <div className="text-center text-red-600">
            Error loading sessions: {(error as any).response?.data?.message || error.message}
            <br />
            Please try again later or contact support.
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <motion.div
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between p-6">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.4 }}            
          >
            <SidebarTrigger />
          </motion.div>
          <motion.h1
            className="text-xl font-semibold text-foreground"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeInOut" }}
          >
            Dashboard
          </motion.h1>
          <div className="w-10" />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Welcome Section */}
        <motion.div
          className="text-center py-6"  
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
        >
          <motion.h1
            className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeInOut" }}
          >
            Welcome back, {user.name}!
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeInOut" }}
          >
            Continue your mental wellness journey with personalized insights and expert guidance
          </motion.p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6, ease: "easeInOut" }}
        >
          <AnimatePresence>
            {stats.map((stat, index) => {
              const statColor = statsColors[index % statsColors.length];
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.1, ease: "easeInOut" }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    transition: { duration: 0.3, ease: "easeInOut" },
                  }}
                >
                  <Card className={`border-0 shadow-sm bg-gradient-to-br ${statColor.gradient} hover:shadow-md transition-all duration-300`}>
                    <CardHeader className="pb-3">
                      <motion.div
                        className="flex items-center justify-between"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 + index * 0.1, ease: "easeInOut" }}
                      >
                        <div className="space-y-1">
                          <p className={`text-sm font-medium text-muted-foreground uppercase tracking-wide`}>
                            {stat.title}
                          </p>
                          <p className={`text-3xl font-bold ${statColor.textColor}`}>
                            {stat.value}
                          </p>
                        </div>
                        <motion.div
                          className={`flex items-center justify-center w-12 h-12 rounded-full ${statColor.iconBg}`}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <stat.icon className={`h-6 w-6 ${statColor.textColor}`} />
                        </motion.div>
                      </motion.div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <motion.p
                        className={`text-sm text-muted-foreground font-medium`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.9 + index * 0.1, ease: "easeInOut" }}
                      >
                        {stat.change}
                      </motion.p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Upcoming Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.0, ease: "easeInOut" }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <motion.div
                  className="flex items-center gap-3 text-xl text-primary font-semibold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.1, ease: "easeInOut" }}
                >
                  <motion.div
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <Calendar className="h-5 w-5 text-primary" />
                  </motion.div>
                  Upcoming Sessions
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingSessions.length === 0 ? (
                  <motion.div
                    className="text-center py-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.2, ease: "easeInOut" }}
                  >
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <motion.p
                      className="text-muted-foreground font-medium"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 1.3, ease: "easeInOut" }}
                    >
                      No upcoming sessions
                    </motion.p>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                  {upcomingSessions.slice(0, 2).map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, delay: 1.4 + index * 0.1, ease: "easeInOut" }}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-transparent rounded-xl border border-border/50"
                        whileHover={{ scale: 1.02 }}
                      >
                        <motion.div
                          className="flex items-center gap-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 1.5 + index * 0.1, ease: "easeInOut" }}
                        >
                          <motion.div
                            className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <User className="h-6 w-6 text-primary" />
                          </motion.div>
                          <div className="space-y-1">
                            <h4 className="font-semibold text-foreground">{session.expertName}</h4>
                            <p className="text-sm text-muted-foreground">{session.type}</p>
                            <p className="text-sm font-medium text-primary">{session.date}</p>
                          </div>
                        </motion.div>
                        <motion.div
                          className="flex items-center gap-3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 1.6 + index * 0.1, ease: "easeInOut" }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <Badge variant="outline" className="font-medium">{formatTo12Hour(session.time)}</Badge>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button size="sm" className="h-9 px-4">Join</Button>
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Completed Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.7, ease: "easeInOut" }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <motion.div
                  className="flex items-center gap-3 text-xl text-primary font-semibold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.8, ease: "easeInOut" }}
                >
                  <motion.div
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <CheckCircle className="h-5 w-5 text-secondary" />
                  </motion.div>
                  Recent Sessions
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-4">
                {completedSessionsState.length === 0 ? (
                  <motion.div
                    className="text-center py-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.9, ease: "easeInOut" }}
                  >
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <motion.p
                      className="text-muted-foreground font-medium"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 2.0, ease: "easeInOut" }}
                    >
                      No completed sessions
                    </motion.p>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {completedSessionsState.map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, delay: 2.1 + index * 0.1, ease: "easeInOut" }}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-transparent rounded-xl border border-border/50"
                        whileHover={{ scale: 1.02 }}
                      >
                        <motion.div
                          className="flex items-center gap-4"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 2.2 + index * 0.1, ease: "easeInOut" }}
                        >
                          <motion.div
                            className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <User className="h-6 w-6 text-secondary" />
                          </motion.div>
                          <div className="space-y-1">
                            <h4 className="font-semibold text-foreground">{session.expertName}</h4>
                            <p className="text-sm text-muted-foreground">{session.type}</p>
                            <p className="text-sm font-medium text-secondary">{session.date}</p>
                          </div>
                        </motion.div>
                        <motion.div
                          className="flex items-center gap-3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 2.3 + index * 0.1, ease: "easeInOut" }}
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <Badge variant="secondary" className="font-medium">{session.duration}</Badge>
                          </motion.div>
                          {session.canReview && !session.hasReviewed && (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ReviewDialog
                                expertName={session.expertName}
                                sessionType={session.type}
                                onReviewSubmitted={() => handleReviewSubmitted(session.id)}
                              >
                                <Button size="sm" variant="outline" className="h-9 px-4">
                                  <Star className="h-4 w-4 mr-2" />
                                  Review
                                </Button>
                              </ReviewDialog>
                            </motion.div>
                          )}
                          {session.hasReviewed && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              <Badge
                                variant="outline"
                                className="border-yellow-200 bg-yellow-50 text-yellow-700"
                              >
                                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                Reviewed
                              </Badge>
                            </motion.div>
                          )}
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 2.4, ease: "easeInOut" }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <motion.div
                className="flex items-center gap-3 text-xl text-primary font-semibold"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 2.5, ease: "easeInOut" }}
              >
                <motion.div
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <BookOpen className="h-5 w-5 text-accent" />
                </motion.div>
                Your Progress
              </motion.div>
            </CardHeader>
            <CardContent className="space-y-8">
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 2.6, ease: "easeInOut" }}
              >
                <motion.div
                  className="flex justify-between items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 2.7, ease: "easeInOut" }}
                >
                  <span className="text-sm font-medium text-muted-foreground">Overall Mental Wellness</span>
                  <span className="text-lg font-bold text-foreground">85%</span>
                </motion.div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 2.8, ease: "easeInOut" }}
                >
                  <Progress value={85} className="h-3" />
                </motion.div>
              </motion.div>
              
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 2.9, ease: "easeInOut" }}
              >
                <motion.div
                  className="flex justify-between items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 3.0, ease: "easeInOut" }}
                >
                  <span className="text-sm font-medium text-muted-foreground">Anxiety Management</span>
                  <span className="text-lg font-bold text-foreground">58%</span>
                </motion.div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 3.1, ease: "easeInOut" }}
                >
                  <Progress value={58} className="h-3" />
                </motion.div>
              </motion.div>
              
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 3.2, ease: "easeInOut" }}
              >
                <motion.div
                  className="flex justify-between items-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 3.3, ease: "easeInOut" }}
                >
                  <span className="text-sm font-medium text-muted-foreground">Confidence Building</span>
                  <span className="text-lg font-bold text-foreground">92%</span>
                </motion.div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 3.4, ease: "easeInOut" }}
                >
                  <Progress value={92} className="h-3" />
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;