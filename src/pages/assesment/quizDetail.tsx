import  { useState } from "react";
import Option from "./option";
import QuizProgress from "./progress";
import Navigate from "./navigate";
import { Question, QUIZ_DATA } from "./types";
import { useNavigate, useParams } from "react-router-dom";

export const QuizDetail = () => {
    const { id } = useParams();
    const quiz = QUIZ_DATA.find((quiz) => quiz.id === id);
    const questions = quiz?.questions;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const navigate = useNavigate();

    if (!quiz) {
        return <div>Quiz not found</div>;
    }

    if (!questions) {
        return <div>No questions found</div>;
    }

    const onFinish = () => navigate("/assesment");
    const onPrevious = () => setCurrentQuestionIndex(currentQuestionIndex - 1);
    const onNext = () => setCurrentQuestionIndex(currentQuestionIndex + 1);

  return (
    <div className="" style={{ userSelect: "none" }}>
      <div className="h-10 mt-8 px-10">
        <QuizProgress answered={currentQuestionIndex + 1} total={questions?.length || 0} />
      </div>
      <QuestionCard question={questions[currentQuestionIndex]} questionIndex={currentQuestionIndex} />
      <Navigate currentQuestionIndex={currentQuestionIndex} totalQuestions={questions.length} onPrevious={onPrevious} onNext={onNext} />
    </div>
  );
};

const QuestionCard = ({ question, questionIndex }: { question: Question, questionIndex: number }) => {
  return (
    <div className="px-10 mx-auto gap-4 grid grid-cols-2 py-10 border-t border-b border-gray-200">
      <div className="space-y-6 text-gray-700">
        <p className="text-sm">Question</p>
        <p className="text-md">
          {question.question}
        </p>
      </div>
      <div className="space-y-4">
        <p className="text-sm">Select One</p>
        <div className="space-y-2">
          {question.options.map((option, idx) => (
            <Option name={(questionIndex + 1).toString()} id={option.id} value={option.value} label={option.label} badge={`press ${idx + 1}`} />
          ))}
        </div>
        <div>
          <span className="text-xs italic cursor-pointer border-b pb-2 mt-4">
            Clear Answer
          </span>
        </div>
      </div>
    </div>
  );
};
