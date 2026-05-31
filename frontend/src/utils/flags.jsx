const TEAM_FLAGS = {
  USA: 'US',
  Paraguay: 'PY',
  Australia: 'AU',
  Ghana: 'GH',
  Mexico: 'MX',
  Ecuador: 'EC',
  Japan: 'JP',
  Tunisia: 'TN',
  Canada: 'CA',
  Uruguay: 'UY',
  Morocco: 'MA',
  Panama: 'PA',
  Brazil: 'BR',
  Colombia: 'CO',
  Netherlands: 'NL',
  Cameroon: 'CM',
  Argentina: 'AR',
  Chile: 'CL',
  Belgium: 'BE',
  Nigeria: 'NG',
  France: 'FR',
  Peru: 'PE',
  Germany: 'DE',
  'Saudi Arabia': 'SA',
  England: 'EN',
  Venezuela: 'VE',
  Portugal: 'PT',
  Egypt: 'EG',
  Spain: 'ES',
  Bolivia: 'BO',
  Italy: 'IT',
  Senegal: 'SN',
}

const PLAYER_FLAG_OVERRIDES = {
  EN: 'GB',
  WA: 'GB',
}

export function countryFlag(code) {
  if (!code) return ''
  const normalized = String(code).toUpperCase()
  const flagCode = PLAYER_FLAG_OVERRIDES[normalized] || normalized
  return [...flagCode]
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('')
}

function teamFlagCode(teamName) {
  return TEAM_FLAGS[teamName]
}

export function teamFlag(teamName) {
  const code = teamFlagCode(teamName)
  return code ? countryFlag(code) : '🏳️'
}

export function TeamWithFlag({ team }) {
  return (
    <span className="team-with-flag">
      <span className="team-flag" aria-hidden="true">
        {teamFlag(team)}
      </span>
      {team}
    </span>
  )
}

export function PlayerWithFlag({ name, supportedTeam }) {
  if (!supportedTeam) return name

  return (
    <span className="player-with-flag">
      <span className="player-flag" aria-hidden="true">
        {teamFlag(supportedTeam)}
      </span>
      {name}
    </span>
  )
}
