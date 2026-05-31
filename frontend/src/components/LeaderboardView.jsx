import { useEffect, useState } from 'react'
import { TOTAL_FIXTURES } from '../fixtures'
import { getLeaderboard } from '../api'
import { getLocalPart } from '../utils/email'

export default function LeaderboardView({ email }) {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  if (loading) {
    return <div className="view-loading">Loading leaderboard…</div>
  }

  if (error) {
    return <p className="banner banner-error">{error}</p>
  }

  return (
    <div className="leaderboard-view card">
      <h2>Leaderboard</h2>
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
              {leaderboard.map((row, index) => (
                <tr
                  key={row.email}
                  className={row.email === email ? 'current-player' : ''}
                >
                  <td>{index + 1}</td>
                  <td>{getLocalPart(row.email)}</td>
                  <td>{row.totalPoints}</td>
                  <td>{row.exactScores}</td>
                  <td>{row.correctResults}</td>
                  <td>{row.wrong}</td>
                  <td>
                    {row.fixturesPredicted} / {TOTAL_FIXTURES}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
