import { useEffect, useState } from 'react'
import { TOTAL_FIXTURES } from '../fixtures'
import { deleteAdminPlayer, getAdminPlayers, retireAdminPlayer } from '../api'

export default function AdminAccounts({ adminKey }) {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [actionEmail, setActionEmail] = useState(null)

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

    setActionEmail(player.email)
    setMessage('')
    setError('')

    try {
      await retireAdminPlayer(adminKey, player.email)
      setMessage(`${player.name} has been retired.`)
      await loadPlayers()
    } catch (err) {
      setError(err.message)
    } finally {
      setActionEmail(null)
    }
  }

  async function handleDelete(player) {
    const confirmed = window.confirm(
      `Delete ${player.name} (${player.email})? This permanently removes their account and predictions. They can sign up again with the same email.`
    )
    if (!confirmed) return

    setActionEmail(player.email)
    setMessage('')
    setError('')

    try {
      await deleteAdminPlayer(adminKey, player.email)
      setMessage(`${player.name} has been deleted.`)
      await loadPlayers()
    } catch (err) {
      setError(err.message)
    } finally {
      setActionEmail(null)
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
        removes the account so the same email can sign up again.
      </p>

      {players.length === 0 ? (
        <p className="empty-state">No accounts yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="admin-accounts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Predicted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => {
                const busy = actionEmail === player.email

                return (
                  <tr key={player.email} className={player.retired ? 'retired-account' : ''}>
                    <td>{player.name}</td>
                    <td className="mono-cell">{player.email}</td>
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
