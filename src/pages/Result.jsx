import { CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router';
import { useQuiz } from '../context/QuizContext';
import { useFirebase } from '../context/FirebaseContext';
import { useEffect, useState } from 'react';

function Result() {
    const { score, selectedCategory, resetQuiz } = useQuiz();
    const firebase = useFirebase();
    const {user} = useFirebase();
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (user) {
            firebase.fetchUserQuizResults(user.uid).then(setResults);
            firebase.fetchCategories().then(setCategories);
        }
    }, [user, firebase]);

    if (score === null || !selectedCategory) {
        navigate('/')
        return null;
    } 

    const handleRetake = () => {
        resetQuiz();
        navigate("/");
    }

    // Helper to get category name by id
    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id === id);
        return cat ? cat.name : id;
    };

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

                {/* Example: Show user's last 3 results */}
                <div className="mt-8 text-left">
                    <h3 className="font-semibold text-gray-700 mb-2">Your Recent Results</h3>
                    <ul className="text-gray-600 text-sm space-y-1">
                        {results.slice(-3).reverse().map(r => (
                            <li key={r.id}>
                                {getCategoryName(r.categoryId)} - {r.score}%
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Result

