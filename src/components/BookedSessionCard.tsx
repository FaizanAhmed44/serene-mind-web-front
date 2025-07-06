
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Calendar, Clock, CheckCircle, Clock4, FileText, Video, MessageCircle, Star, MapPin, Shield } from 'lucide-react';
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="h-full"
    >
      <Card className="group h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status indicator bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${isUpcoming ? 'from-amber-400 to-amber-500' : 'from-green-400 to-green-500'}`} />
        
        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-start justify-between gap-4">
            {/* Expert info section */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="relative">
                <Avatar className="w-20 h-20 border-3 border-white shadow-lg">
                  <AvatarImage 
                    src={session.avatar} 
                    alt={session.expertName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-xl">
                    {getInitials(session.expertName)}
                  </AvatarFallback>
                </Avatar>
                {/* Online status indicator */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-3 border-white shadow-sm" />
                {/* Verified badge */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-md">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <CardTitle className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors duration-200 truncate">
                  {session.expertName}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1 font-medium">Mental Health Expert</p>
                
                {/* Rating and experience */}
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-700">4.9</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">5+ years exp</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Status badge */}
            <Badge 
              variant="outline" 
              className={`${statusConfig.color} font-semibold shrink-0 px-4 py-2 text-sm border-0 shadow-sm`}
            >
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative z-10">
          {/* Session details in expert card style */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">Session Date</p>
                  <p className="font-bold text-blue-900 text-sm">{formatDate(session.date)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-4 rounded-2xl border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-md">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide">Time</p>
                  <p className="font-bold text-purple-900 text-sm">{session.time}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Session notes */}
          {session.notes && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 p-5 rounded-2xl border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center mt-0.5">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">Session Notes</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {session.notes}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons inspired by expert card */}
          <div className="flex gap-3 pt-2">
            {isUpcoming ? (
              <>
                <Button 
                  className="flex-1 h-12 font-semibold text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl"
                  size="lg"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Join Session
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="h-12 px-5 border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 rounded-2xl"
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Button 
                variant="outline"
                className="w-full h-12 font-semibold text-base border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 rounded-2xl"
                size="lg"
              >
                <FileText className="w-5 h-5 mr-2" />
                View Session Summary
              </Button>
            )}
          </div>

          {/* Specializations tags */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded-full">
              Anxiety
            </Badge>
            <Badge variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20 px-3 py-1 rounded-full">
              Depression
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-full">
              Therapy
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
