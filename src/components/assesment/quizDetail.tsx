import { useEffect, useState } from "react";
import Option from "./option";
import QuizProgress from "./progress";
import Navigate from "./navigate";
import { useParams } from "react-router-dom";
import { QuizQuestion, AssesmentSubmission } from "../../pages/assesment/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AssesmentsAPI } from "@/api/assesments";
import { CustomLoader } from "@/components/CustomLoader";
import { Control, Controller, useForm } from "react-hook-form";
import CompletionDialog from "./completion";

export const QuizDetail = () => {
  const { id } = useParams();
  const [isCompletionDialogOpen, setIsCompletionDialogOpen] = useState(false);
  const [submissionResponse, setSubmissionResponse] = useState<any>(null);

  const {
    data: quiz,
    isLoading: isQuizLoading,
    error: isQuizError
  } = useQuery({
    queryKey: ["quiz", id],
    queryFn: () => AssesmentsAPI.getAssesment(id),
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const { control, handleSubmit, reset, watch } = useForm<AssesmentSubmission>({
    defaultValues: { answers: [{ questionId: "", optionId: "" }] },
    mode: "onChange"
  });

  useEffect(() => {
    if (quiz?.questions) {
      reset({
        answers: quiz.questions.map(q => ({
          questionId: q.id,
          optionId: ""
        }))
      });
    }
  }, [quiz, reset]);

  const { mutate: submitAssesment, isPending: isSubmitting } = useMutation({
    mutationFn: (data: AssesmentSubmission) =>
      AssesmentsAPI.submitAssesment(id!, data),
    onSuccess: (data) => {
      setSubmissionResponse(data);
      setIsCompletionDialogOpen(true);
    },
  });

  if (isQuizLoading) {
    return <CustomLoader />;
  }

  if (isQuizError) {
    return <div>Error loading quiz</div>;
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  if (!quiz.questions) {
    return <div>No questions found</div>;
  }

  const onSubmit = (data: AssesmentSubmission) => {
    submitAssesment(data);
  };

  const onPrevious = () => setCurrentQuestionIndex(currentQuestionIndex - 1);
  const onNext = () => setCurrentQuestionIndex(currentQuestionIndex + 1);

  return (
    <div className="" style={{ userSelect: "none" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="h-10 mt-8 px-10">
          <QuizProgress
            answered={currentQuestionIndex + 1}
            total={quiz.questions?.length || 0}
          />
        </div>
        <QuestionCard
          question={quiz.questions[currentQuestionIndex]}
          questionIndex={currentQuestionIndex}
          control={control}
        />
        <Navigate
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={quiz.questions.length}
          onPrevious={onPrevious}
          onNext={onNext}
          isNextDisabled={!watch(`answers.${currentQuestionIndex}`)?.optionId || isSubmitting}
        />
        {submissionResponse && <CompletionDialog isOpen={isCompletionDialogOpen} submissionResponse={submissionResponse} totalQuestions={quiz.questions.length} scoringCriteria={quiz.scoring_criteria || ""} />}
      </form>
    </div>
  );
};

interface QuestionCardProps {
  question: QuizQuestion;
  questionIndex: number;
  control: Control<AssesmentSubmission>;
}

const QuestionCard = ({
  question,
  questionIndex,
  control
}: QuestionCardProps) => {
  return (
    <div className="px-10 mx-auto gap-4 grid sm:grid-cols-2 grid-cols-1 py-10 border-t border-gray-200">
      <div className="space-y-6 text-gray-700">
        <p className="text-sm">Question</p>
        <p className="text-md">{question.text}</p>
        {question.image && <div className="max-w-xs">
          <img src={question.image} alt={question.text} className="w-full h-auto" />
        </div>}
      </div>
      <div className="space-y-4">
        <p className="text-sm">Select One</p>
        <Controller
          name={`answers.${questionIndex}`}
          control={control}
          rules={{ validate: (value) => !!value?.optionId || "Select an option" }}
          render={({ field }) => (
            <div className="space-y-2">
              {question.options.map((option, idx) => (
                <Option
                  key={option.id}
                  name={`answers.${questionIndex}.optionId`}
                  questionId={question.id}
                  option={option}
                  badge={`press ${idx + 1}`}
                  checked={field.value?.optionId === option.id}
                  onChange={(answer) => field.onChange(answer)}
                />
              ))}
              <div
                className="text-xs italic cursor-pointer py-10"
                onClick={() =>
                  field.onChange({ questionId: question.id, optionId: "" })
                }
              >
                <span className="text-gray-500 border-b pb-1">Clear Answer</span>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );
};
