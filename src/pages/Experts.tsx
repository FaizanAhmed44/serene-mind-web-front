import { useState } from "react";
import { Search, Star, Calendar, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const experts = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "Licensed Clinical Psychologist",
    specializations: ["Anxiety Disorders", "CBT", "Mindfulness"],
    rating: 4.9,
    reviews: 127,
    experience: "12+ years",
    verified: true,
    nextAvailable: "Tomorrow, 2:00 PM",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
    bio: "Specializes in cognitive behavioral therapy for anxiety and depression. Expert in mindfulness-based interventions.",
    sessionTypes: [
      { type: "One-on-One Therapy", duration: "50 min", price: "$120" },
      { type: "CBT Session", duration: "50 min", price: "$110" },
      { type: "Mindfulness Coaching", duration: "45 min", price: "$90" }
    ],
    availability: [
      { date: "Today", times: ["2:00 PM", "4:00 PM"] },
      { date: "Tomorrow", times: ["10:00 AM", "2:00 PM", "5:00 PM"] },
      { date: "Friday", times: ["9:00 AM", "1:00 PM", "3:00 PM"] }
    ]
  },
  {
    id: 2,
    name: "Mark Thompson",
    title: "Speech & Confidence Coach",
    specializations: ["Public Speaking", "Social Anxiety", "Confidence Building"],
    rating: 4.8,
    reviews: 89,
    experience: "8+ years",
    verified: true,
    nextAvailable: "Today, 4:30 PM",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    bio: "Former corporate trainer turned therapist, helping individuals overcome public speaking fears and build confidence.",
    sessionTypes: [
      { type: "Public Speaking Coaching", duration: "50 min", price: "$100" },
      { type: "Confidence Building", duration: "45 min", price: "$85" },
      { type: "Group Workshop", duration: "90 min", price: "$60" }
    ],
    availability: [
      { date: "Today", times: ["4:30 PM", "6:00 PM"] },
      { date: "Tomorrow", times: ["10:00 AM", "2:00 PM", "4:00 PM"] },
      { date: "Friday", times: ["9:00 AM", "11:00 AM", "3:00 PM"] }
    ]
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    title: "Behavioral Therapist",
    specializations: ["Decision Making", "Life Transitions", "Career Counseling"],
    rating: 4.9,
    reviews: 156,
    experience: "15+ years",
    verified: true,
    nextAvailable: "Friday, 10:00 AM",
    photo: "https://images.unsplash.com/photo-1594824248015-88379cfb1b0e?w=300&h=300&fit=crop&crop=face",
    bio: "Helps individuals navigate major life decisions and career transitions with evidence-based therapeutic approaches.",
    sessionTypes: [
      { type: "Life Coaching", duration: "60 min", price: "$130" },
      { type: "Career Counseling", duration: "50 min", price: "$115" },
      { type: "Decision Support", duration: "45 min", price: "$95" }
    ],
    availability: [
      { date: "Today", times: ["3:00 PM"] },
      { date: "Tomorrow", times: ["9:00 AM", "1:00 PM"] },
      { date: "Friday", times: ["10:00 AM", "2:00 PM", "4:00 PM"] }
    ]
  },
  {
    id: 4,
    name: "Dr. Michael Rodriguez",
    title: "Clinical Psychiatrist",
    specializations: ["Depression", "Mood Disorders", "Medication Management"],
    rating: 4.9,
    reviews: 203,
    experience: "18+ years",
    verified: true,
    nextAvailable: "Monday, 9:00 AM",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
    bio: "Board-certified psychiatrist specializing in treatment-resistant depression and comprehensive mental health care.",
    sessionTypes: [
      { type: "Psychiatric Consultation", duration: "60 min", price: "$150" },
      { type: "Medication Review", duration: "30 min", price: "$75" },
      { type: "Therapy Session", duration: "50 min", price: "$125" }
    ],
    availability: [
      { date: "Tomorrow", times: ["11:00 AM"] },
      { date: "Friday", times: ["9:00 AM", "2:00 PM"] },
      { date: "Monday", times: ["9:00 AM", "11:00 AM", "3:00 PM"] }
    ]
  }
];

const specializations = ["All", "Anxiety Disorders", "CBT", "Public Speaking", "Depression", "Life Transitions"];

const BookingDialog = ({ expert, onBookingConfirmed }: { expert: any, onBookingConfirmed: () => void }) => {
  const [selectedSessionType, setSelectedSessionType] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleBookSession = () => {
    if (!selectedSessionType || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select session type, date, and time.",
        variant: "destructive",
      });
      return;
    }

    const selectedSession = expert.sessionTypes.find((session: any) => session.type === selectedSessionType);
    
    toast({
      title: "Session Booked Successfully!",
      description: `${selectedSession?.type} with ${expert.name} on ${selectedDate} at ${selectedTime}`,
    });

    // Reset form
    setSelectedSessionType("");
    setSelectedDate("");
    setSelectedTime("");
    setMessage("");
    setIsOpen(false);
    onBookingConfirmed();
  };

  const selectedSession = expert.sessionTypes.find((session: any) => session.type === selectedSessionType);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex-1">Book Session</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book Session with {expert.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Session Type</label>
            <Select value={selectedSessionType} onValueChange={setSelectedSessionType}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a session type" />
              </SelectTrigger>
              <SelectContent>
                {expert.sessionTypes.map((session: any) => (
                  <SelectItem key={session.type} value={session.type}>
                    {session.type} - {session.duration} - {session.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Select Date</label>
            <Select value={selectedDate} onValueChange={(value) => {
              setSelectedDate(value);
              setSelectedTime(""); // Reset time when date changes
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a date" />
              </SelectTrigger>
              <SelectContent>
                {expert.availability.map((day: any) => (
                  <SelectItem key={day.date} value={day.date}>
                    {day.date}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedDate && (
            <div>
              <label className="text-sm font-medium mb-2 block">Select Time</label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent>
                  {expert.availability
                    .find((day: any) => day.date === selectedDate)?.times
                    .map((time: string) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium mb-2 block">Message (Optional)</label>
            <Textarea
              placeholder="Briefly describe what you'd like to work on..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {selectedSession && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">{selectedSession.type}</p>
              <p className="text-sm text-muted-foreground">{selectedSession.duration} - {selectedSession.price}</p>
            </div>
          )}
          
          <Button 
            className="w-full" 
            onClick={handleBookSession}
            disabled={!selectedSessionType || !selectedDate || !selectedTime}
          >
            Confirm Booking {selectedSession ? `- ${selectedSession.price}` : ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Experts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expert.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSpecialization = selectedSpecialization === "All" || 
                                 expert.specializations.includes(selectedSpecialization);
    return matchesSearch && matchesSpecialization;
  });

  const handleBookingConfirmed = () => {
    // Could add additional logic here if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4">
          <SidebarTrigger />
          <div className="flex-1 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search experts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="text-center py-4 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Mental Wellness Experts
          </h1>
          <p className="text-lg text-muted-foreground">
            Connect with verified therapists and coaches for personalized support
          </p>
        </div>

        {/* Specialization Filters */}
        <div className="flex flex-wrap gap-2 justify-center animate-slide-up">
          {specializations.map((specialization) => (
            <Button
              key={specialization}
              variant={selectedSpecialization === specialization ? "default" : "outline"}
              onClick={() => setSelectedSpecialization(specialization)}
              className="transition-all"
            >
              {specialization}
            </Button>
          ))}
        </div>

        {/* Experts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map((expert) => (
            <Card key={expert.id} className="hover-lift cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto mb-4">
                  <img
                    src={expert.photo}
                    alt={expert.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto group-hover:scale-105 transition-transform duration-300"
                  />
                  {expert.verified && (
                    <CheckCircle className="absolute -bottom-1 -right-1 h-6 w-6 text-primary bg-background rounded-full" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{expert.name}</h3>
                <p className="text-muted-foreground">{expert.title}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {expert.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{expert.rating}</span>
                    <span className="text-muted-foreground">({expert.reviews} reviews)</span>
                  </div>
                  <span className="text-muted-foreground">{expert.experience}</span>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2">{expert.bio}</p>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Next available: {expert.nextAvailable}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link to={`/experts/${expert.id}`}>View Profile</Link>
                  </Button>
                  <BookingDialog expert={expert} onBookingConfirmed={handleBookingConfirmed} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experts;
