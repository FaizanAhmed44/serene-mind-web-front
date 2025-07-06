
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Calendar, Clock, CheckCircle, Clock4, FileText } from 'lucide-react';
import { BookedSession } from '@/data/types/bookedSession';

interface BookedSessionCardProps {
  session: BookedSession;
}

export const BookedSessionCard: React.FC<BookedSessionCardProps> = ({ session }) => {
  const isUpcoming = session.status === 'upcoming';
  
  const getStatusColor = (status: string) => {
    return status === 'upcoming' 
      ? 'bg-amber-50 text-amber-700 border-amber-200' 
      : 'bg-green-50 text-green-700 border-green-200';
  };

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
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, boxShadow: "0 8px 25px rgba(0,0,0,0.12)" }}
    >
      <Card className="group h-full border-0 shadow-soft hover:shadow-elevated transition-all duration-300 bg-white">
        <CardHeader className="pb-4">
          <motion.div
            className="flex items-start justify-between gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex items-center gap-3 mb-3"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                    {session.expertName}
                  </CardTitle>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4, type: "spring", stiffness: 100 }}
            >
              <Badge 
                variant="outline" 
                className={`${getStatusColor(session.status)} font-medium shrink-0 px-3 py-1.5 text-sm`}
              >
                {isUpcoming ? (
                  <Clock4 className="w-4 h-4 mr-1.5" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                )}
                {isUpcoming ? 'Upcoming' : 'Completed'}
              </Badge>
            </motion.div>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Session Details */}
          <div className="space-y-4">
            <motion.div
              className="flex items-center gap-4 text-muted-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.4 }}>
                <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
              </motion.div>
              <span className="font-medium text-foreground">{formatDate(session.date)}</span>
            </motion.div>
            
            <motion.div
              className="flex items-center gap-4 text-muted-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.4 }}>
                <Clock className="w-5 h-5 text-primary flex-shrink-0" />
              </motion.div>
              <span className="font-medium text-foreground">{session.time}</span>
            </motion.div>
          </div>

          {/* Notes Section */}
          {session.notes && (
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <motion.div
                className="flex items-center gap-3 text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.8 }}
              >
                <motion.div whileHover={{ scale: 1.2 }} transition={{ duration: 0.2 }}>
                  <FileText className="w-5 h-5 text-primary" />
                </motion.div>
                <span className="font-medium text-muted-foreground">Session Notes</span>
              </motion.div>
              <div className="ml-8 p-4 bg-muted/30 rounded-xl border-l-4 border-primary/20">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {session.notes}
                </p>
              </div>
            </motion.div>
          )}

          {/* Action Button */}
          <motion.div
            className="pt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            {isUpcoming && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  className="w-full h-12 font-medium text-base transition-all duration-200 bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  Join Session
                </Button>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
