import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isValidEmail, loadEmail, normalizeEmail, saveEmail } from '../utils/email'
import EmailGate from '../components/EmailGate'
import PredictView from '../components/PredictView'

export default function PredictPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState(() => loadEmail())

  function handleEmailComplete(nextEmail) {
    setEmail(nextEmail)
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
