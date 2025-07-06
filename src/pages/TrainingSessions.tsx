
// export default TrainingSessions;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TrainingSessionCard } from '@/components/TrainingSessionCard';
import { useTrainingSessions } from '@/hooks/useTrainingSessions';
import { Calendar, Filter, Search, TrendingUp } from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { sampleTrainingSessions } from '@/data/trainingSessions';

const TrainingSessions: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredSessions = sampleTrainingSessions.filter(session => {
    const statusFilter = selectedStatus === 'all' || session.status === selectedStatus;
    const typeFilter = selectedType === 'all' || session.type === selectedType;
    return statusFilter && typeFilter;
  });

  const handleEnroll = (sessionId: string) => {
    console.log('Enrolling in session:', sessionId);
  };

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

  return (

    
    <motion.div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
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
            Training Sessions
          </motion.h1>
          <div className="w-10" />
        </div>
      </motion.div>


      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}        
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
            Strategic Mental Wealth Training
            </h1>
          </motion.div>

      <motion.p
        className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Join expert-led sessions to enhance your mental wellness journey
      </motion.p>
    </div>

          
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Total Sessions",
              value: sampleTrainingSessions.length,
              icon: <Calendar className="h-6 w-6 text-primary " />,
              iconBg: "bg-primary/10",
              gradient: "from-primary/10 via-primary/5 to-transparent",
              bg: "from-primary/5 to-primary/10",
            },
            {
              title: "Available Now",
              value: filteredSessions.length,
              icon: <TrendingUp className="h-6 w-6 text-green-700 " />,
              iconBg: "bg-green-100",
              gradient: "from-green-50 via-green-50 to-transparent",         
              bg: "from-secondary/5 to-secondary/10",
            },
            {
              title: "Completion Rate",
              value: "94%",
              icon: <Search className="h-6 w-6 text-amber-700" />,
              gradient: "from-amber-50 via-amber-25 to-transparent",
              iconBg: "bg-amber-100",
              bg: "from-accent/5 to-accent/10",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1, ease: "easeOut" }}
              whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
            >
              <Card className={`border-0 shadow-sm bg-gradient-to-br ${stat.gradient}`}>
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
                        className={`text-3xl font-bold ${stat.title.includes("Total") ? "text-primary" : stat.title.includes("Available") ? "text-secondary" : "text-accent"} mt-2`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                      >
                        {stat.value}
                      </motion.p>
                    </div>
                    <motion.div
                      className={`flex items-center justify-center w-12 h-12 rounded-full ${stat.iconBg}`}
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
          <Card className="border-0 shadow-sm">
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
                  <Filter className="h-5 w-5 text-primary" />
                </motion.div>
                <CardTitle className="text-xl font-semibold">Filter Sessions</CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex flex-wrap gap-3">
                  <motion.span
                    className="text-sm font-medium text-muted-foreground flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1.0 }}
                  >
                    Status:
                  </motion.span>
                  {statusOptions.map((option, index) => (
                    <motion.div
                      key={option.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 1.1 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.3 }}
                >
                  <Separator orientation="vertical" className="h-9 hidden lg:block" />
                </motion.div>
                
                <div className="flex flex-wrap gap-3">
                  <motion.span
                    className="text-sm font-medium text-muted-foreground flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 1.4 }}
                  >
                    Type:
                  </motion.span>
                  {typeOptions.map((option, index) => (
                    <motion.div
                      key={option.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 1.5 + index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
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
              transition={{ duration: 0.5, delay: 1.7 }}
            >
              {filteredSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5, delay: 1.8 + index * 0.1, ease: "easeOut" }}
                >
                  <TrainingSessionCard
                    session={session}
                    onEnroll={handleEnroll}
                  />
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
              <Card className="border-0 shadow-sm">
                <CardContent className="py-16 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                    >
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50">
                        <Search className="h-8 w-8 text-muted-foreground" />
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