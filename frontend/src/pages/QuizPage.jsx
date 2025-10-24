import { useState, useEffect } from "react";
import { fetchQuestions } from "../api/useQuestionStore";
import Header from "../components/quiz/Header";
import ProgressBar from "../components/quiz/ProgressBar";
import QuestionCard from "../components/quiz/QuestionCard";
import FooterNav from "../components/quiz/FooterNav";

export default function QuizPage() {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await fetchQuestions();
            setQuestions(data);
            setLoading(false);
        }
        load();
    }, []);

    function handleAnswer(optionId) {
        if (selected) return; // prevent double clicking

        setSelected(optionId);

        const currentQ = questions[currentIndex];
        const correctId = currentQ.answer ||
            currentQ.options.find(o => o.correct)?.id;

        setIsCorrect(optionId === correctId);
    }

    function nextQuestion() {
        setSelected(null);
        setIsCorrect(null);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            console.log("Quiz Ended");
        }
    }

    if (loading) {
        return <div className="text-center mt-20 text-lg">Loading Questions…</div>;
    }

    return (
        <>
            <Header />
            <div className="px-30">
                <ProgressBar current={currentIndex + 1} total={questions.length} />
                <QuestionCard
                    q={questions[currentIndex]}
                    onAnswer={handleAnswer}
                    selected={selected}
                    isCorrect={isCorrect}
                />
                <FooterNav onNext={nextQuestion} />
            </div>
        </>
    );
}