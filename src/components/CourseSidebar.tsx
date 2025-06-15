
import React from 'react';
import { CheckCircle, PlayCircle, Clock, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  current: boolean;
  locked: boolean;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  progress: number;
}

interface CourseSidebarProps {
  modules: Module[];
  onLessonSelect: (lessonId: string) => void;
  isEnrolled: boolean;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  modules,
  onLessonSelect,
  isEnrolled
}) => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Course Content</CardTitle>
        <div className="text-sm text-muted-foreground">
          {modules.length} modules • {modules.reduce((acc, mod) => acc + mod.lessons.length, 0)} lessons
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {modules.map((module) => (
          <div key={module.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">{module.title}</h4>
              <Badge variant="secondary" className="text-xs">
                {module.lessons.filter(l => l.completed).length}/{module.lessons.length}
              </Badge>
            </div>
            <Progress value={module.progress} className="h-1" />
            
            <div className="space-y-1">
              {module.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                    lesson.current 
                      ? 'bg-primary/10 border border-primary/20' 
                      : 'hover:bg-muted/50'
                  } ${lesson.locked && !isEnrolled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => {
                    if (!lesson.locked || isEnrolled) {
                      onLessonSelect(lesson.id);
                    }
                  }}
                >
                  <div className="mr-3">
                    {lesson.locked && !isEnrolled ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : lesson.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <PlayCircle className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{lesson.title}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {lesson.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
