import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  onToggleRecording: () => void;
  isRecording: boolean;
  isLoading: boolean;
  isPlayingAudio: boolean;
};

const VoiceTherapy: React.FC<Props> = ({ 
  onToggleRecording, 
  isRecording, 
  isLoading, 
  isPlayingAudio 
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
    <div style={{ position: 'absolute', bottom: 20, left: 20, zIndex: 10 }}>
      <Button 
        onClick={onToggleRecording} 
        variant={getButtonVariant()}
        disabled={isLoading || isPlayingAudio}
        className="flex items-center gap-2"
      >
        <Mic className="w-4 h-4" />
        {getButtonText()}
      </Button>
      <div className="mt-2 text-xs text-muted-foreground text-center font-medium">
        Sessions left: <span className="text-accent font-bold">{user.minaSessionCount}</span>
      </div>
    </div>
    
  );
};

export default VoiceTherapy;