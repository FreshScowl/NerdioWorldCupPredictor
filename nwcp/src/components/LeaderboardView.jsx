import { Fragment, useEffect, useState } from 'react'
import { FIXTURES, TOTAL_FIXTURES } from '../fixtures'
import { getLeaderboard, getPredictionsByPlayerId } from '../api'
import { PlayerWithFlag } from '../utils/flags.jsx'
import { TeamWithFlag } from '../utils/flags.jsx'
import { isPredictionComplete, scorePrediction } from '../utils/scoring'
import { loadPlayerId } from '../utils/email'

function PointsBadge({ points, showScore }) {
  if (!showScore) {
    return <span className="points-badge pending">—</span>
  }

  const className =
    points === 3 ? 'points-badge exact' : points === 1 ? 'points-badge partial' : 'points-badge wrong'

  return <span className={className}>{points === 0 ? '0' : `+${points}`}</span>
}

function formatScore(home, away) {
  if (home == null || home === '' || away == null || away === '') return '—'
  return `${home} – ${away}`
}

function PlayerPredictionsPanel({ playerName, supportedTeam, predictions, results, loading, error }) {
  const title = <PlayerWithFlag name={playerName} supportedTeam={supportedTeam} />

  if (loading) {
    return (
      <div className="leaderboard-panel">
        <div className="leaderboard-panel-header">
          <span className="eyebrow">Predictions</span>
          <h3>{title}</h3>
        </div>
        <p className="leaderboard-panel-loading">Loading predictions…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="leaderboard-panel">
        <div className="leaderboard-panel-header">
          <span className="eyebrow">Predictions</span>
          <h3>{title}</h3>
        </div>
        <p className="banner banner-error">{error}</p>
      </div>
    )
  }

  return (
    <div className="leaderboard-panel">
      <div className="leaderboard-panel-header">
        <span className="eyebrow">Group stage predictions</span>
        <h3>{title}</h3>
      </div>
      <div className="leaderboard-predictions-wrap">
        <table className="leaderboard-predictions-table">
          <thead>
            <tr>
              <th>Group</th>
              <th>Home</th>
              <th>Predicted</th>
              <th>Away</th>
              <th>Result</th>
              <th>Pts</th>
            </tr>
          </thead>
          <tbody>
            {FIXTURES.map((fixture) => {
              const prediction = predictions?.[fixture.id]
              const actual = results?.[fixture.id]
              const hasResult =
                actual && actual.home != null && actual.home !== '' && actual.away != null && actual.away !== ''
              const hasPrediction = isPredictionComplete(prediction)
              const points =
                hasPrediction && hasResult ? scorePrediction(prediction, actual) : null

              return (
                <tr key={fixture.id}>
                  <td>
                    <span className="group-tag">Grp {fixture.group}</span>
                  </td>
                  <td>
                    <TeamWithFlag team={fixture.home} />
                  </td>
                  <td className="score-cell">
                    {formatScore(prediction?.home, prediction?.away)}
                  </td>
                  <td>
                    <TeamWithFlag team={fixture.away} />
                  </td>
                  <td className="score-cell">
                    {hasResult ? formatScore(actual.home, actual.away) : '—'}
                  </td>
                  <td>
                    <PointsBadge points={points} showScore={hasPrediction && hasResult} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function LeaderboardView({ email }) {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedPlayerId, setExpandedPlayerId] = useState(null)
  const [panelData, setPanelData] = useState(null)
  const [panelLoading, setPanelLoading] = useState(false)
  const [panelError, setPanelError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await getLeaderboard()
        setLeaderboard(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleRowClick(playerId) {
    if (!playerId) {
      setPanelError('Player details are unavailable. Refresh the page and try again.')
      return
    }

    if (expandedPlayerId === playerId) {
      setExpandedPlayerId(null)
      setPanelData(null)
      setPanelError('')
      return
    }

    setExpandedPlayerId(playerId)
    setPanelLoading(true)
    setPanelError('')
    setPanelData(null)

    try {
      const data = await getPredictionsByPlayerId(playerId)
      setPanelData({
        predictions: data.predictions || {},
        results: data.results || {},
      })
    } catch (err) {
      setPanelError(err.message)
    } finally {
      setPanelLoading(false)
    }
  }

  if (loading) {
    return <div className="view-loading">Loading leaderboard…</div>
  }

  if (error) {
    return <p className="banner banner-error">{error}</p>
  }

  return (
    <div className="leaderboard-view card">
      <h2>Leaderboard</h2>
      <p className="leaderboard-hint">Click a player to view their predictions</p>
      {leaderboard.length === 0 ? (
        <p className="empty-state">No predictions yet. Be the first to play!</p>
      ) : (
        <div className="table-wrap">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Points</th>
                <th>Exact</th>
                <th>Result</th>
                <th>Wrong</th>
                <th>Predicted</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row, index) => {
                const isExpanded = expandedPlayerId === row.playerId
                const currentPlayerId = loadPlayerId()
                const isCurrent = currentPlayerId && row.playerId === currentPlayerId

                return (
                  <Fragment key={row.playerId || row.name}>
                    <tr
                      className={[
                        'leaderboard-row',
                        isCurrent ? 'current-player' : '',
                        isExpanded ? 'expanded' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => handleRowClick(row.playerId)}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleRowClick(row.playerId)
                        }
                      }}
                    >
                      <td>{index + 1}</td>
                      <td>
                        <span className="player-name-cell">
                          <PlayerWithFlag name={row.name} supportedTeam={row.supportedTeam} />
                          <span className="expand-icon" aria-hidden="true">
                            {isExpanded ? '▾' : '▸'}
                          </span>
                        </span>
                      </td>
                      <td>{row.totalPoints}</td>
                      <td>{row.exactScores}</td>
                      <td>{row.correctResults}</td>
                      <td>{row.wrong}</td>
                      <td>
                        {row.fixturesPredicted} / {TOTAL_FIXTURES}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="leaderboard-panel-row">
                        <td colSpan={7}>
                          <PlayerPredictionsPanel
                            playerName={row.name}
                            supportedTeam={row.supportedTeam}
                            predictions={panelData?.predictions}
                            results={panelData?.results}
                            loading={panelLoading}
                            error={panelError}
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
