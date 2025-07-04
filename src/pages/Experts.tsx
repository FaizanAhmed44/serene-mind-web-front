import { useState } from "react";
import { Search, Star, Calendar, CheckCircle, BadgeCheck, Award, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ExpertsAPI } from "@/api/experts";
import { ExpertProfile } from "@/data/types/expert";

// const specializations = ["All", "Anxiety Disorders", "CBT", "Public Speaking", "Depression", "Life Transitions"];

const BookingDialog = ({
  expert,
  onBookingConfirmed,
}: {
  expert: any;
  onBookingConfirmed: () => void;
}) => {
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

    // const selectedSession = expert.sessionTypes.find((session: any) => session.type === selectedSessionType);

    // toast({
    //   title: "Session Booked Successfully!",
    //   description: `${selectedSession?.type} with ${expert.name} on ${selectedDate} at ${selectedTime}`,
    // });

    // Reset form
    setSelectedSessionType("");
    setSelectedDate("");
    setSelectedTime("");
    setMessage("");
    setIsOpen(false);
    onBookingConfirmed();
  };

  // const selectedSession = expert.sessionTypes.find((session: any) => session.type === selectedSessionType);

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
            <label className="text-sm font-medium mb-2 block">
              Select Session Type
            </label>
            <Select
              value={selectedSessionType}
              onValueChange={setSelectedSessionType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a session type" />
              </SelectTrigger>
              {/* <SelectContent>
                {expert.sessionTypes.map((session: any) => (
                  <SelectItem key={session.type} value={session.type}>
                    {session.type} - {session.duration} - {session.price}
                  </SelectItem>
                ))}
              </SelectContent> */}
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Date
            </label>
            <Select
              value={selectedDate}
              onValueChange={(value) => {
                setSelectedDate(value);
                setSelectedTime(""); // Reset time when date changes
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a date" />
              </SelectTrigger>
              {/* <SelectContent>
                {expert.availability.map((day: any) => (
                  <SelectItem key={day.date} value={day.date}>
                    {day.date}
                  </SelectItem>
                ))}
              </SelectContent> */}
            </Select>
          </div>

          {selectedDate && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                Select Time
              </label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a time" />
                </SelectTrigger>
                <SelectContent>
                  {expert.availability
                    .find((day: any) => day.date === selectedDate)
                    ?.times.map((time: string) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">
              Message (Optional)
            </label>
            <Textarea
              placeholder="Briefly describe what you'd like to work on..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* {selectedSession && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">{selectedSession.type}</p>
              <p className="text-sm text-muted-foreground">{selectedSession.duration} - {selectedSession.price}</p>
            </div>
          )} */}

          <Button
            className="w-full"
            onClick={handleBookSession}
            disabled={!selectedSessionType || !selectedDate || !selectedTime}
          >
            Confirm Booking
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Experts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");

  const {
    data: experts,
    isLoading,
    error,
  } = useQuery<ExpertProfile[]>({
    queryKey: ["experts"],
    queryFn: () => ExpertsAPI.getExperts(),
  });

  const filteredExperts = experts?.filter((expert) => {
    const matchesSearch =
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.specializations.some((spec: string) =>
        spec.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesSpecialization =
      selectedSpecialization === "All" ||
      expert.specializations.includes(selectedSpecialization);
    return matchesSearch && matchesSpecialization;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-foreground">
              Find Experts
            </h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-muted-foreground">Loading experts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-foreground">
              Find Experts
            </h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-destructive">
            Error loading experts. Please try again.
          </p>
        </div>
      </div>
    );
  }

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
            Connect with verified therapists and coaches for personalized
            support
          </p>
        </div>

        {/* Specialization Filters */}
        {/* <div className="flex flex-wrap gap-2 justify-center animate-slide-up">
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
        </div> */}

        {/* Experts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experts;

const ExpertCard = ({ expert }: { expert: ExpertProfile }) => {
  return (
    <Card
      key={expert.id}
      className="group cursor-pointer transition-all duration-300 border-none shadow-xl bg-gradient-to-br from-white via-background to-muted/60 hover:scale-[1.025] hover:shadow-2xl focus-within:ring-2 focus-within:ring-primary/70"
      tabIndex={0}
      aria-label={`Expert card for ${expert.name}`}
    >
      <CardHeader className="pb-0 pt-6 px-6">
        <div className="flex items-center gap-4">
          <ExpertCardAvatar expert={expert} />
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <h3 className="text-xl font-bold text-foreground leading-tight">
                {expert.name}
              </h3>
              {expert.verified && (
                <BadgeCheck className="h-5 w-5 text-primary ml-1" />
              )}
            </div>
            <p className="text-muted-foreground text-sm font-medium">{expert.title}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4 px-6 pb-6">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Star
              className="h-4 w-4 fill-yellow-400 text-yellow-400"
              aria-label="Rating"
            />
            <span className="font-semibold text-foreground">{expert.rating ?? "N/A"}</span>
            <span className="text-muted-foreground">
              ({expert.totalStudents ?? 0} reviews)
            </span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{expert.totalStudents ?? 0}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 italic">
          {expert.bio || "No bio provided."}
        </p>

        <div className="flex flex-wrap gap-2">
          {expert.specializations?.slice(0, 3).map((spec: string) => (
            <span
              key={spec}
              className="bg-gradient-to-r from-primary/10 to-muted px-3 py-1 rounded-full text-[10px] text-primary font-semibold shadow-sm"
            >
              {spec}
            </span>
          ))}
          {expert.specializations?.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{expert.specializations.length - 3} more
            </span>
          )}
        </div>

        <div className="flex space-x-2 pt-2">
          <Button
            asChild
            variant="secondary"
            className="flex-1 font-semibold border border-primary/30 hover:bg-primary transition"
            tabIndex={-1}
            aria-label={`View profile of ${expert.name}`}
          >
            <Link to={`/experts/${expert.id}`}>View Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ExpertCardAvatar = ({ expert }: { expert: ExpertProfile }) => {
  return (
    <div className="relative mx-auto">
      <div className="absolute -top-2 -right-2 z-10">
        {expert.verified && (
          <span className="bg-primary rounded-full p-1 shadow-lg">
            <BadgeCheck className="h-4 w-4 text-white" />
          </span>
        )}
      </div>
      {expert.avatar ? (
        <img
          src={expert.avatar}
          alt={expert.name}
          className="w-16 h-16 rounded-full object-cover border-4 border-primary/20 shadow-lg group-hover:scale-110 transition-transform duration-300"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center mx-auto text-lg font-bold text-primary group-hover:scale-110 transition-transform duration-300 select-none border-4 border-primary/10 shadow-lg">
          {(() => {
            const words = expert.name.trim().split(" ");
            if (words.length === 1) {
              return words[0][0]?.toUpperCase() || "";
            } else {
              return (words[0][0] + words[1][0]).toUpperCase();
            }
          })()}
        </div>
      )}
    </div>
  );
};
