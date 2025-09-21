import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CompletionDialog = ({
  isOpen,
  score = 8,
  total = 10,
  percentage = 80,
  correct = 8,
  incorrect = 2,
  timeTaken = "7m 32s"
}: {
  isOpen: boolean;
  score?: number;
  total?: number;
  percentage?: number;
  correct?: number;
  incorrect?: number;
  timeTaken?: string;
}) => {
  const navigate = useNavigate();
  
  return (
    <Dialog open={isOpen} onOpenChange={() => navigate("/assesment")}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Assessment Completed</span>
          </DialogTitle>
        </DialogHeader>
        <Completion
          onClose={() => navigate("/assesment")}
          score={score}
          total={total}
          percentage={percentage}
          correct={correct}
          incorrect={incorrect}
          timeTaken={timeTaken}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CompletionDialog;


interface CompletionProps {
  onClose: () => void;
  score: number;
  total: number;
  percentage: number;
  correct: number;
  incorrect: number;
  timeTaken: string;
}

const Completion = ({
  onClose,
  score,
  total,
  percentage,
  correct,
  incorrect,
  timeTaken
}: CompletionProps) => {

  return (
    <div className="flex flex-col items-center justify-center py-8 px-2 space-y-6">
      <CheckCircle2 className="w-16 h-16 text-green-500 mb-2" />
      <h2 className="text-2xl font-bold text-center">Congratulations!</h2>
      <p className="text-center text-muted-foreground">
        You have successfully completed the assessment
      </p>

      <div className="w-full flex flex-col items-center gap-2 mt-2">
        <div className="w-full bg-gray-50 rounded-lg border p-4 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold text-primary">{score}</span>
            <span className="text-lg text-muted-foreground">/ {total}</span>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            Score
          </div>
          <div className="mt-2 flex gap-4 text-sm">
            <span className="text-green-600 font-medium">Correct: {correct}</span>
            <span className="text-red-500 font-medium">Incorrect: {incorrect}</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Time Taken: {timeTaken}
          </div>
          <div className="mt-2">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                percentage >= 70
                  ? "bg-green-100 text-green-700"
                  : percentage >= 40
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {percentage}% {percentage >= 70 ? "Passed" : "Needs Improvement"}
            </span>
          </div>
        </div>
        <Button className="w-full mt-4" onClick={onClose}>
          Back to Assessments
        </Button>
      </div>
    </div>
  );
};
