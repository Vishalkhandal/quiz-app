import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BookOpen } from 'lucide-react';
import { Link } from "react-router";
import { useNavigate } from "react-router";

export const Register = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email } = formData;
    if (!username || !email) {
      setError("Username and Email are required.");
      return;
    }
    setUser({ name: username, email: email });
    setError("");
    navigate("/")
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
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
                id="username"
                placeholder="Username"
                value={formData.username}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={formData.email}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Register
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