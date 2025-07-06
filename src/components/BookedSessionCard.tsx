
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Calendar, Clock, CheckCircle, Clock4 } from 'lucide-react';
import { BookedSession } from '@/data/types/bookedSession';

interface BookedSessionCardProps {
  session: BookedSession;
}

export const BookedSessionCard: React.FC<BookedSessionCardProps> = ({ session }) => {
  const isUpcoming = session.status === 'upcoming';
  
  return (
    <Card className="group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">
                {session.expertName}
              </h3>
              <div className="flex items-center mt-1">
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  isUpcoming 
                    ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                    : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  {isUpcoming ? (
                    <Clock4 className="w-3 h-3 mr-1" />
                  ) : (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  )}
                  {isUpcoming ? 'Upcoming' : 'Completed'}
                </div>
              </div>
            </div>
          </div>
          
          {isUpcoming && (
            <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200">
              Join Session
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-3 text-gray-400" />
            <span className="text-sm font-medium">{session.date}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-3 text-gray-400" />
            <span className="text-sm font-medium">{session.time}</span>
          </div>
          
          {session.notes && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border-l-4 border-primary/20">
              <p className="text-sm text-gray-700">
                <span className="font-medium text-gray-900">Notes: </span>
                {session.notes}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
