import { useState } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { Calendar, Clock, FileText, CreditCard } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: {
    id: number;
    name: string;
    title: string;
    photo: string;
    sessionTypes: Array<{
      type: string;
      duration: string;
      price: string;
      session_id: string;
    }>;
    availability: Array<{ date: string; times: Array<string> }>;
  };
  sessionId: number;
}

const BookingModal = ({ isOpen, onClose, expert }: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSessionType, setSelectedSessionType] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();
  // Helper to get available times for the selected date from expert.availability
  const getAvailableTimes = (date: Date | undefined) => {
    console.log(date);
    if (!date || !expert.availability) return [];
    const dateStr = format(date, "EEEE").toLowerCase(); // e.g., "monday", "tuesday"
    const day = expert.availability.find((d: any) => d.date.toLowerCase() === dateStr.toLowerCase());
    return day ? day.times : [];
  };
  
  const selectedSession = expert.sessionTypes.find(session => session.type === selectedSessionType);
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
  };

  const handleNext = () => {
    if (step === 1 && selectedDate && selectedTime && selectedSessionType) {
      setStep(2);
    }
  };

  const handleConfirmBooking = async () => {
    // Book one session into the database and return the session ID using Supabase
    console.log(selectedSession?.session_id);
      // Import supabase client (assumes you have it set up in your project)
      // import { supabase } from "@/lib/supabaseClient"; // If not already imported at the top
      // Prepare session data
      const sessionData = {
        session_id: selectedSession?.session_id,      
        // user_id: user?.id,
        created_at: new Date().toISOString(),
        session_time: selectedDate && selectedTime
          ? new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              parseInt(selectedTime.split(":")[0], 10),
              parseInt(selectedTime.split(":")[1], 10)
            ).toISOString()
          : null,
        notes: notes,        
      };

      // Insert session into the "sessions" table
      const { data, error } = await supabase
        .from("booked_sessions")
        .insert([sessionData])
        .select("id")
        .single();

      if (error) {
        toast({
          title: "Booking Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Use the returned session ID for navigation
      const sessionId = data?.id;
    toast({
      title: "Session Booked Successfully!",
      description: `Your ${selectedSession?.type} with ${expert.name} has been confirmed.`,
    });
    
    // Navigate to session details page
    navigate("/session/SESS-2024-001");
    onClose();
  }

  


const resetModal = () => {
  setStep(1);
  setSelectedDate(undefined);
  setSelectedTime("");
  setSelectedSessionType("");
  setNotes("");
};

const handleClose = () => {
  resetModal();
  onClose();
};

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Book Session with {expert.name}</span>
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            {/* Expert Info */}
            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
              <img
                src={expert.photo}
                alt={expert.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-foreground">{expert.name}</h3>
                <p className="text-sm text-muted-foreground">{expert.title}</p>
              </div>
            </div>

            {/* Session Type Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Select Session Type</label>
              <div className="space-y-2">
                {expert.sessionTypes.map((session) => (
                  <div
                    key={session.type}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedSessionType === session.type
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedSessionType(session.type)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-foreground">{session.type}</h4>
                        <p className="text-sm text-muted-foreground">{session.duration}</p>
                      </div>
                      <Badge variant="secondary">{session.price}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Select Date</label>
              <div className="border rounded-lg p-4">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                  className="w-full pointer-events-auto"
                />
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="text-sm font-medium mb-3 block">Select Time</label>
                <div className="grid grid-cols-3 gap-2">
                  {getAvailableTimes(selectedDate).map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className="text-sm"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleNext}
                disabled={!selectedDate || !selectedTime || !selectedSessionType}
              >
                Next: Review & Confirm
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {/* Booking Summary */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-foreground mb-3">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expert:</span>
                  <span className="font-medium">{expert.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session Type:</span>
                  <span className="font-medium">{selectedSession?.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">{selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{selectedSession?.duration}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-primary">{selectedSession?.price}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium mb-2 block flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Notes for the Expert (Optional)</span>
              </label>
              <Textarea
                placeholder="Share what you'd like to work on or any specific concerns..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            {/* Payment Info */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Payment</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Payment will be processed securely after the session is completed. 
                You can cancel up to 24 hours before your scheduled time.
              </p>
            </div>

            <div className="flex justify-between space-x-2 pt-4">
              <Button variant="outline" onClick={()=>setStep(1)}>
                Back
              </Button>
              <Button onClick={handleConfirmBooking} className="flex-1">
                Confirm Booking - {selectedSession?.price}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};


export default BookingModal;
