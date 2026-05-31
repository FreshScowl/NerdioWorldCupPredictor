import { useState } from 'react'
import { clearEmail, loadEmail } from './utils/email'
import EmailGate from './components/EmailGate'
import Header from './components/Header'
import PredictView from './components/PredictView'
import LeaderboardView from './components/LeaderboardView'
import AdminView from './components/AdminView'
import './App.css'

export default function App() {
  const [email, setEmail] = useState(() => loadEmail())
  const [activeTab, setActiveTab] = useState('predict')
  const [showSwitchConfirm, setShowSwitchConfirm] = useState(false)

  function handleSwitchAccount() {
    setShowSwitchConfirm(true)
  }

  function confirmSwitch() {
    clearEmail()
    setEmail(null)
    setShowSwitchConfirm(false)
    setActiveTab('predict')
  }

  if (!email) {
    return <EmailGate onComplete={setEmail} />
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="eyebrow">Nerdio</span>
          <p className="sidebar-title">WCP 2026</p>
        </div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <button
            type="button"
            className={`sidebar-tab ${activeTab === 'predict' ? 'active' : ''}`}
            onClick={() => setActiveTab('predict')}
          >
            Predict
          </button>
          <button
            type="button"
            className={`sidebar-tab ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            Leaderboard
          </button>
          <button
            type="button"
            className={`sidebar-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            Admin
          </button>
        </nav>
      </aside>

      <div className="app-main">
        <Header email={email} onSwitchAccount={handleSwitchAccount} />

        <main className="app-content">
          {activeTab === 'predict' && <PredictView email={email} />}
          {activeTab === 'leaderboard' && <LeaderboardView email={email} />}
          {activeTab === 'admin' && <AdminView />}
        </main>
      </div>

      {showSwitchConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal card">
            <h2>Switch account?</h2>
            <p>You will need to sign in again with a different work email.</p>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowSwitchConfirm(false)}
              >
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={confirmSwitch}>
                Switch account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
