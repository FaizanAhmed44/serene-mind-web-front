
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookedSessionCard } from '@/components/BookedSessionCard';
import { BookedSession } from '@/data/types/bookedSession';
import { CalendarCheck, Filter, Clock, CheckCircle, TrendingUp, Users } from 'lucide-react';

const dummyBookedSessions: BookedSession[] = [
  {
    id: '1',
    expertName: 'Dr. Ayesha Khan',
    date: 'July 10, 2025',
    time: '3:00 PM',
    status: 'upcoming',
    notes: 'Feeling depressed due to work stress and need guidance on coping mechanisms'
  },
  {
    id: '2',
    expertName: 'Dr. Ali Hamza',
    date: 'June 20, 2025',
    time: '12:00 PM',
    status: 'completed',
    notes: 'Discussion about anxiety management techniques'
  },
  {
    id: '3',
    expertName: 'Dr. Sana Fatima',
    date: 'July 8, 2025',
    time: '5:30 PM',
    status: 'completed'
  },
  {
    id: '4',
    expertName: 'Dr. Hamna Qureshi',
    date: 'July 15, 2025',
    time: '10:00 AM',
    status: 'upcoming',
    notes: 'Follow-up session for stress management and goal setting'
  }
];

const BookedSessions: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

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

  const filteredSessions = getSessionsForTab(selectedStatus);

  const statusOptions = [
    { value: 'all', label: 'All Sessions' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'past', label: 'Past' },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              whileHover={{ scale: 1.1, rotate: 360 }}
            >
              <CalendarCheck className="w-7 h-7" />
            </motion.div>
            <div>
              <motion.h1
                className="text-4xl font-bold text-foreground tracking-tight"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                My Booked Sessions
              </motion.h1>
              <motion.p
                className="text-muted-foreground mt-2 text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Manage and track your one-on-one sessions with mental health experts
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Total Sessions",
              value: dummyBookedSessions.length,
              icon: <Users className="w-6 h-6 text-primary" />,
              bg: "from-primary/5 to-primary/10",
            },
            {
              title: "Upcoming",
              value: upcomingSessions.length,
              icon: <Clock className="w-6 h-6 text-amber-600" />,
              bg: "from-amber-50 to-amber-100",
            },
            {
              title: "Completed",
              value: pastSessions.length,
              icon: <CheckCircle className="w-6 h-6 text-green-600" />,
              bg: "from-green-50 to-green-100",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1, ease: "easeOut" }}
              whileHover={{ y: -4, boxShadow: "0 8px 25px rgba(0,0,0,0.12)" }}
            >
              <Card className={`border-0 shadow-soft bg-gradient-to-br ${stat.bg}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <motion.p
                        className="text-sm font-medium text-muted-foreground uppercase tracking-wide"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      >
                        {stat.title}
                      </motion.p>
                      <motion.p
                        className={`text-3xl font-bold ${stat.title === "Total Sessions" ? "text-primary" : stat.title === "Upcoming" ? "text-amber-600" : "text-green-600"} mt-2`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <motion.div
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-white/80"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 100, delay: 0.8 + index * 0.1 }}
                    >
                      {stat.icon}
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
        >
          <Card className="border-0 shadow-soft">
            <CardHeader className="pb-4">
              <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.9 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.4 }}
                >
                  <Filter className="w-5 h-5 text-primary" />
                </motion.div>
                <CardTitle className="text-xl font-semibold">Filter Sessions</CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-3">
                {statusOptions.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 1.0 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={selectedStatus === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStatus(option.value)}
                      className="h-10 px-6 rounded-full transition-all duration-200 font-medium"
                    >
                      {option.label}
                      {option.value !== 'all' && (
                        <span className="ml-2 px-2 py-0.5 bg-background/20 rounded-full text-xs">
                          {option.value === 'upcoming' ? upcomingSessions.length : pastSessions.length}
                        </span>
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sessions Grid */}
        <AnimatePresence>
          {filteredSessions.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              {filteredSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, delay: 1.3 + index * 0.1, ease: "easeOut" }}
                >
                  <BookedSessionCard session={session} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Card className="border-0 shadow-soft">
                <CardContent className="py-16 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                    >
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50">
                        <CalendarCheck className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <h3 className="text-xl font-semibold text-foreground">No sessions found</h3>
                    </motion.div>
                    <motion.p
                      className="text-muted-foreground max-w-md"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      Try adjusting your filters or book a new session with our expert therapists.
                    </motion.p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default BookedSessions;
