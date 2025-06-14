
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, User, FileText, RotateCcw, X, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const SessionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  // Mock session data - in real app, this would come from API
  const session = {
    id: "SESS-2024-001",
    bookingRef: "BK-7829",
    expert: {
      name: "Dr. Sarah Johnson",
      title: "Licensed Clinical Psychologist",
      specialization: "Anxiety Disorders & CBT",
      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face"
    },
    date: "Friday, June 21, 2024",
    time: "2:00 PM - 3:00 PM PST",
    duration: "60 minutes",
    notes: "I'd like to work on managing workplace anxiety and develop better coping strategies.",
    status: "confirmed",
    meetingLink: "https://corecognitive.com/session/join/SESS-2024-001"
  };

  const handleReschedule = () => {
    toast({
      title: "Reschedule Request Sent",
      description: "Dr. Sarah Johnson will contact you within 24 hours to confirm new timing.",
    });
    setIsRescheduleOpen(false);
  };

  const handleCancel = () => {
    toast({
      title: "Session Cancelled",
      description: "Your session has been cancelled. Refund will be processed within 3-5 business days.",
    });
    setIsCancelOpen(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-foreground">Session Details</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {/* Success Message */}
        <Card className="border-primary/20 bg-primary/5 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-8 w-8 text-primary" />
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Your 1-on-1 session has been successfully booked!
                </h2>
                <p className="text-muted-foreground mt-1">
                  We've sent a confirmation email with all the details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Session Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Expert Information */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Your Therapist</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <img
                    src={session.expert.photo}
                    alt={session.expert.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {session.expert.name}
                    </h3>
                    <p className="text-muted-foreground">{session.expert.title}</p>
                    <Badge variant="secondary" className="mt-2">
                      {session.expert.specialization}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Session Information */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Session Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">Date</span>
                    </div>
                    <p className="font-semibold text-foreground">{session.date}</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">Time</span>
                    </div>
                    <p className="font-semibold text-foreground">{session.time}</p>
                  </div>
                </div>
                
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">Duration</span>
                  </div>
                  <p className="font-semibold text-foreground">{session.duration}</p>
                </div>

                {session.notes && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">Your Notes</span>
                    </div>
                    <p className="text-foreground">{session.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Panel */}
          <div className="space-y-6">
            {/* Booking Reference */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="text-lg">Booking Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{session.bookingRef}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Keep this for your records
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="animate-slide-up">
              <CardHeader>
                <CardTitle className="text-lg">Manage Session</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Reschedule Dialog */}
                <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reschedule Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reschedule Session</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        To reschedule your session, we'll send a request to {session.expert.name}. 
                        They will contact you within 24 hours to confirm new timing.
                      </p>
                      <div className="flex space-x-2">
                        <Button onClick={handleReschedule} className="flex-1">
                          Send Reschedule Request
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsRescheduleOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Cancel Dialog */}
                <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <X className="h-4 w-4 mr-2" />
                      Cancel Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel Session</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Are you sure you want to cancel your session with {session.expert.name}? 
                        This action cannot be undone, but you can book a new session anytime.
                      </p>
                      <div className="flex space-x-2">
                        <Button 
                          variant="destructive" 
                          onClick={handleCancel}
                          className="flex-1"
                        >
                          Yes, Cancel Session
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsCancelOpen(false)}
                          className="flex-1"
                        >
                          Keep Session
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button 
                  className="w-full mt-4" 
                  onClick={() => window.open(session.meetingLink, '_blank')}
                >
                  Join Session (Available 15 min before)
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="animate-slide-up">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">Need help?</p>
                <Button variant="link" className="p-0 h-auto">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetails;
