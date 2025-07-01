import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Calendar, Clock, CheckCircle, MessageSquare, Video, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useExpert } from "@/hooks/useExperts";
import BookingModal from "@/components/BookingModal";
const ExpertProfile = () => {
  const { id } = useParams();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const { data: expert, isLoading, error } = useExpert(id || "");
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-foreground">Expert Profile</h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-muted-foreground">Loading expert profile...</p>
        </div>
      </div>
    );
  }

  if (error || !expert) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-foreground">Expert Profile</h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-destructive">Expert not found. Please try again.</p>
        </div>
      </div>
    );
  }

  // Transform expert data to match BookingModal expectations
  const bookingExpert = {
    id: parseInt(expert.id.replace(/-/g, '').substring(0, 8), 16), // Convert UUID to number for BookingModal
    name: expert.name,
    title: expert.title,
    photo: expert.photo,
    sessionTypes: expert.sessionTypes,
    availability: expert.availability,
  };

  console.log(bookingExpert);
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-foreground">Expert Profile</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Expert Header */}
        <Card className="animate-fade-in">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center lg:text-left">
                <div className="relative inline-block mb-4">
                  <img
                    src={expert.photo}
                    alt={expert.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto lg:mx-0"
                  />
                  {expert.verified && (
                    <CheckCircle className="absolute -bottom-2 -right-2 h-8 w-8 text-primary bg-background rounded-full" />
                  )}
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{expert.name}</h1>
                <p className="text-lg text-muted-foreground mb-4">{expert.title}</p>
                <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{expert.rating}</span>
                    <span className="text-muted-foreground">({expert.reviews} reviews)</span>
                  </div>
                  <span className="text-muted-foreground">{expert.experience}</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                  {expert.specializations.map((spec: string) => (
                    <Badge key={spec} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
                
                {/* Prominent Book Now Button */}
                <Button 
                  size="lg" 
                  className="w-full lg:w-auto px-8 py-3 text-lg"
                  onClick={() => setIsBookingModalOpen(true)}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Now
                </Button>
              </div>
              
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">About</h3>
                  <p className="text-muted-foreground leading-relaxed">{expert.bio}</p>
                </div>
                
                {expert.credentials && expert.credentials.length > 0 && (
  <div>
    <h3 className="text-xl font-semibold text-foreground mb-3">Education & Credentials</h3>
    <ul className="space-y-2">
      {expert.credentials.map((cred, index) => (
        <li key={index} className="flex items-center space-x-2">
          <Award className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">{cred}</span>
        </li>
      ))}
    </ul>
  </div>
)}

               
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Types */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5 text-primary" />
                <span>Session Types</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {expert.sessionTypes.map((session: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-foreground">{session.type}</h4>
                    <p className="text-sm text-muted-foreground">{session.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{session.price}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Availability */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>Availability</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {expert.availability.map((day: any) => (
                <div key={day.date} className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">{day.date}</h4>
                  <div className="flex flex-wrap gap-2">
                    {day.times.map((time: string) => (
                      <Badge key={time} variant="outline" className="text-sm">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <span>Recent Reviews</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                name: "Sarah M.",
                rating: 5,
                comment: "Mark helped me overcome my fear of public speaking completely. His approach is practical and encouraging.",
                date: "2 weeks ago"
              },
              {
                name: "John D.",
                rating: 5,
                comment: "Excellent coach! Saw immediate improvement in my confidence after just a few sessions.",
                date: "1 month ago"
              }
            ].map((review, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-foreground">{review.name}</h4>
                  <div className="flex items-center space-x-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mb-2">{review.comment}</p>
                <span className="text-sm text-muted-foreground">{review.date}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Booking Modal */}
      {/* <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        expert={bookingExpert}
        sessionId={expert.sessionTypes[0].session_id}
        /> */}
    </div>
  );
};

export default ExpertProfile;
