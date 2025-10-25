import Sidebar from "../components/Sidebar";

const Home = () => {
  const appliedQuizzes = [
    { id: 1, title: "Math: Algebra Basics", description: "Solve algebra problems efficiently." },
    { id: 2, title: "Science: Acids and Bases", description: "Learn about chemical reactions." },
    { id: 3, title: "History: Ancient Civilizations", description: "Explore early civilizations." },
  ];

  const previousQuizzes = [
    { id: 4, title: "Math: Geometry", description: "Triangles, circles, and polygons." },
    { id: 5, title: "Science: Physics Basics", description: "Learn about motion and force." },
  ];

  const skippedQuizzes = [
    { id: 6, title: "English: Grammar", description: "Tenses, punctuation, and syntax." },
    { id: 7, title: "Geography: Maps", description: "Learn to read different types of maps." },
  ];

  return (
    <div className="flex h-screen bg-linear-to-b from-cyan-100 to-purple-200">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-10">
        {/* Container for the two cards */}
        <div className="flex gap-10">
          {/* Applied Quizzes Section - Box 1 */}
          <div className=" overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-130 h-170 shrink-0 rounded-[10%] border border-gray-300 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-6 flex flex-col bg-white mt-6">
            <h2 className="text-xl font-semibold mb-4 pt-10">Applied Quizzes</h2>

            {/* Flex container to push button to bottom */}
            <div className="flex-1 flex flex-col justify-between">
              {/* Quiz List Container */}
              <div className="flex-1 overflow-y-auto">
                {appliedQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center p-4 rounded-xl shadow-sm bg-purple-light hover:bg-purple-200 transition mb-4"
                  >
                    <div className="mr-3"> {/* Container for the SVG with right margin */}
                      <svg width="45" height="53" viewBox="0 0 45 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M37.886 0C39.116 0 40.115 1.18702 40.115 2.65002V12.606L20.06 36.456L20.046 47.687L29.509 47.703L40.115 35.091V50.35C40.115 51.813 39.116 53 37.886 53H2.229C0.998004 53 0 51.813 0 50.35V2.65002C0 1.18702 0.998004 0 2.229 0H37.886ZM41.849 18.041L45 21.788L27.666 42.4L24.51 42.395L24.515 38.653L41.849 18.041ZM20.057 26.5H8.914V31.8H20.057V26.5ZM26.743 15.9H8.914V21.2H26.743V15.9Z" fill="#5215D6" />
                      </svg>
                    </div>
                    <div className="flex-1"> {/* Container for text and button, takes remaining space */}
                      <div>
                        <p className="font-medium">{quiz.title}</p>
                        <p className="text-sm text-gray-500">{quiz.description}</p>
                      </div>
                    </div>
                    <button className="bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded-xl ml-4">
                      Start
                    </button>
                  </div>
                ))}
              </div>

              {/* Create New Quiz Button - Positioned at bottom right */}
              <div className="mt-6 self-end"> {/* Added self-end to align button to the right */}
                <button className="bg-[#D39CFFA1] hover:bg-[#c9b8ff] text-purple-800 px-6 py-3 rounded-xl font-medium transition w-[305px] h-[55px]"> {/* Applied Figma bg color, adjusted padding/size, added width/height */}
                  Create New Quiz
                </button>
              </div>
            </div>
          </div>

          {/* Previous + Skipped Quizzes Section - Box 2 */}
          <div className=" overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-130 shrink-0 h-170 rounded-[10%] border border-gray-300 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-6 flex flex-col bg-white mt-6">
            <h2 className="text-xl font-semibold mb-4 pt-10">Previous Quizzes</h2>

            <div className="flex-1 overflow-y-auto">
              {/* Previous Quizzes List */}
              <div className="mb-6">
                {previousQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center p-4 rounded-xl shadow-sm bg-purple-light hover:bg-purple-200 transition mb-4"
                  >
                    <div className="mr-3"> {/* Container for the SVG with right margin */}
                      <svg width="45" height="53" viewBox="0 0 45 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M37.886 0C39.116 0 40.115 1.18702 40.115 2.65002V12.606L20.06 36.456L20.046 47.687L29.509 47.703L40.115 35.091V50.35C40.115 51.813 39.116 53 37.886 53H2.229C0.998004 53 0 51.813 0 50.35V2.65002C0 1.18702 0.998004 0 2.229 0H37.886ZM41.849 18.041L45 21.788L27.666 42.4L24.51 42.395L24.515 38.653L41.849 18.041ZM20.057 26.5H8.914V31.8H20.057V26.5ZM26.743 15.9H8.914V21.2H26.743V15.9Z" fill="#5215D6" />
                      </svg>
                    </div>
                    <div className="flex-1"> {/* Container for text and button, takes remaining space */}
                      <div>
                        <p className="font-medium">{quiz.title}</p>
                        <p className="text-sm text-gray-500">{quiz.description}</p>
                      </div>
                    </div>
                    <button className="bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded-xl ml-4">
                      Start
                    </button>
                  </div>
                ))}
              </div>

              {/* Skipped Quizzes Subsection */}
              <div >
                <h3 className="text-lg font-semibold mb-4">Skipped Quizzes</h3>
                {skippedQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="flex items-center p-4 rounded-xl shadow-sm bg-purple-light hover:bg-purple-200 transition mb-4"
                  >
                    <div className="mr-3"> {/* Container for the SVG with right margin */}
                      <svg width="45" height="53" viewBox="0 0 45 53" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M37.886 0C39.116 0 40.115 1.18702 40.115 2.65002V12.606L20.06 36.456L20.046 47.687L29.509 47.703L40.115 35.091V50.35C40.115 51.813 39.116 53 37.886 53H2.229C0.998004 53 0 51.813 0 50.35V2.65002C0 1.18702 0.998004 0 2.229 0H37.886ZM41.849 18.041L45 21.788L27.666 42.4L24.51 42.395L24.515 38.653L41.849 18.041ZM20.057 26.5H8.914V31.8H20.057V26.5ZM26.743 15.9H8.914V21.2H26.743V15.9Z" fill="#5215D6" />
                      </svg>
                    </div>
                    <div className="flex-1"> {/* Container for text and button, takes remaining space */}
                      <div>
                        <p className="font-medium">{quiz.title}</p>
                        <p className="text-sm text-gray-500">{quiz.description}</p>
                      </div>
                    </div>
                    <button className="bg-purple-400 hover:bg-purple-500 text-white px-4 py-2 rounded-xl ml-4">
                      Start
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;