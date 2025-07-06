
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, Video, MessageCircle, CheckCircle, Clock4 } from 'lucide-react';
import { BookedSession } from '@/data/types/bookedSession';

interface BookedSessionCardProps {
  session: BookedSession;
}

export const BookedSessionCard: React.FC<BookedSessionCardProps> = ({ session }) => {
  const isUpcoming = session.status === 'upcoming';

  const statusConfig = isUpcoming
    ? {
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: <Clock4 className="w-4 h-4 mr-1.5" />,
        label: 'Upcoming'
      }
    : {
        color: 'bg-green-50 text-green-700 border-green-200',
        icon: <CheckCircle className="w-4 h-4 mr-1.5" />,
        label: 'Completed'
      };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="group h-full border shadow-sm bg-gradient-to-br from-background to-muted/10 relative">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14 border border-primary/10 shadow">
                <AvatarImage src={session.avatar} alt={session.expertName} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                  {getInitials(session.expertName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">{session.expertName}</CardTitle>
                <p className="text-xs text-muted-foreground">Expert</p>
              </div>
            </div>
            <Badge className={`text-sm px-2 py-1 ${statusConfig.color} flex items-center`}>
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Session Date */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center bg-primary/10 rounded-md">
              <Calendar className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Session Date</p>
              <p className="text-base font-medium text-foreground">{formatDate(session.date)}</p>
            </div>
          </div>

          {/* Session Time */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center bg-primary/10 rounded-md">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Session Time</p>
              <p className="text-base font-medium text-foreground">{session.time}</p>
            </div>
          </div>

          {/* Notes */}
          {session.notes && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Notes</span>
              </div>
              <p className="text-sm text-muted-foreground italic line-clamp-3">{session.notes}</p>
            </div>
          )}

          {/* Button */}
          <div className="pt-2">
            <Button className="w-full h-10 rounded-lg">
              {isUpcoming ? (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Join Session
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  View Summary
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
