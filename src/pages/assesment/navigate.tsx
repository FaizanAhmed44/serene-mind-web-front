import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import CompletionDialog from "./completion";

interface NavigateProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
}

const Navigate = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
}: NavigateProps) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white  z-0 flex justify-end items-center gap-2 h-14 px-10">
      <PreviousButton
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
      />
      <NextButton
        onClick={onNext}
        isLast={currentQuestionIndex === totalQuestions - 1}
      />
    </div>
  );
};

export default Navigate;

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  isLast?: boolean;
}

export const NextButton: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  isLast = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={isLast ? () => setIsOpen(true) : onClick}
        className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-primary border  text-white text-sm font-medium h-10 px-5 py-1 transition-all duration-200 hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLast ? (
          "Finish"
        ) : (
          <>
            Next
            <ArrowRightIcon className="h-4 w-4" />
          </>
        )}
      </button>
      <CompletionDialog isOpen={isOpen} />
    </>
  );
};

export const PreviousButton: React.FC<ButtonProps> = ({
  onClick,
  disabled = false
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="relative inline-flex items-center justify-center gap-2 rounded-xl  border border-primary text-primary text-sm font-medium h-10 px-5 py-1 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="arrow-right">
        <ArrowLeftIcon className="h-4 w-4" />
      </span>
      <span>Previous</span>
    </button>
  );
};
