export type Quiz = {
  id: string;
  title: string;
  description: string;
  icon: string;
  iconbg: string;
  questions?: Question[];
};

export type Quizzes = Quiz[];

export type Option = {
  id: string;
  value: string;
  label: string;
};

export type Question = {
  question: string;
  options: Option[];
  answer: string;
};

export const QUIZ_DATA: Quiz[] = [
  {
    id: "1",
    title: "Mental Well-being Self-Assessment",
    description: "This assessment will help you understand your mental well-being and identify areas for improvement.",
    icon: "https://cdn-icons-png.flaticon.com/512/3062/3062637.png", // relevant icon: brain/mental health
    iconbg: "#4F8A8B",
    questions: [
      {
        question: "How often have you felt down, depressed, or hopeless in the last two weeks?",
        options: [
          { id: "1", value: "0", label: "Not at all" },
          { id: "2", value: "1", label: "Several days" },
          { id: "3", value: "2", label: "More than half the days" },
          { id: "4", value: "3", label: "Nearly every day" }
        ],
        answer: ""
      },
      {
        question: "How often have you had trouble falling or staying asleep, or sleeping too much?",
        options: [
          { id: "1", value: "0", label: "Not at all" },
          { id: "2", value: "1", label: "Several days" },
          { id: "3", value: "2", label: "More than half the days" },
          { id: "4", value: "3", label: "Nearly every day" }
        ],
        answer: ""
      },
      {
        question: "How often have you felt little interest or pleasure in doing things?",
        options: [
          { id: "1", value: "0", label: "Not at all" },
          { id: "2", value: "1", label: "Several days" },
          { id: "3", value: "2", label: "More than half the days" },
          { id: "4", value: "3", label: "Nearly every day" }
        ],
        answer: ""
      },
      {
        question: "How often have you felt nervous, anxious, or on edge?",
        options: [
          { id: "1", value: "0", label: "Not at all" },
          { id: "2", value: "1", label: "Several days" },
          { id: "3", value: "2", label: "More than half the days" },
          { id: "4", value: "3", label: "Nearly every day" }
        ],
        answer: ""
      },
      {
        question: "How often have you been unable to stop or control worrying?",
        options: [
          { id: "1", value: "0", label: "Not at all" },
          { id: "2", value: "1", label: "Several days" },
          { id: "3", value: "2", label: "More than half the days" },
          { id: "4", value: "3", label: "Nearly every day" }
        ],
        answer: ""
      }
    ]
  },
  {
    id: "2",
    title: "Stress Level Check",
    description: "This assessment will help you understand your stress level and identify areas for improvement.",
    icon: "https://cdn-icons-png.flaticon.com/512/1680/1680899.png", // stress/pressure icon
    iconbg: "#F9B208",
    questions: [
      {
        question: "How often do you feel overwhelmed by your responsibilities?",
        options: [
          { id: "1", value: "0", label: "Never" },
          { id: "2", value: "1", label: "Rarely" },
          { id: "3", value: "2", label: "Sometimes" },
          { id: "4", value: "3", label: "Often" }
        ],
        answer: ""
      },
      {
        question: "How often do you find it hard to relax?",
        options: [
          { id: "1", value: "0", label: "Never" },
          { id: "2", value: "1", label: "Rarely" },
          { id: "3", value: "2", label: "Sometimes" },
          { id: "4", value: "3", label: "Often" }
        ],
        answer: ""
      },
      {
        question: "How often do you feel irritable or easily annoyed?",
        options: [
          { id: "1", value: "0", label: "Never" },
          { id: "2", value: "1", label: "Rarely" },
          { id: "3", value: "2", label: "Sometimes" },
          { id: "4", value: "3", label: "Often" }
        ],
        answer: ""
      },
      {
        question: "How often do you experience headaches, muscle tension, or other physical symptoms of stress?",
        options: [
          { id: "1", value: "0", label: "Never" },
          { id: "2", value: "1", label: "Rarely" },
          { id: "3", value: "2", label: "Sometimes" },
          { id: "4", value: "3", label: "Often" }
        ],
        answer: ""
      }
    ]
  }
];
