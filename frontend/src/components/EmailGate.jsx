import { useState } from 'react'
import { isValidEmail, normalizeEmail, saveEmail } from '../utils/email'

export default function EmailGate({ onComplete }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const normalized = normalizeEmail(email)

    if (!isValidEmail(normalized)) {
      setError('Enter a valid work email address.')
      return
    }

    saveEmail(normalized)
    onComplete(normalized)
  }

  return (
    <div className="gate">
      <div className="gate-card">
        <p className="eyebrow">Nerdio World Cup Predictor</p>
        <h1>Sign in with your work email</h1>
        <p className="gate-copy">
          Your email is your player identity for predictions and the leaderboard.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Work email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            placeholder="you@company.com"
            autoComplete="email"
            autoFocus
          />
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary">
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
