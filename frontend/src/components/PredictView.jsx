import { useEffect, useMemo, useState } from 'react'
import { FIXTURES, fixturesByGroup, GROUPS, TOTAL_FIXTURES } from '../fixtures'
import { getPredictions, getResults, savePredictions } from '../api'
import { isPredictionComplete, scorePrediction } from '../utils/scoring'

function PointsBadge({ points }) {
  if (points === null) return null

  const className =
    points === 3 ? 'points-badge exact' : points === 1 ? 'points-badge partial' : 'points-badge wrong'

  return <span className={className}>+{points}</span>
}

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

export default function PredictView({ email }) {
  const [predictions, setPredictions] = useState({})
  const [results, setResults] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const grouped = useMemo(() => fixturesByGroup(), [])

  useEffect(() => {
    async function load() {
      try {
        const [predData, resultData] = await Promise.all([
          getPredictions(email),
          getResults(),
        ])
        setPredictions(predData.predictions || {})
        setResults(resultData.results || {})
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [email])

  const stats = useMemo(() => {
    let totalPoints = 0
    let predictedCount = 0

    for (const fixture of FIXTURES) {
      const prediction = predictions[fixture.id]
      if (!isPredictionComplete(prediction)) continue

      predictedCount++
      const actual = results[fixture.id]
      const points = scorePrediction(prediction, actual)
      if (points !== null) totalPoints += points
    }

    return { totalPoints, predictedCount }
  }, [predictions, results])

  function updatePrediction(fixtureId, side, value) {
    setPredictions((prev) => ({
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
      await savePredictions(email, predictions)
      setMessage('Predictions saved.')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="view-loading">Loading fixtures…</div>
  }

  return (
    <div className="predict-view">
      <div className="stats-bar card">
        <div className="stat">
          <span className="stat-label">Total points</span>
          <span className="stat-value">{stats.totalPoints}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Predicted</span>
          <span className="stat-value">
            {stats.predictedCount} / {TOTAL_FIXTURES}
          </span>
        </div>
      </div>

      {error && <p className="banner banner-error">{error}</p>}
      {message && <p className="banner banner-success">{message}</p>}

      {GROUPS.map((group) => (
        <section key={group} className="group-section card">
          <h2>Group {group}</h2>
          <ul className="fixture-list">
            {grouped[group].map((fixture) => {
              const prediction = predictions[fixture.id] || {}
              const actual = results[fixture.id]
              const points =
                isPredictionComplete(prediction) && actual
                  ? scorePrediction(prediction, actual)
                  : null

              return (
                <li key={fixture.id} className="fixture-row">
                  <span className="fixture-teams">
                    {fixture.home} vs {fixture.away}
                  </span>
                  <div className="fixture-inputs">
                    <ScoreInput
                      value={prediction.home}
                      onChange={(v) => updatePrediction(fixture.id, 'home', v)}
                      label={`${fixture.home} score`}
                    />
                    <span className="fixture-separator">–</span>
                    <ScoreInput
                      value={prediction.away}
                      onChange={(v) => updatePrediction(fixture.id, 'away', v)}
                      label={`${fixture.away} score`}
                    />
                    <PointsBadge points={points} />
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
          {saving ? 'Saving…' : 'Save predictions'}
        </button>
      </div>
    </div>
  )
}
