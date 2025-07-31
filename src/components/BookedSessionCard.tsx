import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, FileText, Video, CheckCircle, Clock4, DollarSign, User } from 'lucide-react';
import { BookedSession } from '@/data/types/bookedSession';

interface BookedSessionCardProps {
  session: BookedSession;
}

export const BookedSessionCard: React.FC<BookedSessionCardProps> = ({ session }) => {
  const isUpcoming = session.status === 'upcoming';

  const statusConfig = isUpcoming
    ? {
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: <Clock4 className="w-4 h-4 mr-2" />,
        label: 'Upcoming'
      }
    : {
        color: 'bg-green-50 text-green-700 border-green-200',
        icon: <CheckCircle className="w-4 h-4 mr-2" />,
        label: 'Completed'
      };

  const paymentStatusConfig = {
    PENDING: { 
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200', 
      label: 'Payment Pending' 
    },
    PAID: { 
      color: 'bg-green-50 text-green-700 border-green-200', 
      label: 'Paid' 
    },
    FAILED: { 
      color: 'bg-red-50 text-red-700 border-red-200', 
      label: 'Payment Failed' 
    },
  }[session.paymentStatus as keyof typeof paymentStatusConfig] || {
    color: 'bg-gray-50 text-gray-600 border-gray-200',
    label: 'Unknown Status'
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
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="group h-full border border-border shadow-sm hover:shadow-md bg-card transition-all duration-200">
        {/* Header Section */}
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="w-16 h-16 border-2 border-muted">
                <AvatarImage src={session.avatar} alt={session.expertName} className="object-cover" />
                <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                  {getInitials(session.expertName)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-background rounded-full flex items-center justify-center border border-border">
                <User className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-foreground mb-1 truncate">
                {session.expertName}
              </CardTitle>
              <p className="text-sm text-muted-foreground mb-3">Mental Health Expert</p>
              <Badge className={`text-xs px-2 py-1 font-medium ${statusConfig.color}`}>
                {statusConfig.icon}
                {statusConfig.label}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-5">
          {/* Date & Time */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Date</span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {formatDate(session.date)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wide">Time</span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {session.time}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              Payment Details
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Session Price</span>
                <span className="text-lg font-bold text-foreground">${session.sessionPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={`text-xs px-2 py-1 ${paymentStatusConfig.color}`}>
                  {paymentStatusConfig.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Session Type */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-semibold">Session Type</span>
            </div>
            <p className="text-sm text-foreground bg-muted/50 px-3 py-2 rounded-md">
              {session.sessionName}
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2">
          <button
  className="w-full py-2 px-4 bg-gradient-to-r from-primary to-primary/70 text-white font-semibold rounded-lg shadow-md hover:from-primary hover:to-primary/90 focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-all duration-200"
  type="button"
>
  {isUpcoming ? (
    <>
      <Video className="w-4 h-4 inline-block mr-4" />
      Join Session
    </>
  ) : (
    <>
      <FileText className="w-4 h-4 inline-block mr-4" />
      View Summary
    </>
  )}
</button>

          
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};