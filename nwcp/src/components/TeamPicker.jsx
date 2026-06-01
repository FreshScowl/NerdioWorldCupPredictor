import { WORLD_CUP_TEAMS } from '../utils/teams'
import { teamFlag } from '../utils/flags'

export default function TeamPicker({ id, label, value, onChange, optional = true }) {
  return (
    <div className="team-picker">
      <label htmlFor={id}>{label}</label>
      <div className="flag-picker">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {optional && <option value="">n/a</option>}
          {WORLD_CUP_TEAMS.map((team) => (
            <option key={team} value={team}>
              {teamFlag(team)} {team}
            </option>
          ))}
        </select>
        {value && (
          <span className="flag-picker-preview" aria-hidden="true">
            {teamFlag(value)}
          </span>
        )}
      </div>
    </div>
  )
}
