import { useEffect, useState } from 'react'
import { fixturesByGroup, GROUPS } from '../fixtures'
import { getResults, saveResults, verifyAdmin } from '../api'
import AdminAccounts from './AdminAccounts'

const ADMIN_KEY_STORAGE = 'nerdio-wcp-admin-key'

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

function AdminResults({ adminKey, results, setResults, error, setError, message, setMessage }) {
  const [saving, setSaving] = useState(false)
  const grouped = fixturesByGroup()

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
      const data = await saveResults(adminKey, results)
      if (data.results) {
        setResults(data.results)
      }
      setMessage('Results saved.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-view">
      {error && <p className="banner banner-error">{error}</p>}
      {message && <p className="banner banner-success">{message}</p>}

      <p className="admin-hint">
        Enter the final score for each match, then click Save results. Leave a field blank to clear
        a result.
      </p>

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
        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save results'}
        </button>
      </div>
    </div>
  )
}

export default function AdminView() {
  const [unlocked, setUnlocked] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('results')

  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function tryRestoreSession() {
      const storedKey = sessionStorage.getItem(ADMIN_KEY_STORAGE)
      if (!storedKey) return

      try {
        await verifyAdmin(storedKey)
        setAdminKey(storedKey)
        setUnlocked(true)
      } catch {
        sessionStorage.removeItem(ADMIN_KEY_STORAGE)
      }
    }

    tryRestoreSession()
  }, [])

  useEffect(() => {
    if (!unlocked) return

    async function load() {
      setLoading(true)
      setError('')
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
      await verifyAdmin(adminKey)
      sessionStorage.setItem(ADMIN_KEY_STORAGE, adminKey)
      setUnlocked(true)
    } catch (err) {
      setAuthError(err.message || 'Invalid admin key.')
    } finally {
      setAuthLoading(false)
    }
  }

  let content

  if (!unlocked) {
    content = (
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
  } else if (loading) {
    content = <div className="view-loading">Loading admin…</div>
  } else {
    content = (
      <>
        <nav className="admin-tabs" aria-label="Admin sections">
          <button
            type="button"
            className={`admin-tab ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            Match results
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === 'accounts' ? 'active' : ''}`}
            onClick={() => setActiveTab('accounts')}
          >
            Accounts
          </button>
        </nav>

        {activeTab === 'results' ? (
          <AdminResults
            adminKey={adminKey}
            results={results}
            setResults={setResults}
            error={error}
            setError={setError}
            message={message}
            setMessage={setMessage}
          />
        ) : (
          <AdminAccounts adminKey={adminKey} />
        )}
      </>
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <span className="eyebrow">Nerdio</span>
        <h1>World Cup Predictor — Admin</h1>
      </header>
      <div className="admin-page-content">{content}</div>
    </div>
  )
}
