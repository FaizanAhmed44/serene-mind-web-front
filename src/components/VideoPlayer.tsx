
import React, { useState } from 'react';
import { Play, Pause, Volume2, Maximize, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  duration: string;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  duration,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35);
  const [currentTime, setCurrentTime] = useState("5:23");

  return (
    <Card className="w-full">
      <div className="relative bg-black aspect-video rounded-t-lg overflow-hidden">
        {/* Video placeholder - in real app this would be actual video element */}
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <Button
            size="lg"
            className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8 text-white" />
            ) : (
              <Play className="h-8 w-8 text-white ml-1" />
            )}
          </Button>
        </div>
        
        {/* Video controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="space-y-2">
            <Progress value={progress} className="h-1" />
            <div className="flex items-center justify-between text-white text-sm">
              <div className="flex items-center space-x-4">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <span>{currentTime} / {duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            disabled={!hasPrevious}
            onClick={onPrevious}
          >
            Previous
          </Button>
          <Button 
            disabled={!hasNext}
            onClick={onNext}
          >
            Next Lesson
          </Button>
        </div>
      </div>
    </Card>
  );
};
