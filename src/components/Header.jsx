import { Home, Trophy, User } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router'
import { useFirebase } from '../context/FirebaseContext';

export const Header = () => {
  const firebase = useFirebase();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">QuizMaster</h1>
        <div className="flex items-center gap-4">
          <NavLink to="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
            <Home size={20} />
            Home
          </NavLink>
          <NavLink to="/leaderboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
            <Trophy size={20} />
            Leaderboard
          </NavLink>
          {!firebase.isLoggedIn ? (
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
    </nav>
  )
}