import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

type Props = {
  onToggleRecording: () => void;
  isRecording: boolean;
  isLoading: boolean;
  isPlayingAudio: boolean;
  isMobile?: boolean;
};

const VoiceTherapy: React.FC<Props> = ({ 
  onToggleRecording, 
  isRecording, 
  isLoading, 
  isPlayingAudio,
  isMobile = false
}) => {

  const { user } = useAuth();    

  const getButtonText = () => {
    if (isRecording) return 'Stop Recording';
    if (isLoading) return 'Processing...';
    if (isPlayingAudio) return 'MINA is Speaking...';
    return 'Start Talking';
  };

  const getButtonVariant = () => {
    if (isRecording) return 'destructive';
    return 'default';
  };

  return (
    <div className={cn(
      "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full px-4",
      "md:absolute md:bottom-4 md:left-4 md:translate-x-0 md:w-auto md:px-0"
    )}>
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          <Button 
            onClick={onToggleRecording} 
            variant={getButtonVariant()}
            disabled={isLoading || isPlayingAudio}
            className={cn(
              "flex items-center gap-2 transition-all duration-200",
              // Mobile: Smaller button
              isMobile ? "py-3 px-4 text-sm font-medium rounded-lg h-10" : 
              // Desktop: Regular size
              "py-4 px-6 rounded-full"
            )}
            size={isMobile ? "sm" : "default"}
          >
            <Mic className={cn(
              // Mobile: Smaller icon
              isMobile ? "w-3.5 h-3.5" : 
              // Desktop: Regular icon
              "w-4 h-4"
            )} />
            {getButtonText()}
          </Button>
          
          {/* Sessions info */}
          <div className={cn(
            "text-muted-foreground text-center font-medium mt-2",
            // Mobile: Smaller text
            isMobile ? "text-xs bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm" : 
            // Desktop: Regular text
            "text-sm"
          )}>
            Sessions left: <span className="text-accent font-bold">{user.minaSessionCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceTherapy;