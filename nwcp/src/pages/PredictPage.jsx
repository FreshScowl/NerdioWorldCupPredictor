import { useEffect, useState } from 'react'
import { getPredictions } from '../api'
import { clearPlayer, loadPlayerId, saveName, savePlayerId, saveSupportedTeam } from '../utils/player'
import LandingPage from '../components/LandingPage'
import PredictView from '../components/PredictView'

export default function PredictPage() {
  const [playerId, setPlayerId] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function init() {
      const stored = loadPlayerId()
      if (!stored) {
        setChecking(false)
        return
      }

      try {
        const data = await getPredictions(stored)
        if (!data.registered || data.retired) {
          clearPlayer()
          setPlayerId(null)
        } else {
          if (data.name) saveName(data.name)
          if (data.supportedTeam) saveSupportedTeam(data.supportedTeam)
          savePlayerId(stored)
          setPlayerId(stored)
        }
      } catch {
        setPlayerId(stored)
      } finally {
        setChecking(false)
      }
    }

    init()
  }, [])

  if (checking) {
    return <div className="view-loading">Loading…</div>
  }

  if (!playerId) {
    return <LandingPage />
  }

  return <PredictView playerId={playerId} />
}
