
import { useState } from "react";
import { format, addDays, addMinutes } from "date-fns";
import { Calendar, Clock, FileText, CreditCard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast, useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { AvailabilitySlot, ExpertProfile, SessionType } from "@/data/types";
import { getAvailableTimes } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ExpertsAPI } from "@/api/experts";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  expert: ExpertProfile;
  sessionTypes: SessionType[];
  // availabilitySlots: AvailabilitySlot[];
}

const BookingModal = ({
  isOpen,
  onClose,
  expert,
  sessionTypes,
  // availabilitySlots,
}: BookingModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSessionType, setSelectedSessionType] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState(1);

  const selectedSession = sessionTypes.find(
    (session) => session.id === selectedSessionType
  );

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
  };

  const handleNext = () => {
    if (step === 1 && selectedDate && selectedTime && selectedSessionType) {
      setStep(2);
    }
  };

  const {
    data: availabilitySlotsData,
    isLoading: availabilitySlotsLoading,
    refetch: refetchAvailabilitySlots,
  } = useQuery<AvailabilitySlot[]>({
    queryKey: ["availabilitySlots", expert.id, selectedDate?.toISOString()],
    queryFn: () => ExpertsAPI.availabilitySlots(expert.id, selectedDate?.toISOString()),
    enabled: !!expert.id && !!selectedDate,
  });

  // Refetch availability slots when date changes
  const handleDateSelectWithRefetch = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
    
    if (date) {
      refetchAvailabilitySlots();
    }
  };

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
                src={expert.avatar}
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
              <label className="text-sm font-medium mb-3 block">
                Select Session Type
              </label>
              <div className="space-y-2">
                {sessionTypes.map((session) => (
                  <div
                    key={session.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedSessionType === session.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedSessionType(session.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-sm text-foreground">
                          {session.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {session.durationMinutes} minutes
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {session.currency}  {session.price}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            {selectedSessionType && <div>
              <label className="text-sm font-medium mb-3 block">
                Select Date
              </label>
              <div className="border rounded-lg p-4">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelectWithRefetch}
                  disabled={(date) =>
                    date < new Date() || date > addDays(new Date(), 30)
                  }
                  className="w-full pointer-events-auto"
                />
              </div>
            </div>}

            {/* Time Selection */}
            {
              availabilitySlotsLoading ? <div>Loading...</div> :
              selectedDate && selectedSessionType && availabilitySlotsData && (
              <TimeSelection
                selectedDate={selectedDate}
                availabilitySlots={availabilitySlotsData}
                selectedSession={selectedSession}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
              />
            )}

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleNext}
                disabled={
                  !selectedDate || !selectedTime || !selectedSessionType
                }
              >
                Next: Review & Confirm
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <BookingSummary
            expert={expert}
            selectedSession={selectedSession}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            notes={notes}
            setNotes={setNotes}
            setStep={setStep}
            onClose={onClose}
            resetModal={resetModal}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;


interface BookingSummaryProps {
  expert: ExpertProfile;
  selectedSession: SessionType;
  selectedDate: Date;
  selectedTime: string;
  notes: string;
  setNotes: (notes: string) => void;
  setStep: (step: number) => void;
  onClose: () => void;
  resetModal: () => void;
}


const BookingSummary = ({ expert, selectedSession, selectedDate,
  selectedTime,
  notes,
  setNotes,
  setStep,
  onClose,
  resetModal,
}: BookingSummaryProps) => {
  const { user } = useAuth();
  const {mutate: bookSession} = useMutation({
    mutationFn: async (data: any) => {
      const booking = await ExpertsAPI.bookSession(expert.id, data);
      return booking;
    },
    onSuccess: () => {
      toast({
        title: "Session Booked Successfully!",
        description: `Your ${selectedSession?.name} with ${expert.name} has been confirmed.`,
      });
      setStep(1);
      resetModal();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error Booking Session",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  
  const handleConfirmBooking = () => {
    const [startHour, startMinute] = selectedTime.split(":").map(Number);
    const sessionStart = new Date(selectedDate);
    sessionStart.setHours(startHour, startMinute, 0, 0);

    const sessionEnd = addMinutes(sessionStart, selectedSession?.durationMinutes);

    const bookingPayload = {
      expertId: expert.id,
      sessionTypeId: selectedSession.id,
      userId: user.id,
      sessionDate: selectedDate.toISOString(),
      startTime: selectedTime,
      endTime: sessionEnd.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      durationMinutes: selectedSession?.durationMinutes,
      notes,
    };
  
    bookSession(bookingPayload);
  };

  return (
    <div className="space-y-6">
            {/* Booking Summary */}
            <div className="p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-foreground mb-3">
                Booking Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expert:</span>
                  <span className="font-medium">{expert.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Session Type:</span>
                  <span className="font-medium">{selectedSession?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">
                    {selectedSession?.durationMinutes} minutes
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-primary">
                  {selectedSession.currency} {selectedSession?.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium mb-2 flex items-center space-x-2">
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
                Payment will be processed securely after the session is
                completed. You can cancel up to 24 hours before your scheduled
                time.
              </p>
            </div>

            <div className="flex justify-between space-x-2 pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleConfirmBooking} className="flex-1">
                Confirm Booking - {selectedSession?.currency} {selectedSession?.price}
              </Button>
            </div>
          </div>
  );
};

interface TimeSelectionProps {
  selectedDate: Date;
  availabilitySlots: AvailabilitySlot[];
  selectedSession: SessionType;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
};



const TimeSelection = ({
  selectedDate,
  availabilitySlots,
  selectedSession,
  selectedTime,
  setSelectedTime,
}: TimeSelectionProps) => {
  return (
    <div>
      <label className="text-sm font-medium mb-3 block">Select Time</label>
      <div className="grid grid-cols-3 gap-2">
        {availabilitySlots.map((slot) => {
          const startTime = slot.startTime;
          const endTime = slot.endTime;

          return (
            <Button
              key={`${slot.startTime}-${slot.endTime}`}
              variant={selectedTime === startTime ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTime(startTime)}
              className="text-sm"
            >
              {startTime} - {endTime}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
