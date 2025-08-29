import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TrainingSessionCard } from '@/components/TrainingSessionCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { TrainingSessionAPI } from '@/api/trainingsession';
import { Calendar, Filter, Search, TrendingUp } from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { CustomLoader } from "@/components/CustomLoader";

const TrainingSessions: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading, error } = useQuery({
    queryKey: ['trainingSessions'],
    queryFn: () => TrainingSessionAPI.getTrainingSessions(),
    enabled: !!user?.id,
  });

  const registerMutation = useMutation({
    mutationFn: (sessionId: string) => TrainingSessionAPI.registerSession(sessionId, {
      userId: user?.id || '',
      email: user?.email || '',
      name: user?.name || '',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['trainingSessions']});
    
      console.log('Successfully registered for session');
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (sessionId: string) => TrainingSessionAPI.cancelRegistration(sessionId, {
      userId: user?.id || '',
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['trainingSessions']});
      console.log('Successfully cancelled registration');
    },
    onError: (error) => {
      console.error('Cancellation failed:', error);
    },
  });

  const filteredSessions = sessions.filter(session => {
    const statusFilter = selectedStatus === 'all' || session.status === selectedStatus;
    const typeFilter = selectedType === 'all' || session.type === selectedType;
    return statusFilter && typeFilter;
  });

  const statusOptions = [
    { value: 'all', label: 'All Sessions' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'online', label: 'Online' },
    { value: 'live', label: 'Live' },
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
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
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
              className="text-xl font-semibold text-foreground truncate"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Training Sessions
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
          <div className="text-lg text-muted-foreground">Loading training sessions...</div>
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
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            className="text-center text-red-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Error: {error.message}
          </motion.div>
        </div>
      </motion.div>
    );
  }

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
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.4 }}
          >
            <SidebarTrigger />
          </motion.div>
          <motion.h1
            className="text-xl font-semibold text-foreground"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Training Sessions
          </motion.h1>
          <div className="w-10" />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Strategic Mental Wealth Training
            </h1>
          </motion.div>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            Join immersive sessions to strengthen your personal and professional growth
          </motion.p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Total Sessions",
              value: sessions.length,
              textColor:"text-primary",
              icon: <Calendar className="h-6 w-6 text-primary" />,
              iconBg: "bg-primary/10",
              gradient: "from-primary/10 via-primary/5 to-transparent",
              bg: "from-primary/5 to-primary/10",
            },
            {
              title: "Available Now",
              value: filteredSessions.length,
              textColor:"text-amber-700",
              icon: <TrendingUp className="h-6 w-6 text-amber-700" />,
              iconBg: "bg-amber-100",
              gradient: "from-amber-50 via-amber-25 to-transparent",
              bg: "from-secondary/5 to-secondary/10",
            },
            {
              title: "Enrolled Sessions",
              value: "0",
              textColor:"text-green-700",
              icon: <Calendar className="h-6 w-6 text-green-700" />,
              gradient: "from-green-50 via-amber-25 to-transparent via-green-50 to-transparent",
              iconBg: "bg-green-100",
              bg: "from-accent/5 to-accent/10",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            >
              <Card className={`border-0 shadow-sm bg-gradient-to-br ${stat.gradient}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <motion.p
                        className="text-sm font-medium text-muted-foreground uppercase tracking-wide"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      >
                        {stat.title}
                      </motion.p>
                      <motion.p
                        className={`text-3xl font-bold ${stat.textColor} mt-2`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${stat.iconBg}`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <Filter className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-semibold">Filter Sessions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex flex-wrap gap-3">
                  <span className="text-sm font-medium text-muted-foreground flex items-center">
                    Status:
                  </span>
                  {statusOptions.map((option, index) => (
                    <motion.div
                      key={option.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 1.0 + index * 0.05 }}
                    >
                      <Button
                        variant={selectedStatus === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedStatus(option.value)}
                        className="h-9 px-4 rounded-full transition-all duration-200"
                      >
                        {option.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <Separator orientation="vertical" className="h-9 hidden lg:block" />
                <div className="flex flex-wrap gap-3">
                  <span className="text-sm font-medium text-muted-foreground flex items-center">
                    Type:
                  </span>
                  {typeOptions.map((option, index) => (
                    <motion.div
                      key={option.value}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 1.2 + index * 0.05 }}
                    >
                      <Button
                        variant={selectedType === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedType(option.value)}
                        className="h-9 px-4 rounded-full transition-all duration-200"
                      >
                        {option.label}
                      </Button>
                    </motion.div>
                  ))}
                </div>
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
              transition={{ duration: 0.4, delay: 1.4 }}
            >
              {filteredSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 1.5 + index * 0.1 }}
                >
                  <TrainingSessionCard
                    session={session}
                    onRegister={() => registerMutation.mutate(session.id)}
                    onCancel={() => cancelMutation.mutate(session.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, delay: 1.5 }}
            >
              <Card className="border-0 shadow-sm">
                <CardContent className="py-16 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <motion.h3
                      className="text-xl font-semibold text-foreground"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 1.6 }}
                    >
                      No sessions found
                    </motion.h3>
                    <motion.p
                      className="text-muted-foreground max-w-md"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 1.7 }}
                    >
                      Try adjusting your filters or check back later for new sessions.
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

export default TrainingSessions;