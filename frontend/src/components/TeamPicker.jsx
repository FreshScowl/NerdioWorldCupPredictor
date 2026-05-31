import { GROUPS } from '../fixtures'
import { getTeamsByGroup } from '../utils/teams'
import { teamFlag } from '../utils/flags'

export default function TeamPicker({ id, label, value, onChange, optional = true }) {
  const teamsByGroup = getTeamsByGroup()

  return (
    <div className="team-picker">
      <label htmlFor={id}>{label}</label>
      <div className="flag-picker">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          {optional && <option value="">No team selected</option>}
          {GROUPS.map((group) => (
            <optgroup key={group} label={`Group ${group}`}>
              {teamsByGroup[group].map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </optgroup>
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
