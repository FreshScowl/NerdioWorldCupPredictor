import { useState } from 'react'
import { getPredictions } from '../api'
import { isValidEmail, normalizeEmail, saveEmail, saveName, saveSupportedTeam } from '../utils/email'

export default function EmailGate({ onComplete, onCancel }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const normalized = normalizeEmail(email)

    if (!isValidEmail(normalized)) {
      setError('Enter a valid @getnerdio.com email address.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const data = await getPredictions(normalized)

      if (!data.registered) {
        setError('No account found for this email. Sign up on the home page.')
        return
      }

      if (data.retired) {
        setError('This account has been retired.')
        return
      }

      saveEmail(normalized)
      if (data.name) saveName(data.name)
      if (data.supportedTeam) saveSupportedTeam(data.supportedTeam)
      onComplete(normalized)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="email-gate-page">
      <div className="gate-card card">
        <p className="eyebrow">Sign in</p>
        <h1>Enter your work email</h1>
        <p className="gate-copy">
          Use the @getnerdio.com email you signed up with to enter your predictions.
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
            placeholder="you@getnerdio.com"
            autoComplete="email"
            autoFocus
          />
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions">
            {onCancel && (
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Back
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Checking…' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
