import { Link } from "react-router-dom";
import { Quiz } from "../../pages/assesment/types";
import { ChevronRight } from "lucide-react";
import AgreementDialog from "./agreement";
import { useState } from "react";
import { AssesmentsAPI } from "@/api/assesments";
import { useQuery } from "@tanstack/react-query";
import { CustomLoader } from "@/components/CustomLoader";

const QuizCard = ({quiz}: {quiz: Quiz}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: latestSubmission, isLoading: isLatestSubmissionLoading } = useQuery({
    queryKey: ["latestSubmission", quiz.id],
    queryFn: () => AssesmentsAPI.getLatestSubmission(quiz.id),
  });

  if (isLatestSubmissionLoading) {
    return <CustomLoader />;
  }

  return (
    <div>
      <div
        key={quiz.title}
        onClick={() => setIsDialogOpen(true)}
        className="
              flex items-center gap-4
              rounded-2xl bg-white dark:bg-gray-800 
              border border-gray-200 dark:border-gray-700
              shadow-sm hover:shadow-md transition-all duration-200
              p-4 sm:p-6 cursor-pointer
            "
      >

        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {quiz.title}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {quiz.description}
          </p>
          <div className="mt-4">
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {latestSubmission ? (
                <>
                  <span className="font-semibold">Your Result</span>: {latestSubmission.score} / {quiz.questions.length}
                </>
              ) : (
                <span className="italic text-gray-400">No Submissions yet</span>
              )}
            </span>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
      </div>
      <AgreementDialog id={quiz.id} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} instructions={quiz.instructions} />
    </div>
  );
};

export default QuizCard;
