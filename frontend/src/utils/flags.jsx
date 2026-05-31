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
  England: 'GB',
  Venezuela: 'VE',
  Portugal: 'PT',
  Egypt: 'EG',
  Spain: 'ES',
  Bolivia: 'BO',
  Italy: 'IT',
  Senegal: 'SN',
}

function flagFromCode(code) {
  return [...code.toUpperCase()]
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('')
}

export function teamFlag(teamName) {
  const code = TEAM_FLAGS[teamName]
  return code ? flagFromCode(code) : '🏳️'
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
