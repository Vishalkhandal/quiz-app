import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useQuiz } from '../context/QuizContext'
import { useNavigate } from 'react-router'
import { useFirebase } from '../context/FirebaseContext'

export const Categories = () => {
    const { setSelectedCategory, resetQuiz } = useQuiz();
    const navigate = useNavigate();
    const firebase = useFirebase();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        firebase.fetchCategories().then(setCategories);
    }, [firebase]);

    const handleCategorySelect = (category) => {
        resetQuiz();
        setSelectedCategory(category)
        navigate('/quiz')
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Category</h2>
                <p className="text-gray-600">Select a category to start your quiz adventure!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        onClick={() => handleCategorySelect(category)}
                        className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        <div className="text-center">
                            <div className="text-4xl mb-4">{category.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.name}</h3>
                            <p className="text-gray-600 mb-4">{category.description || ''}</p>
                            <div className="flex items-center justify-center gap-2 text-blue-600">
                                <span>Start Quiz</span>
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
