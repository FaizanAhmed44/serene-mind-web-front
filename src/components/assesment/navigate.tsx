import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

interface NavigateProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
}

const Navigate = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  isNextDisabled
}: NavigateProps) => {
  return (
    <div className="border-t border-gray-200 fixed bottom-0 left-0 w-full bg-white  z-0 flex justify-end items-center gap-2 h-20 px-10">
      <PreviousButton
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
      />
      <NextButton
        onClick={onNext}
        disabled={isNextDisabled}
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
  isLast = false
}) => {
  return (
    <>
      <button
        type={isLast ? "submit" : "button"}
        disabled={disabled}
        onClick={isLast ? undefined : onClick}
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
