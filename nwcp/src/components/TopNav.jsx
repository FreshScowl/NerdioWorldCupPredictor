import { NavLink, Link } from 'react-router-dom'

export default function TopNav() {
  return (
    <header className="top-nav">
      <Link to="/" className="top-nav-brand">
        <span className="eyebrow">Nerdio</span>
        <span className="top-nav-title">World Cup Predictor</span>
      </Link>

      <nav className="top-nav-links" aria-label="Main navigation">
        <NavLink
          to="/predict"
          className={({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`}
        >
          Predict
        </NavLink>
        <NavLink
          to="/leaderboard"
          className={({ isActive }) => `top-nav-link ${isActive ? 'active' : ''}`}
        >
          Leaderboard
        </NavLink>
      </nav>
    </header>
  )
}
