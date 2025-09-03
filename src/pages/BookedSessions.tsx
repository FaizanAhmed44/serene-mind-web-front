import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookedSessionCard } from '@/components/BookedSessionCard';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Filter, Clock, CheckCircle, BookOpen } from 'lucide-react';
import { Session, BookedSession } from '@/data/types/bookedSession';
import { BookingSessionsAPI } from '@/api/bookingSessions';
import { CustomLoader } from "@/components/CustomLoader";
import { useNavigate } from "react-router-dom";

const BookedSessions: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('all');
  const { user } = useAuth();

  const { data: apiSessions = [], isLoading, error } = useQuery<Session[]>({
    queryKey: ['bookedSessions', user?.id],
    queryFn: () => BookingSessionsAPI.getBooking(user?.id || ""),
    enabled: !!user?.id,

  });

  // Map Session to BookedSession
  const sessions: BookedSession[] =  apiSessions.map((session) => ({
    id: session.id,
    expertName: session.sessionType.expert.name,
    avatar: session.sessionType.expert.avatar || undefined,
    date: new Date(session.sessionDate).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    paymentStatus:session.paymentStatus,
    sessionName:session.sessionType.name,
    sessionPrice:session.sessionType.price,
    time: session.startTime,
    status: session.status === 'PENDING' ? 'upcoming' : 'completed',
    notes: session.notes || undefined,
  })) ;

  console.log('Mapped Sessions:', sessions);

  const upcomingSessions = sessions.filter(session => session.status === 'upcoming');
  const pastSessions = sessions.filter(session => session.status === 'completed');

  const getSessionsForTab = (tab: string) => {
    switch (tab) {
      case 'upcoming':
        return upcomingSessions;
      case 'past':
        return pastSessions;
      default:
        return sessions;
    }
  };

  const filteredSessions = getSessionsForTab(activeTab);

  const stats = [
    {
      title: "Total Sessions",
      value: sessions.length,
      icon: <Calendar className="w-6 h-6 text-primary" />,
      gradient: "from-primary/10 via-primary/5 to-transparent",
      iconBg: "bg-primary/10",
      textColor: "text-primary",
      description: "All time sessions",
    },
    {
      title: "Upcoming",
      value: upcomingSessions.length,
      icon: <Clock className="w-6 h-6 text-amber-700" />,
      gradient: "from-amber-50 via-amber-25 to-transparent",
      iconBg: "bg-amber-100",
      textColor: "text-amber-700",
      description: "Sessions scheduled",
    },
    {
      title: "Completed",
      value: pastSessions.length,
      icon: <CheckCircle className="w-6 h-6 text-green-700" />,
      gradient: "from-green-50 via-green-25 to-transparent",
      iconBg: "bg-green-100",
      textColor: "text-green-700",
      description: "Successfully finished",
    },
  ];

  if (isLoading) {
    return (
      <motion.div
        className="min-h-screen bg-background relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between p-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.4 }}
            >
              <SidebarTrigger />
            </motion.div>
            <motion.h1 
              className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              My Booked Session
            </motion.h1>
            <div className="w-10" />
          </div>
        </motion.div>
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <CustomLoader />
          <div className="text-lg text-muted-foreground">Loading Booked Sessions...</div>
        </motion.div>
      </motion.div>
    ); 
    
  }

  if (error) {
    return (
      <motion.div
        className="min-h-screen bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between p-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <SidebarTrigger />
            </motion.div>
            <motion.h1
              className="text-xl font-semibold text-foreground"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Booked Sessions
            </motion.h1>
            <div className="w-10" />
          </div>
        </motion.div>
        <motion.div
          className="max-w-7xl mx-auto px-6 py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
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
    className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 relative overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >

  {/* Animated background elements */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
  </div>

    <motion.div
      className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between p-4">
        <motion.div
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.4 }}
        >
          <SidebarTrigger />
        </motion.div>
        <motion.h1
          className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          My Booked Sessions
        </motion.h1>
        <div className="w-10" />
      </div>
    </motion.div>            



    <div className="relative z-10 max-w-7xl mx-auto px-6 py-4 space-y-4">
        {/* Welcome Section */}
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: "easeInOut" }}
        >        
          <motion.h1
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4, ease: "easeInOut" }}
          >
            Your Wellness Journey
          </motion.h1>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed "
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeInOut" }}
          >
            Track and manage your transformative sessions with our expert mental health professionals. 
            Your path to personal growth and wellness starts here.
          </motion.p>          
        </motion.div>



        {sessions.length === 0 ?
        (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Card className="text-center py-16 shadow-elegant border-0 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm">
                <CardContent className="space-y-8">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl rounded-full scale-150 opacity-60" />
                    <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 mx-auto border border-primary/20">
                      <BookOpen className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">Begin Your Wellness Journey</h3>
                    <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">                    
                      No booked sessions yet. Connect with our expert therapists and start your transformative journey today.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button 
                        onClick={() => navigate("/experts")}
                        size="lg"
                        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground px-8 py-3 rounded-full font-semibold shadow-lg"
                      >
                        Find Expert Therapists
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
        ) 
        
         : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <Card className={`border-0 shadow-elegant bg-gradient-to-br ${stat.gradient} backdrop-blur-sm hover:shadow-elevated transition-all duration-300`}>
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <motion.p
                            className="text-sm font-semibold text-muted-foreground uppercase tracking-widest"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                          >
                            {stat.title}
                          </motion.p>
                          <motion.p
                            className={`text-4xl font-bold ${stat.textColor}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                          >
                            {stat.value}
                          </motion.p>
                          <motion.p
                            className="text-sm text-muted-foreground font-medium"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                          >
                            {stat.description}
                          </motion.p>
                        </div>
                        <div className={`flex items-center justify-center w-16 h-16 rounded-2xl ${stat.iconBg} shadow-soft`}>
                          {stat.icon}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
            >
              <Card className="border-0 shadow-elegant bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md">
                <CardHeader className="pb-8">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
                      <Filter className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                      Session Management
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-muted/30 p-1 rounded-xl">
                      <TabsTrigger
                        value="all"
                        className="rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        All Sessions
                        <span className="ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                          {sessions.length}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="upcoming"
                        className="rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Upcoming
                        <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                          {upcomingSessions.length}
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="past"
                        className="rounded-lg font-medium transition-all duration-200 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Past
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                          {pastSessions.length}
                        </span>
                      </TabsTrigger>
                    </TabsList>

                    <div className="mt-8">
                      <TabsContent value="all" className="mt-0">
                        <SessionGrid sessions={sessions} />
                      </TabsContent>
                      <TabsContent value="upcoming" className="mt-0">
                        <SessionGrid sessions={upcomingSessions} />
                      </TabsContent>
                      <TabsContent value="past" className="mt-0">
                        <SessionGrid sessions={pastSessions} />
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

interface SessionGridProps {
  sessions: BookedSession[];
}

const SessionGrid: React.FC<SessionGridProps> = ({ sessions }) => {
  return (
    <AnimatePresence mode="wait">
      {sessions.length > 0 ? (
        <motion.div
          key="sessions-grid"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.0 }}
        >
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 1.1 + index * 0.1 }}
            >
              <BookedSessionCard session={session} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="empty-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, delay: 1.1 }}
        >
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center space-y-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <motion.h3
                    className="text-xl font-semibold text-foreground"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.2 }}
                  >
                    No sessions found
                  </motion.h3>
                  <motion.p
                    className="text-muted-foreground max-w-md mx-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.3 }}
                  >
                    You don't have any sessions in this category yet. Book a session with our expert therapists to get started.
                  </motion.p>
                </div>
                <Button
                  size="lg"
                  className="mt-4 px-8 py-3 rounded-xl font-medium bg-primary hover:bg-primary/90 transition-all duration-200"
                >
                  Find Experts
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookedSessions;