import { useState, useEffect } from "react";
import {useFirebase} from '../../context/FirebaseContext'

export default function AdminAddQuiz() {
  const firebase = useFirebase();
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], correct: 0 }
  ]);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    firebase.fetchCategories().then(setCategories);
  }, [firebase]);

  const handleQuestionChange = (idx, field, value) => {
    setQuestions(qs => {
      const copy = [...qs];
      if (field === "options") copy[idx].options = value;
      else copy[idx][field] = value;
      return copy;
    });
  };

  const addQuestion = () => setQuestions(qs => [...qs, { question: "", options: ["", "", "", ""], correct: 0 }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await firebase.addQuiz({ title, categoryId, questions });
    setSuccess("Quiz added!");
    setTitle(""); setCategoryId(""); setQuestions([{ question: "", options: ["", "", "", ""], correct: 0 }]);
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add Quiz</h2>
      {success && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-2">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full border px-3 py-2 rounded" placeholder="Quiz Title" value={title} onChange={e => setTitle(e.target.value)} />
        <select className="w-full border px-3 py-2 rounded" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          <option value="">Select Category</option>
          {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        {questions.map((q, idx) => (
          <div key={idx} className="border p-3 rounded mb-2">
            <input className="w-full mb-2 border px-2 py-1 rounded" placeholder="Question" value={q.question} onChange={e => handleQuestionChange(idx, "question", e.target.value)} />
            {q.options.map((opt, oidx) => (
              <input key={oidx} className="w-full mb-1 border px-2 py-1 rounded" placeholder={`Option ${oidx + 1}`} value={opt}
                onChange={e => {
                  const newOpts = [...q.options];
                  newOpts[oidx] = e.target.value;
                  handleQuestionChange(idx, "options", newOpts);
                }} />
            ))}
            <select className="w-full border px-2 py-1 rounded" value={q.correct} onChange={e => handleQuestionChange(idx, "correct", Number(e.target.value))}>
              {[0, 1, 2, 3].map(i => <option key={i} value={i}>Correct Option: {i + 1}</option>)}
            </select>
          </div>
        ))}
        <button type="button" className="bg-gray-300 px-3 py-1 rounded" onClick={addQuestion}>Add Question</button>
        <button className="w-full bg-blue-600 text-white py-2 rounded" type="submit">Add Quiz</button>
      </form>
    </div>
  );
}