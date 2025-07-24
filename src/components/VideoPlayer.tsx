import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CoursesExpertAPI } from "@/api/courses";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  videoUrl: string | null;
  title: string;
  duration: string;
  hasNext: boolean;
  hasPrevious: boolean;
  onNext: () => void;
  onPrevious: () => void;
  courseId: string;
  lessonId: string;
  completed: boolean;
}

function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

function extractYouTubeId(url: string): string | null {
  try {
    const shortMatch = url.match(/youtu\.be\/([^\?\&]+)/);
    const longMatch = new URL(url).searchParams.get("v");
    return shortMatch?.[1] || longMatch;
  } catch {
    return null;
  }
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  duration,
  hasNext,
  hasPrevious,
  onNext,
  onPrevious,
  courseId,
  lessonId,
  completed,
}) => {
  const queryClient = useQueryClient();

  const markCompleteMutation = useMutation({
    mutationFn: () => CoursesExpertAPI.markLessonComplete(courseId, lessonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress", courseId] });
    },
    onError: (error) => {
      console.error("Error marking lesson as completed:", error);
    },
  });

  if (!videoUrl) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          This lesson has no video content available.
        </div>
      </div>
    );
  }

  const isYouTube = isYouTubeUrl(videoUrl);
  const videoId = isYouTube ? extractYouTubeId(videoUrl) : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
        {isYouTube && embedUrl ? (
          <iframe
            className="w-full h-full"
            src={embedUrl}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <video
            controls
            src={videoUrl}
            className="w-full h-full object-cover"
            title={title}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{duration}</p>
        </div>
        <div className="flex space-x-2">
          <Button
            disabled={!hasPrevious}
            onClick={onPrevious}
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          >
            Previous
          </Button>
          <Button
            disabled={!hasNext}
            onClick={onNext}
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          >
            Next
          </Button>
          <Button
            disabled={completed || markCompleteMutation.isPending}
            onClick={() => markCompleteMutation.mutate()}
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          >
            {completed ? "Completed" : "Mark as Completed"}
          </Button>
        </div>
      </div>
    </div>
  );
};