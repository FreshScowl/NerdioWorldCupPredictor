import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <div className="landing-hero card">
        <span className="eyebrow">Nerdio</span>
        <h1>World Cup Predictor</h1>
        <p className="landing-intro">
          Predict every group stage score and compete with colleagues on the leaderboard.
        </p>

        <section className="how-to-play">
          <h2>How to play</h2>
          <ul>
            <li>Predict the score of every group stage match</li>
            <li>
              <strong>Exact score</strong> = 3 points
            </li>
            <li>
              <strong>Correct result</strong> (win/draw/loss) = 1 point
            </li>
            <li>
              <strong>Wrong</strong> = 0 points
            </li>
          </ul>
        </section>

        <div className="landing-actions">
          <button type="button" className="btn btn-primary" onClick={() => navigate('/predict')}>
            Get started
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/leaderboard')}
          >
            View leaderboard
          </button>
        </div>
      </div>
    </div>
  )
}
