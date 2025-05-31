import { useState, createContext, useContext } from "react";

const QuizContext = createContext();

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider = ({ children }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);

    const resetQuiz = () => {
        setSelectedCategory(null);
        setAnswers({});
        setScore(null);
    }
    return (
        <QuizContext.Provider value={{
            selectedCategory,
            setSelectedCategory,
            answers,
            setAnswers,
            score,
            setScore,
            resetQuiz
        }}>
            {children}
        </QuizContext.Provider>
    )
}
