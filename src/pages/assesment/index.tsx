import { Link } from "react-router-dom";
import { Quiz, QUIZ_DATA } from "./types";
import { useState } from "react";
import { ArrowLeftIcon, ArrowRight, ChevronRight, MoveLeft } from "lucide-react";
import AgreementDialog from "./agreement";
import QuizCard from "./quizCard";

const QuizPage = () => {

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Heading />
        <QuizList />
      </div>
    </div>
  );
};

export default QuizPage;

const QuizList = () => {
  return (
    <main>
      <section className="grid gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2">
        {QUIZ_DATA.map((quiz) => (
          <QuizCard quiz={quiz} />
        ))}
      </section>
    </main>
  );
};

const Heading = () => {
    return (
    <section className="space-y-1 mb-10">
        <Link to="/profile" className="group flex items-center gap-2 text-sm mb-4 text-gray-500 hover:text-primary cursor-pointer transition-all duration-200">
            <MoveLeft className="w-4 h-4 group-hover:-translate-x-1 transition-all duration-200" /> Back to Profile
        </Link>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Growth Assesments
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-300">
          Explore quizzes on psychology & mental growth. Track your progress and
          retake anytime.
        </p>
      </section>
    )
}