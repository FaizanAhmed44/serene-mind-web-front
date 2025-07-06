
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookedSessionCard } from '@/components/BookedSessionCard';
import { BookedSession } from '@/data/types/bookedSession';

const dummyBookedSessions: BookedSession[] = [
  {
    id: '1',
    expertName: 'Dr. Ayesha Khan',
    date: 'July 10, 2025',
    time: '3:00 PM',
    status: 'upcoming',
    notes: 'Feeling depressed due to work stress and need guidance on coping mechanisms'
  },
  {
    id: '2',
    expertName: 'Dr. Ali Hamza',
    date: 'June 20, 2025',
    time: '12:00 PM',
    status: 'completed',
    notes: 'Discussion about anxiety management techniques'
  },
  {
    id: '3',
    expertName: 'Dr. Sana Fatima',
    date: 'July 8, 2025',
    time: '5:30 PM',
    status: 'completed'
  },
  {
    id: '4',
    expertName: 'Dr. Hamna Qureshi',
    date: 'July 15, 2025',
    time: '10:00 AM',
    status: 'upcoming',
    notes: 'Follow-up session for stress management and goal setting'
  }
];

const BookedSessions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  const upcomingSessions = dummyBookedSessions.filter(session => session.status === 'upcoming');
  const pastSessions = dummyBookedSessions.filter(session => session.status === 'completed');

  const getSessionsForTab = (tab: string) => {
    switch (tab) {
      case 'upcoming':
        return upcomingSessions;
      case 'past':
        return pastSessions;
      default:
        return dummyBookedSessions;
    }
  };

  const renderEmptyState = (message: string) => (
    <div className="text-center py-16">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      <p className="text-gray-500 text-lg font-medium">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Booked Sessions
          </h1>
          <p className="text-gray-600 text-lg">
            Manage and track your one-on-one sessions with experts
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{dummyBookedSessions.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Upcoming</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{upcomingSessions.length}</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Completed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{pastSessions.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-gray-100 rounded-lg p-1">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
            >
              All ({dummyBookedSessions.length})
            </TabsTrigger>
            <TabsTrigger 
              value="upcoming"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
            >
              Upcoming ({upcomingSessions.length})
            </TabsTrigger>
            <TabsTrigger 
              value="past"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium"
            >
              Past ({pastSessions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {dummyBookedSessions.length > 0 ? (
              <div className="grid gap-6">
                {dummyBookedSessions.map((session) => (
                  <BookedSessionCard key={session.id} session={session} />
                ))}
              </div>
            ) : (
              renderEmptyState("No sessions found")
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingSessions.length > 0 ? (
              <div className="grid gap-6">
                {upcomingSessions.map((session) => (
                  <BookedSessionCard key={session.id} session={session} />
                ))}
              </div>
            ) : (
              renderEmptyState("No upcoming sessions")
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {pastSessions.length > 0 ? (
              <div className="grid gap-6">
                {pastSessions.map((session) => (
                  <BookedSessionCard key={session.id} session={session} />
                ))}
              </div>
            ) : (
              renderEmptyState("No past sessions")
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BookedSessions;
