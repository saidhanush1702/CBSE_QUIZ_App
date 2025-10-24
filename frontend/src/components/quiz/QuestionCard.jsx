import OptionButton from "./OptionButton";

export default function QuestionCard({ q, onAnswer, selected, isCorrect }) {
    const correctId = q.answer || q.options.find(o => o.correct).id;

    return (
        <div className="bg-[#7E2AF6] text-white mx-8 p-6 rounded-2xl mt-6 shadow-lg">
            <div className="flex justify-between text-sm">
                <span className="px-3 py-1 bg-purple-800 rounded-full">MCQ</span>
                <span className="flex gap-2">
                    <span className="px-3 py-1 bg-orange-400 rounded-full text-black">
                        {q.difficulty || "Level"}
                    </span>
                </span>
            </div>

            <p className="text-lg font-medium mt-5">{q.question}</p>

            <div className="flex flex-wrap justify-between mt-6">
                {q.options.map(option => (
                    <OptionButton
                        key={option.id}
                        {...option}
                        onSelect={onAnswer}
                        selected={selected === option.id}
                        correct={isCorrect !== null && option.id === correctId}
                        wrong={isCorrect === false && selected === option.id}
                        disabled={selected !== null}
                    />
                ))}
            </div>
        </div>
    );
}