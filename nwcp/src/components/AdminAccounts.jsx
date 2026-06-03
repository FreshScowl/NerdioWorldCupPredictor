import { useEffect, useState } from 'react'
import { TOTAL_FIXTURES } from '../fixtures'
import { deleteAdminPlayer, getAdminPlayers, retireAdminPlayer } from '../api'

export default function AdminAccounts({ adminKey }) {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [actionPlayerId, setActionPlayerId] = useState(null)

  async function loadPlayers() {
    setLoading(true)
    setError('')
    try {
      const data = await getAdminPlayers(adminKey)
      setPlayers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlayers()
  }, [adminKey])

  async function handleRetire(player) {
    const confirmed = window.confirm(
      `Retire ${player.name}? They will be hidden from the leaderboard and cannot submit predictions. Their data will be kept.`
    )
    if (!confirmed) return

    setActionPlayerId(player.playerId)
    setMessage('')
    setError('')

    try {
      await retireAdminPlayer(adminKey, player.playerId)
      setMessage(`${player.name} has been retired.`)
      await loadPlayers()
    } catch (err) {
      setError(err.message)
    } finally {
      setActionPlayerId(null)
    }
  }

  async function handleDelete(player) {
    const confirmed = window.confirm(
      `Delete ${player.name}? This permanently removes their account and predictions.`
    )
    if (!confirmed) return

    setActionPlayerId(player.playerId)
    setMessage('')
    setError('')

    try {
      await deleteAdminPlayer(adminKey, player.playerId)
      setMessage(`${player.name} has been deleted.`)
      await loadPlayers()
    } catch (err) {
      setError(err.message)
    } finally {
      setActionPlayerId(null)
    }
  }

  if (loading) {
    return <div className="view-loading">Loading accounts…</div>
  }

  return (
    <div className="admin-accounts">
      {error && <p className="banner banner-error">{error}</p>}
      {message && <p className="banner banner-success">{message}</p>}

      <p className="admin-hint">
        Retire hides an account from the leaderboard and blocks predictions. Delete permanently
        removes the account.
      </p>

      {players.length === 0 ? (
        <p className="empty-state">No accounts yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-accounts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Predicted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => {
                const busy = actionPlayerId === player.playerId

                return (
                  <tr key={player.playerId} className={player.retired ? 'retired-account' : ''}>
                    <td>{player.name}</td>
                    <td>
                      {player.retired ? (
                        <span className="status-badge retired">Retired</span>
                      ) : (
                        <span className="status-badge active">Active</span>
                      )}
                    </td>
                    <td>
                      {player.fixturesPredicted} / {TOTAL_FIXTURES}
                    </td>
                    <td>
                      <div className="admin-account-actions">
                        {!player.retired && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-small"
                            onClick={() => handleRetire(player)}
                            disabled={busy}
                          >
                            {busy ? 'Working…' : 'Retire'}
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-danger btn-small"
                          onClick={() => handleDelete(player)}
                          disabled={busy}
                        >
                          {busy ? 'Working…' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
