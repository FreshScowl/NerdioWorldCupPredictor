const TEAM_FLAGS = {
  Algeria: 'DZ',
  Argentina: 'AR',
  Australia: 'AU',
  Austria: 'AT',
  Belgium: 'BE',
  'Bosnia and Herzegovina': 'BA',
  Brazil: 'BR',
  'Cabo Verde': 'CV',
  Canada: 'CA',
  Colombia: 'CO',
  Croatia: 'HR',
  'Curaçao': 'CW',
  'Czech Republic': 'CZ',
  'DR Congo': 'CD',
  Ecuador: 'EC',
  Egypt: 'EG',
  England: 'EN',
  France: 'FR',
  Germany: 'DE',
  Ghana: 'GH',
  Haiti: 'HT',
  Iran: 'IR',
  Iraq: 'IQ',
  'Ivory Coast': 'CI',
  Japan: 'JP',
  Jordan: 'JO',
  'Korea Republic': 'KR',
  Mexico: 'MX',
  Morocco: 'MA',
  Netherlands: 'NL',
  'New Zealand': 'NZ',
  Norway: 'NO',
  Panama: 'PA',
  Paraguay: 'PY',
  Portugal: 'PT',
  Qatar: 'QA',
  'Saudi Arabia': 'SA',
  Scotland: 'SC',
  Senegal: 'SN',
  'South Africa': 'ZA',
  Spain: 'ES',
  Sweden: 'SE',
  Switzerland: 'CH',
  Tunisia: 'TN',
  Turkey: 'TR',
  USA: 'US',
  Uruguay: 'UY',
  Uzbekistan: 'UZ',
}

const SPECIAL_TEAM_FLAGS = {
  England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  Scotland: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
}

const FLAG_CODE_OVERRIDES = {
  EN: 'GB',
}

export function countryFlag(code) {
  if (!code) return ''
  const normalized = String(code).toUpperCase()
  const flagCode = FLAG_CODE_OVERRIDES[normalized] || normalized
  return [...flagCode]
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('')
}

export function teamFlag(teamName) {
  if (SPECIAL_TEAM_FLAGS[teamName]) return SPECIAL_TEAM_FLAGS[teamName]
  const code = TEAM_FLAGS[teamName]
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
