import { CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';

function Result() {
    const {user} = useAuth()
    const {score, selectedCategory, resetQuiz} = useQuiz();
    const navigate = useNavigate();

    if(score === null || !selectedCategory) {
        navigate('/')
        return null;
    } 

    const handleRetake = () => {
        resetQuiz();
        navigate("/");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
                <div className="mb-6">
                    <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
                    <p className="text-gray-600">Great job, {user?.name}!</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
                    <p className="text-gray-600">Your Score</p>
                    <div className="mt-4 text-sm text-gray-500">
                        Category: {selectedCategory.name}
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleRetake}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Take Another Quiz
                    </button>
                    <button
                        onClick={() => navigate('/leaderboard')}
                        className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        View Leaderboard
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Result

