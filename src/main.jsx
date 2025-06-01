import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Leaderboard } from './pages/Leaderboard.jsx'
import Home from './pages/Home.jsx'
import { Login } from './pages/Login.jsx'
import { Register } from './pages/Register.jsx'
import Quiz from './pages/Quiz.jsx'
import Result from './pages/Result.jsx'
import { QuizProvider } from './context/QuizContext.jsx'
import { FirebaseProvider } from './context/FirebaseContext.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import RequireAdmin from './components/RequireAdmin.jsx'
import AdminAddQuiz from './pages/admin/AdminAddQuiz.jsx'
import AdminAddCategory from './pages/admin/AdminAddCategory.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FirebaseProvider>
        <QuizProvider>
          <Routes>
            <Route path='/' element={<App />}>
              <Route index element={
                <Home />
              } />
              <Route path='leaderboard' element={
                <RequireAuth>
                  <Leaderboard />
                </RequireAuth>
              } />
              <Route path='quiz' element={
                <RequireAuth>
                  <Quiz />
                </RequireAuth>
              } />
              <Route path='result' element={
                <RequireAuth>
                  <Result />
                </RequireAuth>
              } />
              <Route path='login' element={<Login />} />
              <Route path='register' element={<Register />} />
              <Route path="admin/add-category" element={
                <RequireAdmin>
                  <AdminAddCategory />
                </RequireAdmin>
              } />
              <Route path="admin/add-quiz" element={
                <RequireAdmin>
                  <AdminAddQuiz />
                </RequireAdmin>
              } />
            </Route>
          </Routes>
        </QuizProvider>
      </FirebaseProvider>
    </BrowserRouter>
  </StrictMode>,
)
