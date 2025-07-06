// import { useState } from "react";
// import { Search, Star, Calendar, CheckCircle, BadgeCheck, Award, Users } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/hooks/use-toast";
// import { Link } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { ExpertsAPI } from "@/api/experts";
// import { ExpertProfile } from "@/data/types/expert";

// // const specializations = ["All", "Anxiety Disorders", "CBT", "Public Speaking", "Depression", "Life Transitions"];

// const BookingDialog = ({
//   expert,
//   onBookingConfirmed,
// }: {
//   expert: any;
//   onBookingConfirmed: () => void;
// }) => {
//   const [selectedSessionType, setSelectedSessionType] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedTime, setSelectedTime] = useState("");
//   const [message, setMessage] = useState("");
//   const [isOpen, setIsOpen] = useState(false);
//   const { toast } = useToast();

//   const handleBookSession = () => {
//     if (!selectedSessionType || !selectedDate || !selectedTime) {
//       toast({
//         title: "Missing Information",
//         description: "Please select session type, date, and time.",
//         variant: "destructive",
//       });
//       return;
//     }

//     // const selectedSession = expert.sessionTypes.find((session: any) => session.type === selectedSessionType);

//     // toast({
//     //   title: "Session Booked Successfully!",
//     //   description: `${selectedSession?.type} with ${expert.name} on ${selectedDate} at ${selectedTime}`,
//     // });

//     // Reset form
//     setSelectedSessionType("");
//     setSelectedDate("");
//     setSelectedTime("");
//     setMessage("");
//     setIsOpen(false);
//     onBookingConfirmed();
//   };

//   // const selectedSession = expert.sessionTypes.find((session: any) => session.type === selectedSessionType);

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button className="flex-1">Book Session</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Book Session with {expert.name}</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           <div>
//             <label className="text-sm font-medium mb-2 block">
//               Select Session Type
//             </label>
//             <Select
//               value={selectedSessionType}
//               onValueChange={setSelectedSessionType}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Choose a session type" />
//               </SelectTrigger>
//               {/* <SelectContent>
//                 {expert.sessionTypes.map((session: any) => (
//                   <SelectItem key={session.type} value={session.type}>
//                     {session.type} - {session.duration} - {session.price}
//                   </SelectItem>
//                 ))}
//               </SelectContent> */}
//             </Select>
//           </div>

//           <div>
//             <label className="text-sm font-medium mb-2 block">
//               Select Date
//             </label>
//             <Select
//               value={selectedDate}
//               onValueChange={(value) => {
//                 setSelectedDate(value);
//                 setSelectedTime(""); // Reset time when date changes
//               }}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Choose a date" />
//               </SelectTrigger>
//               {/* <SelectContent>
//                 {expert.availability.map((day: any) => (
//                   <SelectItem key={day.date} value={day.date}>
//                     {day.date}
//                   </SelectItem>
//                 ))}
//               </SelectContent> */}
//             </Select>
//           </div>

//           {selectedDate && (
//             <div>
//               <label className="text-sm font-medium mb-2 block">
//                 Select Time
//               </label>
//               <Select value={selectedTime} onValueChange={setSelectedTime}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Choose a time" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {expert.availability
//                     .find((day: any) => day.date === selectedDate)
//                     ?.times.map((time: string) => (
//                       <SelectItem key={time} value={time}>
//                         {time}
//                       </SelectItem>
//                     ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           <div>
//             <label className="text-sm font-medium mb-2 block">
//               Message (Optional)
//             </label>
//             <Textarea
//               placeholder="Briefly describe what you'd like to work on..."
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               className="min-h-[80px]"
//             />
//           </div>

//           {/* {selectedSession && (
//             <div className="p-3 bg-muted rounded-lg">
//               <p className="text-sm font-medium">{selectedSession.type}</p>
//               <p className="text-sm text-muted-foreground">{selectedSession.duration} - {selectedSession.price}</p>
//             </div>
//           )} */}

//           <Button
//             className="w-full"
//             onClick={handleBookSession}
//             disabled={!selectedSessionType || !selectedDate || !selectedTime}
//           >
//             Confirm Booking
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// const Experts = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedSpecialization, setSelectedSpecialization] = useState("All");

//   const {
//     data: experts,
//     isLoading,
//     error,
//   } = useQuery<ExpertProfile[]>({
//     queryKey: ["experts"],
//     queryFn: () => ExpertsAPI.getExperts(),
//   });

//   const filteredExperts = experts?.filter((expert) => {
//     const matchesSearch =
//       expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       expert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       expert.specializations.some((spec: string) =>
//         spec.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     const matchesSpecialization =
//       selectedSpecialization === "All" ||
//       expert.specializations.includes(selectedSpecialization);
//     return matchesSearch && matchesSpecialization;
//   });

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
//         <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
//           <div className="flex items-center justify-between p-4">
//             <SidebarTrigger />
//             <h1 className="text-xl font-semibold text-foreground">
//               Find Experts
//             </h1>
//             <div className="w-10" />
//           </div>
//         </div>
//         <div className="flex items-center justify-center min-h-96">
//           <p className="text-muted-foreground">Loading experts...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
//         <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
//           <div className="flex items-center justify-between p-4">
//             <SidebarTrigger />
//             <h1 className="text-xl font-semibold text-foreground">
//               Find Experts
//             </h1>
//             <div className="w-10" />
//           </div>
//         </div>
//         <div className="flex items-center justify-center min-h-96">
//           <p className="text-destructive">
//             Error loading experts. Please try again.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
//       <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
//         <div className="flex items-center justify-between p-4">
//           <SidebarTrigger />
//           <div className="flex-1 max-w-md mx-auto">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//               <Input
//                 placeholder="Search experts..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           </div>
//           <div className="w-10" />
//         </div>
//       </div>

//       <div className="p-6 space-y-8">
//         {/* Header */}
//         <div className="text-center py-4 animate-fade-in">
//           <h1 className="text-3xl font-bold text-foreground mb-2">
//             Mental Wellness Experts
//           </h1>
//           <p className="text-lg text-muted-foreground">
//             Connect with verified therapists and coaches for personalized
//             support
//           </p>
//         </div>

       

//         {/* Experts Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredExperts.map((expert) => (
//             <ExpertCard key={expert.id} expert={expert} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Experts;

// const ExpertCard = ({ expert }: { expert: ExpertProfile }) => {
//   return (
//     <Card
//       key={expert.id}
//       className="group cursor-pointer transition-all duration-300 border-none shadow-xl bg-gradient-to-br from-white via-background to-muted/60 hover:scale-[1.025] hover:shadow-2xl focus-within:ring-2 focus-within:ring-primary/70"
//       tabIndex={0}
//       aria-label={`Expert card for ${expert.name}`}
//     >
//       <CardHeader className="pb-0 pt-6 px-6">
//         <div className="flex items-center gap-4">
//           <ExpertCardAvatar expert={expert} />
//           <div className="flex-1">
//             <div className="flex items-center gap-1">
//               <h3 className="text-xl font-bold text-foreground leading-tight">
//                 {expert.name}
//               </h3>
//               {expert.verified && (
//                 <BadgeCheck className="h-5 w-5 text-primary ml-1" />
//               )}
//             </div>
//             <p className="text-muted-foreground text-sm font-medium">{expert.title}</p>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-4 pt-4 px-6 pb-6">
//         <div className="flex items-center justify-between text-xs">
//           <div className="flex items-center gap-1.5">
//             <Star
//               className="h-4 w-4 fill-yellow-400 text-yellow-400"
//               aria-label="Rating"
//             />
//             <span className="font-semibold text-foreground">{expert.rating ?? "N/A"}</span>
//             <span className="text-muted-foreground">
//               ({expert.totalStudents ?? 0} reviews)
//             </span>
//           </div>
//           <div className="flex items-center gap-1 text-muted-foreground">
//             <Users className="h-4 w-4" />
//             <span>{expert.totalStudents ?? 0}</span>
//           </div>
//         </div>

//         <p className="text-sm text-muted-foreground line-clamp-3 italic">
//           {expert.bio || "No bio provided."}
//         </p>

//         <div className="flex flex-wrap gap-2">
//           {expert.specializations?.slice(0, 3).map((spec: string) => (
//             <span
//               key={spec}
//               className="bg-gradient-to-r from-primary/10 to-muted px-3 py-1 rounded-full text-[10px] text-primary font-semibold shadow-sm"
//             >
//               {spec}
//             </span>
//           ))}
//           {expert.specializations?.length > 3 && (
//             <span className="text-xs text-muted-foreground">
//               +{expert.specializations.length - 3} more
//             </span>
//           )}
//         </div>

//         <div className="flex space-x-2 pt-2">
//           <Button
//             asChild
//             variant="secondary"
//             className="flex-1 font-semibold border border-primary/30 hover:bg-primary transition"
//             tabIndex={-1}
//             aria-label={`View profile of ${expert.name}`}
//           >
//             <Link to={`/experts/${expert.id}`}>View Profile</Link>
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// const ExpertCardAvatar = ({ expert }: { expert: ExpertProfile }) => {
//   return (
//     <div className="relative mx-auto">
//       <div className="absolute -top-2 -right-2 z-10">
//         {expert.verified && (
//           <span className="bg-primary rounded-full p-1 shadow-lg">
//             <BadgeCheck className="h-4 w-4 text-white" />
//           </span>
//         )}
//       </div>
//       {expert.avatar ? (
//         <img
//           src={expert.avatar}
//           alt={expert.name}
//           className="w-16 h-16 rounded-full object-cover border-4 border-primary/20 shadow-lg group-hover:scale-110 transition-transform duration-300"
//         />
//       ) : (
//         <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center mx-auto text-lg font-bold text-primary group-hover:scale-110 transition-transform duration-300 select-none border-4 border-primary/10 shadow-lg">
//           {(() => {
//             const words = expert.name.trim().split(" ");
//             if (words.length === 1) {
//               return words[0][0]?.toUpperCase() || "";
//             } else {
//               return (words[0][0] + words[1][0]).toUpperCase();
//             }
//           })()}
//         </div>
//       )}
//     </div>
//   );
// };
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button className="flex-1">Book Session</Button>
        </motion.div>
      </DialogTrigger>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <DialogTitle>Book Session with {expert.name}</DialogTitle>
            </motion.div>
          </DialogHeader>
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <label className="text-sm font-medium mb-2 block">
                Select Session Type
              </label>
              <Select
                value={selectedSessionType}
                onValueChange={setSelectedSessionType}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a session type" />
                  </SelectTrigger>
                </motion.div>
                {/* <SelectContent>
                  {expert.sessionTypes.map((session: any) => (
                    <SelectItem key={session.type} value={session.type}>
                      {session.type} - {session.duration} - {session.price}
                    </SelectItem>
                  ))}
                </SelectContent> */}
              </Select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
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
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a date" />
                  </SelectTrigger>
                </motion.div>
                {/* <SelectContent>
                  {expert.availability.map((day: any) => (
                    <SelectItem key={day.date} value={day.date}>
                      {day.date}
                    </SelectItem>
                  ))}
                </SelectContent> */}
              </Select>
            </motion.div>

            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <label className="text-sm font-medium mb-2 block">
                  Select Time
                </label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a time" />
                    </SelectTrigger>
                  </motion.div>
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
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <label className="text-sm font-medium mb-2 block">
                Message (Optional)
              </label>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Textarea
                  placeholder="Briefly describe what you'd like to work on..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[80px]"
                />
              </motion.div>
            </motion.div>

            {/* {selectedSession && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">{selectedSession.type}</p>
                <p className="text-sm text-muted-foreground">{selectedSession.duration} - {selectedSession.price}</p>
              </div>
            )} */}

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                className="w-full"
                onClick={handleBookSession}
                disabled={!selectedSessionType || !selectedDate || !selectedTime}
              >
                Confirm Booking
              </Button>
            </motion.div>
          </div>
        </DialogContent>
      </motion.div>
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
      <motion.div
        className="min-h-screen bg-gradient-to-br from-background to-muted/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between p-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.4 }}
            >
              <SidebarTrigger />
            </motion.div>
            <motion.h1
              className="text-xl font-semibold text-foreground"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Find Experts
            </motion.h1>
            <div className="w-10" />
          </div>
        </motion.div>
        <motion.div
          className="flex items-center justify-center min-h-96"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.p
            className="text-muted-foreground"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Loading experts...
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-background to-muted/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between p-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.4 }}
            >
              <SidebarTrigger />
            </motion.div>
            <motion.h1
              className="text-xl font-semibold text-foreground"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Find Experts
            </motion.h1>
            <div className="w-10" />
          </div>
        </motion.div>
        <motion.div
          className="flex items-center justify-center min-h-96"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.p
            className="text-destructive"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            Error loading experts. Please try again.
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-background to-muted/30"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.div
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between p-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.4 }}
          >
            <SidebarTrigger />
          </motion.div>
          <motion.div
            className="flex-1 max-w-md mx-auto"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative">
              <motion.div
                className="absolute left-3 top-2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Search />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02, borderColor: "#3b82f6" }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  placeholder="   Search experts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </motion.div>
            </div>
          </motion.div>
          <div className="w-10" />
        </div>
      </motion.div>

      <div className="p-6 space-y-8">
        {/* Header */}
        <motion.div
          className="text-center py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        >
          <motion.h1
            className="text-3xl font-bold text-primary mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Mental Wellness Experts
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Connect with verified therapists and coaches for personalized support
          </motion.p>
        </motion.div>

        {/* Experts Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <AnimatePresence>
            {filteredExperts.map((expert, index) => (
              <motion.div
                key={expert.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1, ease: "easeOut" }}
              >
                <ExpertCard expert={expert} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Experts;

const ExpertCard = ({ expert }: { expert: ExpertProfile }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -10, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
    >
      <Card
        className="group cursor-pointer transition-all duration-300 border-none shadow-xl bg-gradient-to-br from-white via-background to-muted/60 hover:scale-[1.025] hover:shadow-2xl focus-within:ring-2 focus-within:ring-primary/70"
        tabIndex={0}
        aria-label={`Expert card for ${expert.name}`}
      >
        <CardHeader className="pb-0 pt-6 px-6">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <ExpertCardAvatar expert={expert} />
            <div className="flex-1">
              <motion.div
                className="flex items-center gap-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <h3 className="text-xl font-bold text-foreground leading-tight">
                  {expert.name}
                </h3>
                {expert.verified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3, type: "spring", stiffness: 100 }}
                  >
                    <BadgeCheck className="h-5 w-5 text-primary ml-1" />
                  </motion.div>
                )}
              </motion.div>
              <motion.p
                className="text-muted-foreground text-sm font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                {expert.title}
              </motion.p>
            </div>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4 px-6 pb-6">
          <motion.div
            className="flex items-center justify-between text-xs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <div className="flex items-center gap-1.5">
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.4 }}
              >
                <Star
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  aria-label="Rating"
                />
              </motion.div>
              <span className="font-semibold text-foreground">{expert.rating ?? "N/A"}</span>
              <span className="text-muted-foreground">
                ({expert.totalStudents ?? 0} reviews)
              </span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
              >
                <Users className="h-4 w-4" />
              </motion.div>
              <span>{expert.totalStudents ?? 0}</span>
            </div>
          </motion.div>

          <motion.p
            className="text-sm text-muted-foreground line-clamp-3 italic"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            {expert.bio || "No bio provided."}
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            {expert.specializations?.slice(0, 3).map((spec: string, index: number) => (
              <motion.span
                key={spec}
                className="bg-gradient-to-r from-primary/10 to-muted px-3 py-1 rounded-full text-[10px] text-primary font-semibold shadow-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + index * 0.05, type: "spring", stiffness: 100 }}
              >
                {spec}
              </motion.span>
            ))}
            {expert.specializations?.length > 3 && (
              <motion.span
                className="text-xs text-muted-foreground"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.95 }}
              >
                +{expert.specializations.length - 3} more
              </motion.span>
            )}
          </motion.div>

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
    </motion.div>
  );
};

const ExpertCardAvatar = ({ expert }: { expert: ExpertProfile }) => {
  return (
    <motion.div
      className="relative mx-auto"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
    >
      <motion.div
        className="absolute -top-2 -right-2 z-10"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 100 }}
      >
        {expert.verified && (
          <motion.span
            className="bg-primary rounded-full p-1 shadow-lg"
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.4 }}
          >
            <BadgeCheck className="h-4 w-4 text-white" />
          </motion.span>
        )}
      </motion.div>
      {expert.avatar ? (
        <motion.img
          src={expert.avatar}
          alt={expert.name}
          className="w-16 h-16 rounded-full object-cover border-4 border-primary/20 shadow-lg group-hover:scale-110 transition-transform duration-300"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.1 }}
        />
      ) : (
        <motion.div
          className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center mx-auto text-lg font-bold text-primary group-hover:scale-110 transition-transform duration-300 select-none border-4 border-primary/10 shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.1 }}
        >
          {(() => {
            const words = expert.name.trim().split(" ");
            if (words.length === 1) {
              return words[0][0]?.toUpperCase() || "";
            } else {
              return (words[0][0] + words[1][0]).toUpperCase();
            }
          })()}
        </motion.div>
      )}
    </motion.div>
  );
};