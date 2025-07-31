
import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Star,
  Calendar,
  Clock,
  CheckCircle,
  MessageSquare,
  Video,
  Award,
  Users,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import BookingModal from "@/components/BookingModal";
import { ExpertsAPI } from "@/api/experts";
import { useQuery } from "@tanstack/react-query";
import { AvailabilitySlot, Booking, SessionType } from "@/data/types";
import { days, getAvailableTimes } from "@/lib/utils";




const ExpertProfile = () => {
  const { id } = useParams();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const {
    data: expert,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["expert", id],
    queryFn: () => ExpertsAPI.getExpert(id),
    enabled: !!id,
  });

  const {
    data: availabilitySlots,
    isLoading: availabilitySlotsLoading,
    error: availabilitySlotsError,
  } = useQuery<AvailabilitySlot[]>({
    queryKey: ["availabilitySlots", id],
    queryFn: () => ExpertsAPI.availabilitySlots(id),
    enabled: !!id,
  });

  const {
    data: sessionTypes,
    isLoading: sessionTypesLoading,
    error: sessionTypesError,
  } = useQuery<SessionType[]>({
    queryKey: ["sessionTypes", id],
    queryFn: () => ExpertsAPI.sessionTypes(id),
    enabled: !!id,
  });

  if (isLoading || sessionTypesLoading || availabilitySlotsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-foreground">
              Expert Profile
            </h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-muted-foreground">Loading expert profile...</p>
        </div>
      </div>
    );
  }

  if (error || !expert || sessionTypesError || availabilitySlotsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-foreground">
              Expert Profile
            </h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <p className="text-destructive">
            Expert not found. Please try again.
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
          <h1 className="text-xl font-semibold text-foreground">
            Expert Profile
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Expert Header */}
        <Card className="animate-fade-in">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center lg:text-left">
                <div className="relative flex justify-center flex-col items-center mb-4">
                  <img
                    src={expert.avatar}
                    alt={expert.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto lg:mx-0"
                  />
                  <h1 className="text-xl font-bold text-foreground mt-2">
                    {expert.name}
                  </h1>
                  <p className="text-sm text-muted-foreground mb-4">
                    {expert.title}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs mb-5">
                  <div className="flex items-center gap-1.5">
                    <Star
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      aria-label="Rating"
                    />
                    <span className="font-semibold text-foreground">
                      {expert.rating ?? "N/A"}
                    </span>
                    <span className="text-muted-foreground">
                      ({expert.totalStudents ?? 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{expert.totalStudents ?? 0}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                  {expert.specializations.map((spec: string) => (
                    <Badge key={spec} variant="secondary" className="bg-primary/10 text-primary/80 hover:bg-secondary/10">
                      {spec}
                    </Badge>
                  ))}
                </div>

                {/* Prominent Book Now Button */}
                <Button
                  size="lg"
                  className="w-full lg:w-auto "
                  onClick={() => setIsBookingModalOpen(true)}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Now
                </Button>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    About
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {expert.bio}
                  </p>
                </div>

                {expert.credentials && expert.credentials.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Credentials
                    </h3>
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

        <SessionTypes
          sessionTypes={sessionTypes}
          availabilitySlots={availabilitySlots}
        />

        <Reviews reviews={reviews} />
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        expert={expert}
        sessionTypes={sessionTypes}
      />
    </div>
  );
};

export default ExpertProfile;

function AvailabilityAccordion({
  availabilitySlots,
}: {
  availabilitySlots: AvailabilitySlot[];
}) {
  // Group slots by day of week
  const slotsByDay: { [day: string]: AvailabilitySlot[] } = {};
  availabilitySlots.forEach((slot) => {
    const day = days[slot.dayOfWeek];
    if (!slotsByDay[day]) slotsByDay[day] = [];
    slotsByDay[day].push(slot);
  });

  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-background/80 shadow-sm">
      {days.map((day) =>
        slotsByDay[day] ? (
          <div key={day}>
            <button
              className={`w-full flex justify-between items-center px-4 py-3 focus:outline-none transition-colors ${
                open === day ? "bg-muted/40" : "bg-transparent"
              } hover:bg-muted/30`}
              onClick={() => setOpen(open === day ? null : day)}
              aria-expanded={open === day}
              aria-controls={`availability-panel-${day}`}
              type="button"
            >
              <span className="font-semibold text-foreground text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                {day}
              </span>
              <span className="text-muted-foreground text-xs">
                {slotsByDay[day].length} slot
                {slotsByDay[day].length > 1 ? "s" : ""}
              </span>
              <ChevronDown className={`h-4 w-4 transition-transform ${
                open === day ? "rotate-180" : ""
              }`} />
            </button>
            <div
              id={`availability-panel-${day}`}
              className={`overflow-hidden transition-all duration-300 ${
                open === day ? "max-h-40 py-2 px-6" : "max-h-0 py-0 px-6"
              }`}
              style={{
                transitionProperty: "max-height, padding",
              }}
              aria-hidden={open !== day}
            >
              {open === day && (
                <div className="flex flex-wrap gap-2">
                  {slotsByDay[day]
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((slot) => (
                      <Badge
                        key={slot.id}
                        variant="outline"
                        className="text-xs font-medium px-3 py-1 bg-muted/20 border-primary/10"
                      >
                        {slot.startTime} - {slot.endTime}
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}

const SessionTypes = ({
  sessionTypes,
  availabilitySlots,
}: {
  sessionTypes: SessionType[];
  availabilitySlots: AvailabilitySlot[];
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Session Types */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex text-lg items-center space-x-2">
            <Video className="h-5 w-5 text-primary" />
            <span>Session Types</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessionTypes.map((session: SessionType, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-muted/20 rounded-lg"
            >
              <div>
                <h4 className="font-semibold text-sm text-foreground">
                  {session.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {session.durationMinutes} minutes
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm text-foreground">
                  {session.currency} {session.price}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Availability */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex text-lg items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Availability</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {availabilitySlots && availabilitySlots.length > 0 ? (
            <AvailabilityAccordion availabilitySlots={availabilitySlots} />
          ) : (
            <div className="text-muted-foreground italic">
              No availability slots found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Reviews = ({ reviews }: { reviews: any[] }) => {
  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <span>Recent Reviews</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-foreground">{review.name}</h4>
              <div className="flex items-center space-x-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>
            <p className="text-muted-foreground mb-2">{review.comment}</p>
            <span className="text-sm text-muted-foreground">{review.date}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const reviews = [
  {
    name: "Sarah M.",
    rating: 5,
    comment:
      "Mark helped me overcome my fear of public speaking completely. His approach is practical and encouraging.",
    date: "2 weeks ago",
  },
  {
    name: "John D.",
    rating: 5,
    comment:
      "Excellent coach! Saw immediate improvement in my confidence after just a few sessions.",
    date: "1 month ago",
  },
];
