import { useState, useEffect } from "react";
import { BookOpen, CheckCircle } from 'lucide-react';
import { Link } from "react-router";
import { useNavigate } from "react-router";
import { useFirebase } from "../context/FirebaseContext";


export const Register = () => {
  const firebase = useFirebase()
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccess, setShowSuccess] = useState(false); // <-- for popup

  useEffect(() => {
    if (firebase.isLoggedIn) {
      navigate("/")
    }
  }, [firebase, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      console.log("Signup a user...")
      const result = await firebase.signUpUserWithEmailAndPassword(email, password, name)
      console.log("Create Account Successfully", result);
      setSuccess("Account created successfully! You can now log in.");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000); // Hide after 2 seconds
      // Optionally, navigate after a short delay:
      // setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      setError("Invalid user email or password.");
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      {/* Success Toast Popup */}
      {showSuccess && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
            <CheckCircle size={20} />
            <span>{success}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="text-blue-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">QuizMaster</h1>
          <p className="text-gray-600 mt-2">Test your knowledge!</p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                id="name"
                placeholder="Name"
                value={name}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Create Account
            </button>
            <div><p className="text-center text-gray-900 font-bold">OR</p></div>
            <button
              type="button"
              onClick={firebase.signInWithGoogle}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              SignUp With Google
            </button>
            <p className="text-center text-gray-600 mt-4">
              If you have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link> here.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}