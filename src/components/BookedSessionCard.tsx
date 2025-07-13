
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, FileText, Video, CheckCircle, Clock4, DollarSign, CreditCard, User } from 'lucide-react';
import { BookedSession } from '@/data/types/bookedSession';

interface BookedSessionCardProps {
  session: BookedSession;
}

export const BookedSessionCard: React.FC<BookedSessionCardProps> = ({ session }) => {
  const isUpcoming = session.status === 'upcoming';

  const statusConfig = isUpcoming
    ? {
        color: 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-200',
        icon: <Clock4 className="w-4 h-4 mr-2" />,
        label: 'Upcoming'
      }
    : {
        color: 'bg-gradient-to-r from-green-50 to-emerald-100 text-green-800 border-green-200',
        icon: <CheckCircle className="w-4 h-4 mr-2" />,
        label: 'Completed'
      };

  const paymentStatusConfig = {
    PENDING: { 
      color: 'bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-800 border-yellow-200', 
      label: 'Payment Pending' 
    },
    PAID: { 
      color: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border-green-200', 
      label: 'Paid' 
    },
    FAILED: { 
      color: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border-red-200', 
      label: 'Payment Failed' 
    },
  }[session.paymentStatus as keyof typeof paymentStatusConfig] || {
    color: 'bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200',
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
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="group h-full border-0 shadow-lg hover:shadow-2xl bg-white relative overflow-hidden transition-all duration-300">
        {/* Gradient Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 pointer-events-none" />
        
        {/* Header Section */}
        <CardHeader className="pb-6 relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-white shadow-xl ring-2 ring-primary/10">
                  <AvatarImage src={session.avatar} alt={session.expertName} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-lg">
                    {getInitials(session.expertName)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                  <User className="w-3 h-3 text-primary" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-1 truncate">
                  {session.expertName}
                </CardTitle>
                <p className="text-sm text-muted-foreground font-medium mb-3">Mental Health Expert</p>
                <Badge className={`text-xs px-3 py-1.5 font-semibold ${statusConfig.color} shadow-sm`}>
                  {statusConfig.icon}
                  {statusConfig.label}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-6 relative z-10">
          {/* Session Details Grid */}
          <div className="grid grid-cols-1 gap-4">
            {/* Date & Time Row */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-4 border border-slate-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Session Date</span>
                      <p className="text-sm font-bold text-gray-900 leading-tight">
                        {formatDate(session.date)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Time</span>
                      <p className="text-sm font-bold text-gray-900">
                        {session.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Payment Information */}
          <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl p-5 border border-emerald-100 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              Payment Details
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm text-gray-700 font-medium">Session Price</span>
                </div>
                <span className="text-xl font-bold text-gray-900">${session.sessionPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 font-medium">Payment Status</span>
                <Badge className={`text-xs px-3 py-1.5 ${paymentStatusConfig.color} font-semibold shadow-sm`}>
                  {paymentStatusConfig.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* Session Name */}
          <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 rounded-2xl p-4 border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900">Session Type</span>
            </div>
            <p className="text-sm font-semibold text-gray-800 bg-white px-3 py-2 rounded-lg border border-indigo-100 shadow-sm">
              {session.sessionName}
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Button className="w-full h-14 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white border-0">
              {isUpcoming ? (
                <>
                  <Video className="w-5 h-5 mr-3" />
                  Join Session
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-3" />
                  View Summary
                </>
              )}
            </Button>
          </div>
        </CardContent>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-secondary/10 to-transparent rounded-tr-full pointer-events-none" />
      </Card>
    </motion.div>
  );
};
