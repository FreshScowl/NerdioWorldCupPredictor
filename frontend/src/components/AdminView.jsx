import { useEffect, useState } from 'react'
import { fixturesByGroup, GROUPS } from '../fixtures'
import { getResults, saveResults } from '../api'

function ScoreInput({ value, onChange, label }) {
  return (
    <input
      type="number"
      min="0"
      max="99"
      className="score-input"
      value={value ?? ''}
      onChange={(e) => {
        const raw = e.target.value
        if (raw === '') {
          onChange('')
          return
        }
        const num = Math.min(99, Math.max(0, parseInt(raw, 10) || 0))
        onChange(num)
      }}
      aria-label={label}
    />
  )
}

export default function AdminView() {
  const [unlocked, setUnlocked] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const grouped = fixturesByGroup()

  useEffect(() => {
    if (!unlocked) return

    async function load() {
      setLoading(true)
      try {
        const data = await getResults()
        setResults(data.results || {})
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [unlocked])

  async function handleUnlock(e) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    try {
      const data = await getResults()
      const currentResults = data.results || {}
      await saveResults(adminKey, currentResults)
      setResults(currentResults)
      setUnlocked(true)
    } catch (err) {
      setAuthError(err.message || 'Invalid admin key.')
    } finally {
      setAuthLoading(false)
    }
  }

  function updateResult(fixtureId, side, value) {
    setResults((prev) => ({
      ...prev,
      [fixtureId]: {
        ...prev[fixtureId],
        [side]: value,
      },
    }))
    setMessage('')
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await saveResults(adminKey, results)
      setMessage('Results saved.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!unlocked) {
    return (
      <div className="admin-gate card">
        <p className="eyebrow">Admin access</p>
        <h2>Enter admin key</h2>
        <form onSubmit={handleUnlock}>
          <label htmlFor="admin-key">Admin key</label>
          <input
            id="admin-key"
            type="password"
            className="mono-input"
            value={adminKey}
            onChange={(e) => {
              setAdminKey(e.target.value)
              setAuthError('')
            }}
            autoComplete="off"
            autoFocus
          />
          {authError && <p className="form-error">{authError}</p>}
          <button type="submit" className="btn btn-primary" disabled={authLoading}>
            {authLoading ? 'Checking…' : 'Unlock'}
          </button>
        </form>
      </div>
    )
  }

  if (loading) {
    return <div className="view-loading">Loading results…</div>
  }

  return (
    <div className="admin-view">
      {error && <p className="banner banner-error">{error}</p>}
      {message && <p className="banner banner-success">{message}</p>}

      {GROUPS.map((group) => (
        <section key={group} className="group-section card">
          <h2>Group {group} — Results</h2>
          <ul className="fixture-list">
            {grouped[group].map((fixture) => {
              const result = results[fixture.id] || {}
              return (
                <li key={fixture.id} className="fixture-row">
                  <span className="fixture-teams">
                    {fixture.home} vs {fixture.away}
                  </span>
                  <div className="fixture-inputs">
                    <ScoreInput
                      value={result.home}
                      onChange={(v) => updateResult(fixture.id, 'home', v)}
                      label={`${fixture.home} score`}
                    />
                    <span className="fixture-separator">–</span>
                    <ScoreInput
                      value={result.away}
                      onChange={(v) => updateResult(fixture.id, 'away', v)}
                      label={`${fixture.away} score`}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      <div className="sticky-save">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save results'}
        </button>
      </div>
    </div>
  )
}
