
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
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { AvailabilitySlot, Booking, SessionType } from "@/data/types";
import { days, getAvailableTimes } from "@/lib/utils";
import { CustomLoader } from "@/components/CustomLoader";




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
      <motion.div
        className="min-h-screen bg-background relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-center justify-between p-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.4 }}
            >
              <SidebarTrigger />
            </motion.div>
            <motion.h1 
              className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Expert Profile
            </motion.h1>
            <div className="w-10" />
          </div>
        </motion.div>
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <CustomLoader />
          <div className="text-lg text-muted-foreground">Loading Expert Profile...</div>
        </motion.div>
      </motion.div>
    );    
   
  }

  if (error || !expert || sessionTypesError || availabilitySlotsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/30 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 via-transparent to-destructive/5 animate-pulse" />
        
        <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-md border-b border-border/50 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Expert Profile
            </h1>
            <div className="w-10" />
          </div>
        </div>
        <div className="flex items-center justify-center min-h-96 z-10 relative">
          <div className="text-center p-8 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg">
            <p className="text-destructive text-lg font-medium">
              Expert not found. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/50 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >

    {/* Animated background elements */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
    </div>        

      <motion.div
        className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between p-4">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.4 }}
          >
            <SidebarTrigger />
          </motion.div>
          <motion.h1
            className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Expert Profile
          </motion.h1>
          <div className="w-10" />
        </div>
      </motion.div> 

      <div className="relative z-10 p-6 space-y-8">
        {/* Expert Header */}
        <Card className="animate-fade-in bg-card/80 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
          <CardContent className="relative p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="text-center lg:text-left">                
                <div className="relative flex justify-center flex-col items-center mb-6 group">
                  {expert.avatar ? (
                    <div className="relative">
                      <img
                        src={expert.avatar}
                        alt={expert.name}
                        className="w-28 h-28 rounded-full object-cover mx-auto lg:mx-0 shadow-lg ring-4 ring-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:ring-primary/30"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center text-white text-2xl font-bold shadow-lg ring-4 ring-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:ring-primary/30">
                      {expert.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                  )}
                  
                  <h1 className="text-2xl font-bold text-foreground mt-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                    {expert.name}
                  </h1>
                  <p className="text-muted-foreground mb-4 font-medium">
                    {expert.title}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm mb-6 p-4 rounded-lg bg-muted/30 backdrop-blur-sm border border-border/50">
                  <div className="flex items-center gap-2">
                    <Star
                      className="h-5 w-5 fill-yellow-400 text-yellow-400 animate-pulse"
                      aria-label="Rating"
                    />
                    <span className="font-bold text-foreground">
                      {expert.rating ?? "N/A"}
                    </span>
                    <span className="text-muted-foreground">
                      ({expert.totalStudents ?? 0} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-5 w-5" />
                    <span className="font-semibold">{expert.totalStudents ?? 0}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8">
                  {expert.specializations.map((spec: string, index: number) => (
                    <Badge 
                      key={spec} 
                      variant="secondary" 
                      className="bg-gradient-to-r from-primary/10 to-primary/5 text-white/80 hover:text-primary border-primary/20 hover:bg-primary/20 hover:scale-105 transition-all duration-300 font-medium px-4 py-2"
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      {spec}
                    </Badge>
                  ))}
                </div>

                {/* Prominent Book Now Button */}
                <Button
                  size="lg"
                  className="w-full lg:w-auto bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold px-8 py-3"
                  onClick={() => setIsBookingModalOpen(true)}
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  Book Now
                </Button>
              </div>

              <div className="lg:col-span-2 space-y-8">
                <div className="p-6 rounded-xl bg-muted/20 backdrop-blur-sm border border-border/30 hover:bg-muted/30 transition-all duration-300">
                  <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">                    
                    <div className="p-2 rounded-lg bg-secondary/10">
              <MessageSquare className="h-6 w-6 text-secondary" />
            </div>
                    About
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {expert.bio}
                  </p>
                </div>

                {expert.credentials && expert.credentials.length > 0 && (
                  <div className="p-6 rounded-xl bg-muted/20 backdrop-blur-sm border border-border/30 hover:bg-muted/30 transition-all duration-300">
                    <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">                      
                      <div className="p-2 rounded-lg bg-secondary/10">
                        <Award className="h-6 w-6 text-secondary" />
                      </div>
                      Credentials
                    </h3>
                    <ul className="space-y-3">
                      {expert.credentials.map((cred, index) => (
                        <li 
                          key={index} 
                          className="flex items-center space-x-3 p-3 rounded-lg bg-background/80 hover:bg-background transition-all duration-300 hover:scale-[1.02]"
                          style={{
                            animationDelay: `${index * 100}ms`
                          }}
                        >
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
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
        sessionTypes={sessionTypes}     />
    </motion.div>
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
    <div className="divide-y divide-border/30 rounded-xl border border-border/50 bg-gradient-to-br from-background/80 to-muted/20 shadow-lg backdrop-blur-sm overflow-hidden">
      {days.map((day, dayIndex) =>
        slotsByDay[day] ? (
          <div key={day} className="group">
            <button
              className={`w-full flex justify-between items-center px-6 py-4 focus:outline-none transition-all duration-300 ${
                open === day 
                  ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary" 
                  : "bg-transparent hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/20"
              }`}
              onClick={() => setOpen(open === day ? null : day)}
              aria-expanded={open === day}
              aria-controls={`availability-panel-${day}`}
              type="button"
              style={{
                animationDelay: `${dayIndex * 100}ms`
              }}
            >
              <span className="font-semibold text-foreground text-base flex items-center gap-3 group-hover:text-primary transition-colors duration-300">
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  open === day ? "bg-primary/20" : "bg-muted/30 group-hover:bg-primary/10"
                }`}>
                  <Calendar className="h-4 w-4" />
                </div>
                {day}
              </span>
              <div className="flex items-center gap-3">
                <Badge 
                  variant="secondary" 
                  className={`transition-all duration-300 ${
                    open === day 
                      ? "bg-primary/20 text-primary border-primary/30" 
                      : "bg-muted/30 text-primary/70 group-hover:bg-primary/10 group-hover:text-primary"
                  }`}
                >
                  {slotsByDay[day].length} slot{slotsByDay[day].length > 1 ? "s" : ""}
                </Badge>
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${
                  open === day ? "rotate-180 text-primary" : "text-muted-foreground group-hover:text-primary"
                }`} />
              </div>
            </button>
            <div
              id={`availability-panel-${day}`}
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                open === day 
                  ? "max-h-60 py-4 px-6 bg-gradient-to-r from-muted/20 to-muted/10" 
                  : "max-h-0 py-0 px-6"
              }`}
              style={{
                transitionProperty: "max-height, padding, background",
              }}
              aria-hidden={open !== day}
            >
              {open === day && (
                <div className="flex flex-wrap gap-3 animate-fade-in">
                  {slotsByDay[day]
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map((slot, slotIndex) => (
                      <Badge
                        key={slot.id}
                        variant="outline"
                        className="text-sm font-medium px-4 py-2 bg-gradient-to-r from-background/80 to-background/60 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 hover:scale-105 shadow-sm"
                        style={{
                          animationDelay: `${slotIndex * 50}ms`
                        }}
                      >
                        <Clock className="h-3 w-3 mr-1" />
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
      <Card className="animate-fade-in bg-card/80 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        <CardHeader className="relative">
          <CardTitle className="flex text-xl items-center space-x-3 font-bold">
            <div className="p-2 rounded-lg bg-primary/10">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Session Types</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-4">
          {sessionTypes.map((session: SessionType, index: number) => (
            <div
              key={index}
              className="group flex justify-between items-center p-5 bg-gradient-to-r from-muted/30 to-muted/20 rounded-xl border border-border/30 hover:from-muted/50 hover:to-muted/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-all duration-300">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                    {session.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {session.durationMinutes} minutes
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text">
                  {session.currency} {session.price}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Availability */}
      <Card className="animate-fade-in bg-card/80 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
        <CardHeader className="relative">
          <CardTitle className="flex text-xl items-center space-x-3 font-bold">
            <div className="p-2 rounded-lg bg-secondary/10">
              <Calendar className="h-6 w-6 text-secondary" />
            </div>
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Availability</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="relative space-y-4">
          {availabilitySlots && availabilitySlots.length > 0 ? (
            <AvailabilityAccordion availabilitySlots={availabilitySlots} />
          ) : (
            <div className="text-center p-8 rounded-xl bg-muted/20 border border-border/30">
              <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground italic">
                No availability slots found.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Reviews = ({ reviews }: { reviews: any[] }) => {
  return (
    <Card className="animate-fade-in bg-card/80 backdrop-blur-sm border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center space-x-3 text-xl font-bold">          
          <div className="p-2 rounded-lg bg-secondary/10">
              <MessageSquare className="h-6 w-6 text-secondary" />
            </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Recent Reviews</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-6">
        {reviews.map((review, index) => (
          <div 
            key={index} 
            className="group p-6 bg-gradient-to-r from-muted/30 to-muted/20 rounded-xl border border-border/30 hover:from-muted/50 hover:to-muted/30 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg"
            style={{
              animationDelay: `${index * 150}ms`
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {review.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{review.name}</h4>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400 transition-transform duration-300 hover:scale-110"
                    style={{
                      animationDelay: `${i * 100}ms`
                    }}
                  />
                ))}
              </div>
            </div>
            <p className="text-muted-foreground mb-3 leading-relaxed italic">"{review.comment}"</p>
            <span className="text-sm text-muted-foreground/80 font-medium">{review.date}</span>
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
