import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookedSessionCard } from '@/components/BookedSessionCard';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BookedSession } from '@/data/types/bookedSession';
import { CalendarCheck, Filter, Clock, CheckCircle, TrendingUp, Users, Calendar, Star } from 'lucide-react';

const dummyBookedSessions: BookedSession[] = [
  {
    id: '1',
    expertName: 'Dr. Ayesha Khan',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    date: 'July 10, 2025',
    time: '3:00 PM',
    status: 'upcoming',
    notes: 'Feeling depressed due to work stress and need guidance on coping mechanisms'
  },
  {
    id: '2',
    expertName: 'Dr. Ali Hamza',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    date: 'June 20, 2025',
    time: '12:00 PM',
    status: 'completed',
    notes: 'Discussion about anxiety management techniques'
  },
  {
    id: '3',
    expertName: 'Dr. Sana Fatima',
    avatar: 'https://images.unsplash.com/photo-1594824395815-59fdc9e62c3e?w=150&h=150&fit=crop&crop=face',
    date: 'July 8, 2025',
    time: '5:30 PM',
    status: 'completed',
    notes: 'Follow-up session for stress management and goal setting'

  },
  {
    id: '4',
    expertName: 'Dr. Hamna Qureshi',
    avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop&crop=face',
    date: 'July 15, 2025',
    time: '10:00 AM',
    status: 'upcoming',
    notes: 'Follow-up session for stress management and goal setting'
  }
];

const BookedSessions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const upcomingSessions = dummyBookedSessions.filter(session => session.status === 'upcoming');
  const pastSessions = dummyBookedSessions.filter(session => session.status === 'completed');

  const getSessionsForTab = (tab: string) => {
    switch (tab) {
      case 'upcoming':
        return upcomingSessions;
      case 'past':
        return pastSessions;
      default:
        return dummyBookedSessions;
    }
  };

  const filteredSessions = getSessionsForTab(activeTab);

  const stats = [
    {
      title: "Total Sessions",
      value: dummyBookedSessions.length,
      icon: <Users className="w-6 h-6" />,
      gradient: "from-primary/10 via-primary/5 to-transparent",
      iconBg: "bg-primary/10",
      textColor: "text-primary",
      description: "All time sessions"
    },
    {
      title: "Upcoming",
      value: upcomingSessions.length,
      icon: <Clock className="w-6 h-6" />,
      gradient: "from-amber-50 via-amber-25 to-transparent",
      iconBg: "bg-amber-100",
      textColor: "text-amber-700",
      description: "Sessions scheduled"
    },
    {
      title: "Completed",
      value: pastSessions.length,
      icon: <CheckCircle className="w-6 h-6" />,
      gradient: "from-green-50 via-green-25 to-transparent",
      iconBg: "bg-green-100",
      textColor: "text-green-700",
      description: "Successfully finished"
    },
    {
      title: "Success Rate",
      value: "96%",
      icon: <TrendingUp className="w-6 h-6" />,
      gradient: "from-blue-50 via-blue-25 to-transparent",
      iconBg: "bg-blue-100",
      textColor: "text-blue-700",
      description: "Session completion"
    }
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-muted/10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-1 space-y-8">
      
      <motion.div
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between p-4">
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
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            My Booked Sessions
          </motion.h1>
          <div className="w-10" />
        </div>
      </motion.div>

        {/* Enhanced Header Section */}
        <motion.div
          className="text-center space-y-6 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          
          <div className="space-y-3">
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
           

            <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-primary">
            Your Scheduled Wellness Sessions
            </h1>
          </motion.div>

      <motion.p
        className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Track and manage your one-on-one sessions with our expert mental health professionals
      </motion.p>
    </div>

          
        </motion.div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <Card className={`border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-gradient-to-br ${stat.gradient} overflow-hidden relative`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -mr-16 -mt-16" />
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {stat.title}
                      </p>
                      <p className={`text-3xl font-bold ${stat.textColor}`}>
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                    <motion.div
                      className={`flex items-center justify-center w-14 h-14 rounded-xl ${stat.iconBg} ${stat.textColor}`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {stat.icon}
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-semibold flex items-center gap-3">
                <Filter className="w-6 h-6 text-primary" />
                Session Management
              </CardTitle>
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
                      {dummyBookedSessions.length}
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
                    <SessionGrid sessions={dummyBookedSessions} />
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
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <BookedSessionCard session={session} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="empty-state"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-0 shadow-sm bg-gradient-to-br from-muted/20 to-muted/5">
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center space-y-6">
                <motion.div
                  className="flex items-center justify-center w-20 h-20 rounded-2xl bg-muted/20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <CalendarCheck className="h-10 w-10 text-muted-foreground" />
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-semibold text-foreground">No sessions found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    You don't have any sessions in this category yet. Book a session with our expert therapists to get started.
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="mt-4 px-8 py-3 rounded-xl font-medium bg-primary hover:bg-primary/90 transition-all duration-200"
                >
                  <Star className="w-4 h-4 mr-2" />
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
