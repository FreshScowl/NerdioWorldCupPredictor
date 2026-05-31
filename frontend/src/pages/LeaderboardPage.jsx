import { loadEmail } from '../utils/email'
import LeaderboardView from '../components/LeaderboardView'

export default function LeaderboardPage() {
  return <LeaderboardView email={loadEmail()} />
}
