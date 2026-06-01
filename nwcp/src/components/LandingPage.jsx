import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerPlayer } from '../api'
import TeamPicker from './TeamPicker'
import {
  isValidEmail,
  isValidName,
  normalizeEmail,
  normalizeName,
  saveEmail,
  saveName,
  savePlayerId,
  saveSupportedTeam,
} from '../utils/email'

export default function LandingPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [supportedTeam, setSupportedTeam] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSignUp(e) {
    e.preventDefault()
    const normalizedEmail = normalizeEmail(email)
    const normalizedName = normalizeName(name)
    const selectedTeam = supportedTeam || null

    if (!isValidName(normalizedName)) {
      setError('Enter your name (2–80 characters).')
      return
    }

    if (!isValidEmail(normalizedEmail)) {
      setError('Enter a valid @getnerdio.com email address.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const doc = await registerPlayer(normalizedEmail, normalizedName, selectedTeam)
      saveEmail(normalizedEmail)
      saveName(normalizedName)
      saveSupportedTeam(selectedTeam)
      if (doc.playerId) savePlayerId(doc.playerId)
      navigate('/predict')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="landing">
      <div className="landing-hero card">
        <span className="eyebrow">Nerdio</span>
        <h1>World Cup Predictor</h1>
        <p className="landing-intro">
          Predict every group stage score and compete with colleagues on the leaderboard.
        </p>

        <section className="how-to-play">
          <h2>How to play</h2>
          <ul>
            <li>Predict the score of every group stage match</li>
            <li>
              <strong>Exact score</strong> = 3 points
            </li>
            <li>
              <strong>Correct result</strong> (win/draw/loss) = 1 point
            </li>
            <li>
              <strong>Wrong</strong> = 0 points
            </li>
          </ul>
        </section>

        <form className="landing-signup" onSubmit={handleSignUp}>
          <label htmlFor="landing-name">Your name</label>
          <input
            id="landing-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            placeholder="Jane Smith"
            autoComplete="name"
          />

          <TeamPicker
            id="landing-team"
            label="What team do you support? (optional)"
            value={supportedTeam}
            onChange={(team) => {
              setSupportedTeam(team)
              setError('')
            }}
          />

          <label htmlFor="landing-email">Work email</label>
          <input
            id="landing-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            placeholder="you@getnerdio.com"
            autoComplete="email"
          />
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Signing up…' : 'Sign up'}
          </button>
        </form>

        <div className="landing-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/leaderboard')}
          >
            View leaderboard
          </button>
        </div>
      </div>
    </div>
  )
}
