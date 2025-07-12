

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, FileText, Video, CheckCircle, Clock4, DollarSign, Tag, CreditCard } from 'lucide-react';
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

  const paymentStatusConfig = {
    PENDING: { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', label: 'Pending' },
    PAID: { color: 'bg-green-50 text-green-700 border-green-200', label: 'Paid' },
    FAILED: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Failed' },
  }[session.paymentStatus as keyof typeof paymentStatusConfig] || {
    color: 'bg-gray-50 text-gray-700 border-gray-200',
    label: 'Unknown'
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
      <Card className="group h-full border shadow-sm bg-gradient-to-br from-background to-muted/10 relative overflow-hidden">
        {/* Header Section */}
        <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-primary/20 shadow-md">
                <AvatarImage src={session.avatar} alt={session.expertName} className="object-cover" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                  {getInitials(session.expertName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl font-bold text-foreground">{session.expertName}</CardTitle>
                <p className="text-sm text-muted-foreground font-medium">Expert Session</p>
                {/* <div className="flex items-center gap-2 mt-1">
                  <Tag className="w-3 h-3 text-primary" />
                  <span className="text-sm text-primary font-medium">{session.sessionName}</span>
                </div> */}
              </div>
            </div>
            <Badge className={`text-sm px-3 py-1.5 font-medium ${statusConfig.color} flex items-center shadow-sm`}>
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Session Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Date</span>
              </div>
              <p className="text-sm font-semibold text-foreground pl-10 leading-relaxed">
                {formatDate(session.date)}
              </p>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Time</span>
              </div>
              <p className="text-sm font-semibold text-foreground pl-10">
                {session.time}
              </p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Payment Information */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              Payment Information
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Session Price</span>
              </div>
              <span className="text-lg font-bold text-foreground">${session.sessionPrice}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Payment Status</span>
              <Badge className={`text-xs px-2 py-1 ${paymentStatusConfig.color} font-medium`}>
                {paymentStatusConfig.label}
              </Badge>
            </div>
          </div>

          {/* Session Name*/}
          <div className="bg-muted/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Session Name</span>
            </div>
            <p className="text-xs font-mono text-foreground bg-background px-2 py-1 rounded border">
              {session.sessionName}
            </p>
          </div>

          

          {/* Action Button */}
          <div className="pt-2">
            <Button className="w-full h-12 rounded-xl font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200">
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

        {/* Subtle decorative element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full pointer-events-none" />
      </Card>
    </motion.div>
  );
};

// import React from 'react';
// import { motion } from 'framer-motion';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Calendar, Clock, FileText, Video, CheckCircle, Clock4 } from 'lucide-react';
// import { BookedSession } from '@/data/types/bookedSession';

// interface BookedSessionCardProps {
//   session: BookedSession;
// }

// export const BookedSessionCard: React.FC<BookedSessionCardProps> = ({ session }) => {
//   const isUpcoming = session.status === 'upcoming';

//   const statusConfig = isUpcoming
//     ? {
//         color: 'bg-amber-50 text-amber-700 border-amber-200',
//         icon: <Clock4 className="w-4 h-4 mr-1.5" />,
//         label: 'Upcoming'
//       }
//     : {
//         color: 'bg-green-50 text-green-700 border-green-200',
//         icon: <CheckCircle className="w-4 h-4 mr-1.5" />,
//         label: 'Completed'
//       };

//   const formatDate = (dateStr: string) =>
//     new Date(dateStr).toLocaleDateString('en-US', {
//       weekday: 'long',
//       month: 'long',
//       day: 'numeric',
//       year: 'numeric'
//     });

//   const getInitials = (name: string) =>
//     name
//       .split(' ')
//       .map((n) => n[0])
//       .join('')
//       .toUpperCase();

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       whileHover={{ scale: 1.01 }}
//       transition={{ duration: 0.3 }}
//       className="h-full"
//     >
//       <Card className="group h-full border shadow-sm bg-gradient-to-br from-background to-muted/10 relative">
//         <CardHeader className="pb-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Avatar className="w-14 h-14 border border-primary/10 shadow">
//                 <AvatarImage src={session.avatar} alt={session.expertName} className="object-cover" />
//                 <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
//                   {getInitials(session.expertName)}
//                 </AvatarFallback>
//               </Avatar>
//               <div>
//                 <CardTitle className="text-lg font-semibold text-foreground">{session.expertName}</CardTitle>
//                 <p className="text-xs text-muted-foreground">Expert</p>
//               </div>
//             </div>
//             <Badge className={`text-sm px-2 py-1 ${statusConfig.color} flex items-center`}>
//               {statusConfig.icon}
//               {statusConfig.label}
//             </Badge>
//           </div>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 flex items-center justify-center bg-primary/10 rounded-md">
//               <Calendar className="w-4 h-4 text-primary" />
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Session Date</p>
//               <p className="text-base font-medium text-foreground">{formatDate(session.date)}</p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3">
//             <div className="w-9 h-9 flex items-center justify-center bg-primary/10 rounded-md">
//               <Clock className="w-4 h-4 text-primary" />
//             </div>
//             <div>
//               <p className="text-sm text-muted-foreground">Session Time</p>
//               <p className="text-base font-medium text-foreground">{session.time}</p>
//             </div>
//           </div>

//           {session.sessionPrice && (
//             <div>
//               <div className="flex items-center gap-2 mb-1">
//                 <FileText className="w-4 h-4 text-primary" />
//                 <span className="text-sm font-medium text-foreground">Notes</span>
//               </div>
//               <p className="text-sm text-muted-foreground italic line-clamp-3">{session.sessionName}</p>
//             </div>
//           )}

//           <div className="pt-2">
//             <Button className="w-full h-10 rounded-lg">
//               {isUpcoming ? (
//                 <>
//                   <Video className="w-4 h-4 mr-2" />
//                   Join Session
//                 </>
//               ) : (
//                 <>
//                   <FileText className="w-4 h-4 mr-2" />
//                   View Summary
//                 </>
//               )}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </motion.div>
//   );
// };