
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Calendar, Clock, CheckCircle, Clock4, FileText, Video, MessageCircle } from 'lucide-react';
import { BookedSession } from '@/data/types/bookedSession';

interface BookedSessionCardProps {
  session: BookedSession;
}

export const BookedSessionCard: React.FC<BookedSessionCardProps> = ({ session }) => {
  const isUpcoming = session.status === 'upcoming';
  
  const getStatusConfig = (status: string) => {
    return status === 'upcoming' 
      ? {
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: <Clock4 className="w-4 h-4 mr-1.5" />,
          label: 'Upcoming',
          gradient: 'from-amber-50/50 to-amber-100/30'
        }
      : {
          color: 'bg-green-50 text-green-700 border-green-200',
          icon: <CheckCircle className="w-4 h-4 mr-1.5" />,
          label: 'Completed',
          gradient: 'from-green-50/50 to-green-100/30'
        };
  };

  const statusConfig = getStatusConfig(session.status);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -2, scale: 1.01 }}
      className="h-full"
    >
      <Card className="group h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-background to-muted/10 overflow-hidden relative">
        {/* Decorative background element */}
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${statusConfig.gradient} rounded-full -mr-12 -mt-12 opacity-50`} />
        
        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <motion.div
              className="flex items-center gap-4 flex-1 min-w-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-primary/15 to-primary/5 rounded-2xl flex items-center justify-center border border-primary/10">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-2 border-background" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-xl font-semibold text-foreground leading-tight group-hover:text-primary transition-colors duration-200 truncate">
                  {session.expertName}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Mental Health Expert</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Badge 
                variant="outline" 
                className={`${statusConfig.color} font-medium shrink-0 px-3 py-1.5 text-sm border-0 shadow-sm`}
              >
                {statusConfig.icon}
                {statusConfig.label}
              </Badge>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          {/* Session Details with Enhanced Design */}
          <div className="grid grid-cols-1 gap-4">
            <motion.div
              className="flex items-center gap-4 p-3 rounded-xl bg-muted/20 border border-muted/30"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.02)" }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Session Date</p>
                <p className="font-semibold text-foreground">{formatDate(session.date)}</p>
              </div>
            </motion.div>
            
            <motion.div
              className="flex items-center gap-4 p-3 rounded-xl bg-muted/20 border border-muted/30"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.02)" }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Session Time</p>
                <p className="font-semibold text-foreground">{session.time}</p>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Notes Section */}
          {session.notes && (
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">Session Notes</span>
              </div>
              <div className="p-4 bg-gradient-to-r from-muted/30 to-muted/20 rounded-xl border-l-4 border-primary/30">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {session.notes}
                </p>
              </div>
            </motion.div>
          )}

          {/* Enhanced Action Buttons */}
          <motion.div
            className="flex gap-3 pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            {isUpcoming ? (
              <>
                <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    className="w-full h-11 font-medium text-base bg-primary hover:bg-primary/90 transition-all duration-200 rounded-xl shadow-sm"
                    size="lg"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Join Session
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="outline"
                    size="lg"
                    className="h-11 px-4 border-0 bg-muted/30 hover:bg-muted/50 transition-all duration-200 rounded-xl"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </motion.div>
              </>
            ) : (
              <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline"
                  className="w-full h-11 font-medium text-base border-0 bg-muted/20 hover:bg-muted/30 transition-all duration-200 rounded-xl"
                  size="lg"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Summary
                </Button>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
