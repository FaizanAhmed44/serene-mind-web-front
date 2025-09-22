import { motion } from "framer-motion";
import { Quiz } from "../../pages/assesment/types";
import { AssesmentsAPI } from "@/api/assesments";
import { useQuery } from "@tanstack/react-query";
import { CustomLoader } from "@/components/CustomLoader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export const ProfilePageGrowthAssesment = () => {
  const {
    data: quizzes = [],
    isLoading: isQuizzesLoading,
    error: quizzesError
  } = useQuery({
    queryKey: ["assesments"],
    queryFn: () => AssesmentsAPI.getAssesments()
  });

  if (isQuizzesLoading) {
    return <CustomLoader />;
  }

  if (quizzesError) {
    return <div>Error loading quizzes</div>;
  }

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="border border-border/20 bg-background/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-base md:text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Growth Assesments
            </CardTitle>
            {quizzes.length > 0 && (
              <Link
                to="/assesment"
                className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-all duration-200"
              >
                View All
              </Link>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {quizzes?.slice(0, 3).map((quiz, index) => (
            <ListItem quiz={quiz} index={index} />
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ListItem = ({ quiz, index }: { quiz: Quiz, index: number }) => {
    const { data: latestSubmission, isLoading: isLatestSubmissionLoading } = useQuery({
        queryKey: ["latestSubmission", quiz.id],
        queryFn: () => AssesmentsAPI.getLatestSubmission(quiz.id),
    });

  if (isLatestSubmissionLoading) {
    return <span>Loading...</span>;
  }

  return (
    <motion.div
      key={quiz.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
      className="md:flex justify-between items-start"
    >
      <div>
        <p className="text-base text-muted-foreground">
            {quiz.title}
        </p>
      </div>
      <span className="text-sm text-foreground flex items-center text-end min-w-[150px] justify-end">
        <span>
          {latestSubmission ? `${latestSubmission.score} / ${quiz.questions.length}` : <span className="text-muted-foreground italic">No Submission</span>}
        </span>
        <span className="mx-2 h-4 border-l border-border" />
        <Link
          to={`/assesment/${quiz.id}`}
          target="_blank"
          className="ml-0 hover:underline text-muted-foreground hover:text-primary"
        >
          {latestSubmission ? "Retake" : "Take"}
        </Link>
      </span>
    </motion.div>
  );
};
