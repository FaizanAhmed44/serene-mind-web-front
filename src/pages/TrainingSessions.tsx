
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TrainingSessionCard } from '@/components/TrainingSessionCard';
import { useTrainingSessions } from '@/hooks/useTrainingSessions';
import { Calendar, Filter, Search } from 'lucide-react';
import { sampleTrainingSessions } from '@/data/trainingSessions';
const TrainingSessions: React.FC = () => {
  // const { trainingSessions, loadingTrainingSessions, trainingSessionsError} = useTrainingSessions();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // const sessions = trainingSessions?.data || [];
  // const totalSessions = trainingSessions?.count || 0;

  const filteredSessions = sampleTrainingSessions.filter(session => {
    const statusFilter = selectedStatus === 'all' || session.status === selectedStatus;
    const typeFilter = selectedType === 'all' || session.type === selectedType;
    return statusFilter && typeFilter;
  });

  const handleEnroll = (sessionId: string) => {
    console.log('Enrolling in session:', sessionId);
    // TODO: Implement enrollment logic
  };

  const statusOptions = [
    { value: 'all', label: 'All Sessions' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'online', label: 'Online' },
    { value: 'live', label: 'Live' },
  ];

  // if (loadingTrainingSessions) {
  //   return (
  //     <div className="p-6 space-y-6">
  //       <div className="animate-pulse space-y-4">
  //         <div className="h-8 bg-gray-200 rounded w-1/3"></div>
  //         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //           {[...Array(6)].map((_, i) => (
  //             <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
  //           ))}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (trainingSessionsError) {
  //   return (
  //     <div className="p-6">
  //       <Card className="border-red-200">
  //         <CardContent className="pt-6">
  //           <p className="text-red-600">Error loading training sessions. Please try again later.</p>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900">Training Sessions</h1>
        </div>
        <p className="text-gray-600">
          Join our expert-led training sessions to enhance your mental wellness journey
        </p>
      </div>

      {/* Stats Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Sessions Available</p>
              <p className="text-2xl font-bold text-primary">{10}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Filtered Results</p>
              <p className="text-xl font-semibold text-gray-900">{filteredSessions.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Filter Sessions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedStatus === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(option.value)}
                  className="h-8"
                >
                  {option.label}
                </Button>
              ))}
            </div>
            
            <Separator orientation="vertical" className="h-8" />
            
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700">Type:</span>
              {typeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedType === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(option.value)}
                  className="h-8"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sessions Grid */}
      {filteredSessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSessions.map((session) => (
            <TrainingSessionCard
              key={session.id}
              session={session}
              onEnroll={handleEnroll}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-2">
              <Search className="h-12 w-12 text-gray-400 mx-auto" />
              <h3 className="text-lg font-medium text-gray-900">No sessions found</h3>
              <p className="text-gray-600">
                Try adjusting your filters or check back later for new sessions.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainingSessions;
