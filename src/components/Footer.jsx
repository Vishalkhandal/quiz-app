import React from 'react'

function Footer() {
  return (
    <footer className="w-full bg-gray-100 py-4 shadow-inner">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 text-gray-600 text-sm">
        <span>
          &copy; {new Date().getFullYear()} QuizMaster. All rights reserved.
        </span>
        <span>
          Made with <span className="text-red-500">♥</span> by Vishal Kumar Khandal
        </span>
      </div>
    </footer>
  )
}

export default Footer