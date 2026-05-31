import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPredictions } from '../api'
import { clearEmail, loadEmail, saveName, saveSupportedTeam } from '../utils/email'
import EmailGate from '../components/EmailGate'
import PredictView from '../components/PredictView'

export default function PredictPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function init() {
      const stored = loadEmail()
      if (!stored) {
        setChecking(false)
        return
      }

      try {
        const data = await getPredictions(stored)
        if (!data.registered) {
          clearEmail()
          setEmail(null)
        } else if (data.retired) {
          clearEmail()
          setEmail(null)
        } else {
          if (data.name) saveName(data.name)
          if (data.supportedTeam) saveSupportedTeam(data.supportedTeam)
          setEmail(stored)
        }
      } catch {
        setEmail(stored)
      } finally {
        setChecking(false)
      }
    }

    init()
  }, [])

  function handleEmailComplete(nextEmail) {
    setEmail(nextEmail)
  }

  if (checking) {
    return <div className="view-loading">Loading…</div>
  }

  if (!email) {
    return (
      <EmailGate
        onComplete={handleEmailComplete}
        onCancel={() => navigate('/')}
      />
    )
  }

  return <PredictView email={email} />
}
