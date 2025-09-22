export type Quiz = {
  id: string;
  title: string;
  description?: string | null;
  instructions?: string | null;
  scoring_criteria?: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  questions: QuizQuestion[];
  // Optionally, you can add submissions?: QuizSubmission[] if needed
};

export type QuizQuestion = {
  id: string;
  quizId: string;
  text?: string | null;
  image?: string | null;
  order: number;
  options: QuizOption[];
};

export type QuizOption = {
  id: string;
  questionId: string;
  text?: string | null;
  image?: string | null;
  isCorrect: boolean;
  // Optionally, you can add submissions?: QuizSubmissionAnswer[] if needed
};

export type QuizSubmission = {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  submittedAt: string; // ISO date string
  answers: QuizSubmissionAnswer[];
};

export type QuizSubmissionAnswer = {
  id: string;
  submissionId: string;
  questionId: string;
  optionId?: string | null;
  isCorrect?: boolean | null;
};

export type SubmitAnswer = {
  questionId: string;
  optionId: string;
};

export type AssesmentSubmission = {
  answers: SubmitAnswer[];
}

export type Quizzes = Quiz[];
