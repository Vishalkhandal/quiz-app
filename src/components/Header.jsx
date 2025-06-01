import { Home, Trophy, User, NotebookTabs, FileQuestion, Menu, X } from 'lucide-react'
import { NavLink } from 'react-router'
import { useFirebase } from '../context/FirebaseContext';
import { useState } from 'react';

export const Header = () => {
  const firebase = useFirebase();
  const [menuOpen, setMenuOpen] = useState(false);

  if (firebase.loading) {
    return null;
  }

  const isAdmin = firebase.user && firebase.user.email === "admin@gmail.com";

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">QuizMaster</h1>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          <NavLink to="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
            <Home size={20} />
            Home
          </NavLink>
          <NavLink to="/leaderboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
            <Trophy size={20} />
            Leaderboard
          </NavLink>
          {isAdmin && (
            <>
              <NavLink to="/admin/add-category" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <NotebookTabs size={20} />
                Add Category
              </NavLink>
              <NavLink to="/admin/add-quiz" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
                <FileQuestion size={20} />
                Add Quiz
              </NavLink>
            </>
          )}
          {!firebase.user ? (
            <>
              <NavLink to="/login" className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                Login
              </NavLink>
              <NavLink to="/register" className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
                Sign Up
              </NavLink>
              <div className="flex items-center gap-2 text-gray-700">
                <User size={20} />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-gray-700">
                <User size={20} />
                {firebase.user ? (firebase.user.displayName || firebase.user.email) : null}
              </div>
              <button
                onClick={firebase.logout}
                className="px-4 py-2 cursor-pointer text-red-600 border border-red-600 rounded hover:bg-red-50"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4">
          <div className="flex flex-col gap-3 mt-2">
            <NavLink to="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
              <Home size={20} />
              Home
            </NavLink>
            <NavLink to="/leaderboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
              <Trophy size={20} />
              Leaderboard
            </NavLink>
            {isAdmin && (
              <>
                <NavLink to="/admin/add-category" className="flex items-center gap-2 text-gray-600 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                  <NotebookTabs size={20} />
                  Add Category
                </NavLink>
                <NavLink to="/admin/add-quiz" className="flex items-center gap-2 text-gray-600 hover:text-blue-600" onClick={() => setMenuOpen(false)}>
                  <FileQuestion size={20} />
                  Add Quiz
                </NavLink>
              </>
            )}
            {!firebase.user ? (
              <>
                <NavLink to="/login" className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50" onClick={() => setMenuOpen(false)}>
                  Login
                </NavLink>
                <NavLink to="/register" className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50" onClick={() => setMenuOpen(false)}>
                  Sign Up
                </NavLink>
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={20} />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={20} />
                  {firebase.user ? (firebase.user.displayName || firebase.user.email) : null}
                </div>
                <button
                  onClick={() => { firebase.logout(); setMenuOpen(false); }}
                  className="px-4 py-2 cursor-pointer text-red-600 border border-red-600 rounded hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}