import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Video, CheckCircle, Link } from 'lucide-react';
import { TrainingSession } from '@/data/types/training';

interface TrainingSessionCardProps {
  session: TrainingSession;
  onEnroll?: (sessionId: string) => void;
}

export const TrainingSessionCard: React.FC<TrainingSessionCardProps> = ({ 
  session, 
  onEnroll 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ongoing':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'completed':
        return 'bg-gray-50 text-gray-600 border-gray-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'online' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />;
  };

  const isEnrollable = session.status === 'scheduled' && 
                      session.currentParticipants < session.maxParticipants;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const participantPercentage = (session.currentParticipants / session.maxParticipants) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="group h-full border-md shadow-sm hover:shadow-md transition-all duration-300 bg-white">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <CardTitle className="text-lg font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {session.title}
                </CardTitle>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <CardDescription className="mt-2 text-muted-foreground line-clamp-2 leading-relaxed">
                  {session.description}
                </CardDescription>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Badge 
                variant="outline" 
                className={`${getStatusColor(session.status)} font-medium shrink-0 px-3 py-1 text-xs`}
              >
                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
              </Badge>
            </motion.div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Session Details */}
          <div className="space-y-3">
            <motion.div
              className="flex items-center gap-3 text-sm text-muted-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="font-medium">{formatDate(session.date)}</span>
            </motion.div>
            
            <motion.div
              className="flex items-center gap-3 text-sm text-muted-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Clock className="h-4 w-4 text-primary flex-shrink-0" />
              <span>{session.time} • {session.duration}</span>
            </motion.div>

            <motion.div
              className="flex items-center gap-3 text-sm text-muted-foreground"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              {getTypeIcon(session.type)}
              <span className="capitalize font-medium">{session.type}</span>
              {session.type === 'live' && session.location && (
                <span className="text-muted-foreground/70">• {session.location}</span>
              )}
            </motion.div>
          </div>

          {/* Participants Progress */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <motion.div
              className="flex items-center justify-between text-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium text-muted-foreground">Participants</span>
              </div>
              <span className="font-semibold text-foreground">
                {session.currentParticipants}/{session.maxParticipants}
              </span>
            </motion.div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className="bg-primary h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${participantPercentage}%` }}
                transition={{ duration: 0.5, delay: 0.9 }}
              />
            </div>
          </motion.div>

          {/* Verification Badge */}
          {session.verified && (
            <motion.div
              className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1.0 }}
            >
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Verified Session</span>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="pt-2 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.1 }}
          >
            {isEnrollable && (              
              <button
              onClick={() => onEnroll?.(session.id)}
              className="w-full py-2 px-4 bg-gradient-to-r from-primary to-primary/70 text-white font-semibold rounded-lg shadow-md hover:from-primary hover:to-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-all duration-200"
              type="button"
              >
                Enroll Now
              </button>
            )}

            {session.status === 'ongoing' && session.meetingLink && (            
              <button
                onClick={() => window.open(session.meetingLink!, '_blank')}
                className="w-full py-2 px-4 bg-gradient-to-r from-primary to-primary/70 text-white font-semibold rounded-lg shadow-md hover:from-primary hover:to-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-all duration-200"
                type="button"
              >
                Join Session
              </button>                
            )}

            {session.status === 'completed' && (
              <Button 
                variant="outline"
                className="w-full h-11 font-medium"
                size="sm"
                disabled
              >
                Session Completed
              </Button>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};