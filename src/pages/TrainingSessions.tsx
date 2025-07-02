
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TrainingSessionCard } from '@/components/TrainingSessionCard';
import { useTrainingSessions } from '@/hooks/useTrainingSessions';
import { Calendar, Filter, Search, TrendingUp } from 'lucide-react';
import { sampleTrainingSessions } from '@/data/trainingSessions';

const TrainingSessions: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredSessions = sampleTrainingSessions.filter(session => {
    const statusFilter = selectedStatus === 'all' || session.status === selectedStatus;
    const typeFilter = selectedType === 'all' || session.type === selectedType;
    return statusFilter && typeFilter;
  });

  const handleEnroll = (sessionId: string) => {
    console.log('Enrolling in session:', sessionId);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Training Sessions</h1>
              <p className="text-muted-foreground mt-1 text-lg">
                Join expert-led sessions to enhance your mental wellness journey
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Sessions</p>
                  <p className="text-3xl font-bold text-primary mt-2">{sampleTrainingSessions.length}</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-secondary/5 to-secondary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Available Now</p>
                  <p className="text-3xl font-bold text-secondary mt-2">{filteredSessions.length}</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/10">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-accent/5 to-accent/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Completion Rate</p>
                  <p className="text-3xl font-bold text-accent mt-2">94%</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10">
                  <Search className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-semibold">Filter Sessions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex flex-wrap gap-3">
                <span className="text-sm font-medium text-muted-foreground flex items-center">Status:</span>
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedStatus === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(option.value)}
                    className="h-9 px-4 rounded-full transition-all duration-200"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              
              <Separator orientation="vertical" className="h-9 hidden lg:block" />
              
              <div className="flex flex-wrap gap-3">
                <span className="text-sm font-medium text-muted-foreground flex items-center">Type:</span>
                {typeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedType === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(option.value)}
                    className="h-9 px-4 rounded-full transition-all duration-200"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <TrainingSessionCard
                key={session.id}
                session={session}
                onEnroll={handleEnroll}
              />
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">No sessions found</h3>
                  <p className="text-muted-foreground max-w-md">
                    Try adjusting your filters or check back later for new sessions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TrainingSessions;
