import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import LandingPage from './components/LandingPage'
import AdminView from './components/AdminView'
import PredictPage from './pages/PredictPage'
import LeaderboardPage from './pages/LeaderboardPage'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/predict" element={<PredictPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
      </Route>
      <Route path="/admin" element={<AdminView />} />
    </Routes>
  )
}
