
import React from "react";

const QuizSection = ({ title, quizzes }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-80 max-w-md">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {quizzes && quizzes.length > 0 ? (
        <div className="flex flex-col gap-4">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex justify-between items-center p-4 rounded-xl shadow-sm bg-gray-50 hover:bg-gray-100 transition"
            >
              <div>
                <p className="font-medium">{quiz.title}</p>
                <p className="text-sm text-gray-500">{quiz.description}</p>
              </div>
              <button className="bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded-xl">
                Start
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No quizzes available.</p>
      )}
    </div>
  );
};

export default QuizSection;