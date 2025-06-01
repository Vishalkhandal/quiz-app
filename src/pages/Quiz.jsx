import { ProgressBar } from '../components/ProgressBar';
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import { useQuiz } from '../context/QuizContext';
import { useFirebase } from '../context/FirebaseContext';
import { SkipForward } from 'lucide-react'

function Quiz() {
  const { selectedCategory, setScore, answers, setAnswers } = useQuiz();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30)
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const firebase = useFirebase();

  useEffect(() => {
    if (!selectedCategory) {
      navigate("/")
      return;
    }
    // Fetch quizzes for the selected category
    firebase.fetchQuizzes(selectedCategory.id).then(quizzes => {
      // Assuming each quiz has a questions array, pick the first quiz for the category
      if (quizzes.length > 0) {
        setQuestions(quizzes[0].questions || []);
      }
    });
  }, [selectedCategory, firebase, navigate]);

  const currentQ = questions[currentQuestion];

  useEffect(() => {
    if (timeLeft > 0 && currentQ) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  });

  if (!currentQ) return <div>Loading...</div>;

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(30);
    } else {
      finishQuiz();
    }
  };

  const handleAnswer = (optionIndex) => {
    setAnswers({ ...answers, [currentQuestion]: optionIndex });
  };

  const handleSkip = () => {
    handleNextQuestion();
  };

  const finishQuiz = () => {
    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        correctAnswers++;
      }
    });
    setScore(Math.round((correctAnswers / questions.length) * 100));
    // Optionally store result in Firestore
    firebase.addUserQuizResult({
      userId: firebase.user?.uid,
      quizId: selectedCategory.id, // or quizId if available
      categoryId: selectedCategory.id,
      score: Math.round((correctAnswers / questions.length) * 100),
      answers: Object.values(answers)
    });
    navigate("/result")
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center p-4">
      <div className="max-w-2xl mt-8 mb-8 mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{selectedCategory.name} Quiz</h2>
              <button
                onClick={handleSkip}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <SkipForward size={16} />
                Skip
              </button>
            </div>
            <ProgressBar
              current={currentQuestion}
              total={questions.length}
              timeLeft={timeLeft}
            />
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">{currentQ.question}</h3>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${answers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="text-sm text-gray-500">
              Time remaining: {timeLeft} seconds
            </div>
            <button
              onClick={handleNextQuestion}
              disabled={answers[currentQuestion] === undefined}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz