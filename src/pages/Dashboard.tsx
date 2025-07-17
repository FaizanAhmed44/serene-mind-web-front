import { useState } from "react";
import { Calendar, Clock, User, BookOpen, Star, TrendingUp, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useUpcomingSessions, useCompletedSessions } from "@/hooks/useSessions";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useUserProfile } from "@/hooks/useUserProfile";
import ReviewDialog from "@/components/ReviewDialog";

const Dashboard = () => {
  const { data: upcomingSessions = [], isLoading: upcomingLoading } = useUpcomingSessions();
  const { data: completedSessions = [], isLoading: completedLoading } = useCompletedSessions();
  const { data: dashboardStats = [], isLoading: statsLoading } = useDashboardStats();
  const { data: userData, isLoading } = useUserProfile();
  const [completedSessionsState, setCompletedSessionsState] = useState(completedSessions);

  useState(() => {
    setCompletedSessionsState(completedSessions);
  });

  const handleReviewSubmitted = (sessionId: number) => {
    setCompletedSessionsState(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, hasReviewed: true }
          : session
      )
    );
  };

  const defaultStats = [
    {
      title: "Total Sessions",
      value: upcomingSessions.length + completedSessions.length,
      icon: Calendar,
      change: "+2 this month",
      color: "primary"
    },
    {
      title: "Hours of Therapy",
      value: "24.5",
      icon: Clock,
      change: "+4.2 hours",
      color: "secondary"
    },
    {
      title: "Progress Score",
      value: "85%",
      icon: TrendingUp,
      change: "+12% improvement",
      color: "accent"
    },
    {
      title: "Completed Goals",
      value: "7/10",
      icon: CheckCircle,
      change: "3 remaining",
      color: "primary"
    }
  ];

  const stats = dashboardStats.length > 0 ? dashboardStats : defaultStats;

  if (upcomingLoading || completedLoading || statsLoading) {
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
            Loading...
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

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Welcome Section */}
        <motion.div
          className="text-center py-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
        >
          <motion.h1
            className="text-4xl font-bold mb-3 tracking-tight text-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeInOut" }}
          >
            Welcome back, {userData?.name}!
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
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
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1, ease: "easeInOut" }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: { duration: 0.3, ease: "easeInOut" }
                }}
              >
                <Card className="border-0 shadow-sm bg-gradient-to-br from-white to-muted/20 hover:shadow-md transition-all duration-300">
                  <CardHeader className="pb-3">
                    <motion.div
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.8 + index * 0.1, ease: "easeInOut" }}
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <motion.div
                        className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <stat.icon className="h-6 w-6 text-primary" />
                      </motion.div>
                    </motion.div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <motion.p
                      className="text-sm text-muted-foreground font-medium"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.9 + index * 0.1, ease: "easeInOut" }}
                    >
                      {stat.change}
                    </motion.p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
                    {upcomingSessions.map((session, index) => (
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
                            <Badge variant="outline" className="font-medium">{session.duration}</Badge>
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