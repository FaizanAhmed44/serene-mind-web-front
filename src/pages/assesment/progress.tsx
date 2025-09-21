interface ProgressProps {
  answered: number;
  total: number;
  brandColor?: string;
}

const QuizProgress: React.FC<ProgressProps> = ({
  answered,
  total,
}) => {
  const percentage = total > 0 ? (answered / total) * 100 : 0;

  return (
    <div className="w-full mx-auto relative">
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex items-center">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            percentage > 0 ? "bg-primary" : "bg-gray-200"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          left: `calc(${percentage}% - 4px)`
        }}
      >
        <div
          className="flex items-center justify-center bg-white border border-gray-200 shadow-sm rounded-md px-2 py-2 text-lg font-medium"
          style={{
            color: "#184B33",
            boxShadow: "0 2px 8px 0 rgba(24,75,51,0.04)"
          }}
        >
          <span className="font-montserrat text-xs">{answered}</span>
          <span className="mx-1 text-gray-400 font-normal text-xs">/</span>
          <span className="text-gray-400 font-normal text-xs">{total}</span>
        </div>
      </div>
    </div>
  );
};

export default QuizProgress;
