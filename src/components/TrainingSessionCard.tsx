
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, Video } from 'lucide-react';
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
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'online' ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />;
  };

  const isEnrollable = session.status === 'scheduled' && 
                      session.currentParticipants < session.maxParticipants;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card className="h-full hover-lift transition-all duration-200 border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
              {session.title}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-gray-600 line-clamp-2">
              {session.description}
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(session.status)} font-medium shrink-0`}>
            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formatDate(session.date)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-primary" />
            <span>{session.time} • {session.duration}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            {getTypeIcon(session.type)}
            <span className="capitalize">{session.type}</span>
            {session.type === 'live' && session.location && (
              <span className="text-gray-500">• {session.location}</span>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="h-4 w-4 text-primary" />
            <span>{session.currentParticipants}/{session.maxParticipants} participants</span>
          </div>
        </div>

        {session.verified && (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            ✓ Verified Session
          </Badge>
        )}

        {isEnrollable && (
          <Button 
            onClick={() => onEnroll?.(session.id)}
            className="w-full mt-4"
            size="sm"
          >
            Enroll Now
          </Button>
        )}

        {session.status === 'ongoing' && session.meetingLink && (
          <Button 
            onClick={() => window.open(session.meetingLink!, '_blank')}
            className="w-full mt-4 bg-green-600 hover:bg-green-700"
            size="sm"
          >
            Join Session
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
