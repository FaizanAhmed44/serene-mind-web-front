
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Video, CheckCircle } from 'lucide-react';
import { TrainingSession } from '@/data/types';

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
    <Card className="group h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {session.title}
            </CardTitle>
            <CardDescription className="mt-2 text-muted-foreground line-clamp-2 leading-relaxed">
              {session.description}
            </CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={`${getStatusColor(session.status)} font-medium shrink-0 px-3 py-1 text-xs`}
          >
            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Session Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="font-medium">{formatDate(session.date)}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary flex-shrink-0" />
            <span>{session.time} • {session.duration}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {getTypeIcon(session.type)}
            <span className="capitalize font-medium">{session.type}</span>
            {session.type === 'live' && session.location && (
              <span className="text-muted-foreground/70">• {session.location}</span>
            )}
          </div>
        </div>

        {/* Participants Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium text-muted-foreground">Participants</span>
            </div>
            <span className="font-semibold text-foreground">
              {session.currentParticipants}/{session.maxParticipants}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${participantPercentage}%` }}
            />
          </div>
        </div>

        {/* Verification Badge */}
        {session.verified && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
            <CheckCircle className="h-4 w-4" />
            <span className="font-medium">Verified Session</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          {isEnrollable && (
            <Button 
              onClick={() => onEnroll?.(session.id)}
              className="w-full h-11 font-medium transition-all duration-200"
              size="sm"
            >
              Enroll Now
            </Button>
          )}

          {session.status === 'ongoing' && session.meetingLink && (
            <Button 
              onClick={() => window.open(session.meetingLink!, '_blank')}
              className="w-full h-11 bg-green-600 hover:bg-green-700 font-medium transition-all duration-200"
              size="sm"
            >
              Join Session
            </Button>
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
        </div>
      </CardContent>
    </Card>
  );
};
