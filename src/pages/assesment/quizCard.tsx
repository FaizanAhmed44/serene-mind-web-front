import { Link } from "react-router-dom";
import { Quiz } from "./types";
import { ChevronRight } from "lucide-react";
import AgreementDialog from "./agreement";
import { useState } from "react";

const QuizCard = ({quiz}: {quiz: Quiz}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
        <div
          className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl"
          style={{ backgroundColor: quiz.iconbg, opacity: 0.9 }}
        >
          <img
            src={quiz.icon}
            alt={quiz.title}
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {quiz.title}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {quiz.description}
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
      </div>
      <AgreementDialog id={quiz.id} isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
};

export default QuizCard;
