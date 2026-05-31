import { getLocalPart } from '../utils/email'

export default function Header({ email, onSwitchAccount }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="eyebrow">World Cup 2026</span>
        <h1>Group stage predictions</h1>
      </div>

      <button
        type="button"
        className="user-pill"
        onClick={onSwitchAccount}
        title="Switch account"
      >
        {getLocalPart(email)}
      </button>
    </header>
  )
}
