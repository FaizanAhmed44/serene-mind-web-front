import { useState } from "react";
import { useParams } from "react-router-dom";
import { Star, Calendar, Clock, CheckCircle, MessageSquare, Video, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/UserAvatar";

const ExpertProfile = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [message, setMessage] = useState("");

  // This would normally come from an API
  const expert = {
    id: 2,
    name: "Mark Thompson",
    title: "Speech & Confidence Coach",
    specializations: ["Public Speaking", "Social Anxiety", "Confidence Building"],
    rating: 4.8,
    reviews: 89,
    experience: "8+ years",
    verified: true,
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    bio: "Former corporate trainer turned therapist, helping individuals overcome public speaking fears and build confidence. Mark combines evidence-based therapeutic techniques with practical presentation skills to help clients excel in professional and personal speaking situations.",
    education: [
      "M.A. Clinical Psychology - Stanford University",
      "B.A. Communications - UC Berkeley",
      "Certified CBT Therapist"
    ],
    sessionTypes: [
      { type: "One-on-One Therapy", duration: "50 min", price: "$120" },
      { type: "Public Speaking Coaching", duration: "50 min", price: "$100" },
      { type: "Group Workshop", duration: "90 min", price: "$60" }
    ],
    availability: [
      { date: "Today", times: ["4:30 PM", "6:00 PM"] },
      { date: "Tomorrow", times: ["10:00 AM", "2:00 PM", "4:00 PM"] },
      { date: "Friday", times: ["9:00 AM", "11:00 AM", "3:00 PM", "5:00 PM"] }
    ]
  };

  const handleBookSession = () => {
    // This would handle the booking logic
    console.log("Booking session:", { selectedDate, selectedTime, message });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold text-foreground">{expert?.name}</h1>
          <UserAvatar />
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
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                  {expert.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">About</h3>
                  <p className="text-muted-foreground leading-relaxed">{expert.bio}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">Education & Credentials</h3>
                  <ul className="space-y-2">
                    {expert.education.map((edu, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">{edu}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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
              {expert.sessionTypes.map((session, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-foreground">{session.type}</h4>
                    <p className="text-sm text-muted-foreground">{session.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{session.price}</p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" className="mt-2">Book Now</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Book {session.type}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Select Date</label>
                            <Select value={selectedDate} onValueChange={setSelectedDate}>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose a date" />
                              </SelectTrigger>
                              <SelectContent>
                                {expert.availability.map((day) => (
                                  <SelectItem key={day.date} value={day.date}>
                                    {day.date}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {selectedDate && (
                            <div>
                              <label className="text-sm font-medium">Select Time</label>
                              <Select value={selectedTime} onValueChange={setSelectedTime}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a time" />
                                </SelectTrigger>
                                <SelectContent>
                                  {expert.availability
                                    .find(day => day.date === selectedDate)?.times
                                    .map((time) => (
                                      <SelectItem key={time} value={time}>
                                        {time}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          
                          <div>
                            <label className="text-sm font-medium">Message (Optional)</label>
                            <Textarea
                              placeholder="Briefly describe what you'd like to work on..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          
                          <Button 
                            className="w-full" 
                            onClick={handleBookSession}
                            disabled={!selectedDate || !selectedTime}
                          >
                            Confirm Booking - {session.price}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
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
              {expert.availability.map((day) => (
                <div key={day.date} className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">{day.date}</h4>
                  <div className="flex flex-wrap gap-2">
                    {day.times.map((time) => (
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
    </div>
  );
};

export default ExpertProfile;
