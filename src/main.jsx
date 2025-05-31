import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Leaderboard } from './pages/Leaderboard.jsx'
import Home from './pages/Home.jsx'
import { Login } from './pages/Login.jsx'
import { Register } from './pages/Register.jsx'
import Quiz from './pages/Quiz.jsx'
import Result from './pages/Result.jsx'
import { QuizProvider } from './context/QuizContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QuizProvider>
          <Routes>
            <Route path='/' element={<App />}>
              <Route index element={<Home />} />
              <Route path='leaderboard' element={<Leaderboard />} />
              <Route path='quiz' element={<Quiz />} />
              <Route path='result' element={<Result />} />
              <Route path='login' element={<Login />} />
              <Route path='register' element={<Register />} />
            </Route>
          </Routes>
        </QuizProvider>
      </AuthProvider>
    </BrowserRouter>

  </StrictMode>,
)
