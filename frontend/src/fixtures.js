/**
 * 2026 FIFA World Cup group stage fixtures (official draw, December 2025).
 * 12 groups (A–L), 4 teams each, 6 matches per group = 72 fixtures.
 * Play-off placeholders (Czech Republic, Bosnia and Herzegovina, Turkey, Sweden, Iraq, DR Congo)
 * reflect the published schedule; final teams confirmed in March 2026.
 */
export const FIXTURES = [

  // Group A — Mexico, South Africa, Korea Republic, Czech Republic
  { id: 'A-1', group: 'A', home: 'South Africa', away: 'Mexico' },
  { id: 'A-2', group: 'A', home: 'Czech Republic', away: 'Korea Republic' },
  { id: 'A-3', group: 'A', home: 'South Africa', away: 'Czech Republic' },
  { id: 'A-4', group: 'A', home: 'Korea Republic', away: 'Mexico' },
  { id: 'A-5', group: 'A', home: 'Korea Republic', away: 'South Africa' },
  { id: 'A-6', group: 'A', home: 'Mexico', away: 'Czech Republic' },

  // Group B — Canada, Bosnia and Herzegovina, Qatar, Switzerland
  { id: 'B-1', group: 'B', home: 'Bosnia and Herzegovina', away: 'Canada' },
  { id: 'B-2', group: 'B', home: 'Switzerland', away: 'Qatar' },
  { id: 'B-3', group: 'B', home: 'Bosnia and Herzegovina', away: 'Switzerland' },
  { id: 'B-4', group: 'B', home: 'Qatar', away: 'Canada' },
  { id: 'B-5', group: 'B', home: 'Canada', away: 'Switzerland' },
  { id: 'B-6', group: 'B', home: 'Qatar', away: 'Bosnia and Herzegovina' },

  // Group C — Brazil, Morocco, Haiti, Scotland
  { id: 'C-1', group: 'C', home: 'Morocco', away: 'Brazil' },
  { id: 'C-2', group: 'C', home: 'Scotland', away: 'Haiti' },
  { id: 'C-3', group: 'C', home: 'Morocco', away: 'Scotland' },
  { id: 'C-4', group: 'C', home: 'Haiti', away: 'Brazil' },
  { id: 'C-5', group: 'C', home: 'Brazil', away: 'Scotland' },
  { id: 'C-6', group: 'C', home: 'Haiti', away: 'Morocco' },

  // Group D — USA, Paraguay, Australia, Turkey
  { id: 'D-1', group: 'D', home: 'Paraguay', away: 'USA' },
  { id: 'D-2', group: 'D', home: 'Turkey', away: 'Australia' },
  { id: 'D-3', group: 'D', home: 'Australia', away: 'USA' },
  { id: 'D-4', group: 'D', home: 'Paraguay', away: 'Turkey' },
  { id: 'D-5', group: 'D', home: 'USA', away: 'Turkey' },
  { id: 'D-6', group: 'D', home: 'Australia', away: 'Paraguay' },

  // Group E — Germany, Curaçao, Ivory Coast, Ecuador
  { id: 'E-1', group: 'E', home: 'Curaçao', away: 'Germany' },
  { id: 'E-2', group: 'E', home: 'Ecuador', away: 'Ivory Coast' },
  { id: 'E-3', group: 'E', home: 'Ivory Coast', away: 'Germany' },
  { id: 'E-4', group: 'E', home: 'Curaçao', away: 'Ecuador' },
  { id: 'E-5', group: 'E', home: 'Germany', away: 'Ecuador' },
  { id: 'E-6', group: 'E', home: 'Ivory Coast', away: 'Curaçao' },

  // Group F — Netherlands, Japan, Sweden, Tunisia
  { id: 'F-1', group: 'F', home: 'Japan', away: 'Netherlands' },
  { id: 'F-2', group: 'F', home: 'Tunisia', away: 'Sweden' },
  { id: 'F-3', group: 'F', home: 'Sweden', away: 'Netherlands' },
  { id: 'F-4', group: 'F', home: 'Japan', away: 'Tunisia' },
  { id: 'F-5', group: 'F', home: 'Netherlands', away: 'Tunisia' },
  { id: 'F-6', group: 'F', home: 'Sweden', away: 'Japan' },

  // Group G — Belgium, Egypt, Iran, New Zealand
  { id: 'G-1', group: 'G', home: 'Egypt', away: 'Belgium' },
  { id: 'G-2', group: 'G', home: 'New Zealand', away: 'Iran' },
  { id: 'G-3', group: 'G', home: 'Iran', away: 'Belgium' },
  { id: 'G-4', group: 'G', home: 'Egypt', away: 'New Zealand' },
  { id: 'G-5', group: 'G', home: 'Belgium', away: 'New Zealand' },
  { id: 'G-6', group: 'G', home: 'Iran', away: 'Egypt' },

  // Group H — Spain, Cabo Verde, Saudi Arabia, Uruguay
  { id: 'H-1', group: 'H', home: 'Cabo Verde', away: 'Spain' },
  { id: 'H-2', group: 'H', home: 'Uruguay', away: 'Saudi Arabia' },
  { id: 'H-3', group: 'H', home: 'Saudi Arabia', away: 'Spain' },
  { id: 'H-4', group: 'H', home: 'Cabo Verde', away: 'Uruguay' },
  { id: 'H-5', group: 'H', home: 'Spain', away: 'Uruguay' },
  { id: 'H-6', group: 'H', home: 'Saudi Arabia', away: 'Cabo Verde' },

  // Group I — France, Senegal, Iraq, Norway
  { id: 'I-1', group: 'I', home: 'Senegal', away: 'France' },
  { id: 'I-2', group: 'I', home: 'Norway', away: 'Iraq' },
  { id: 'I-3', group: 'I', home: 'Iraq', away: 'France' },
  { id: 'I-4', group: 'I', home: 'Senegal', away: 'Norway' },
  { id: 'I-5', group: 'I', home: 'France', away: 'Norway' },
  { id: 'I-6', group: 'I', home: 'Iraq', away: 'Senegal' },

  // Group J — Argentina, Algeria, Austria, Jordan
  { id: 'J-1', group: 'J', home: 'Algeria', away: 'Argentina' },
  { id: 'J-2', group: 'J', home: 'Jordan', away: 'Austria' },
  { id: 'J-3', group: 'J', home: 'Austria', away: 'Argentina' },
  { id: 'J-4', group: 'J', home: 'Algeria', away: 'Jordan' },
  { id: 'J-5', group: 'J', home: 'Austria', away: 'Algeria' },
  { id: 'J-6', group: 'J', home: 'Argentina', away: 'Jordan' },

  // Group K — Portugal, DR Congo, Uzbekistan, Colombia
  { id: 'K-1', group: 'K', home: 'DR Congo', away: 'Portugal' },
  { id: 'K-2', group: 'K', home: 'Colombia', away: 'Uzbekistan' },
  { id: 'K-3', group: 'K', home: 'Uzbekistan', away: 'Portugal' },
  { id: 'K-4', group: 'K', home: 'DR Congo', away: 'Colombia' },
  { id: 'K-5', group: 'K', home: 'Portugal', away: 'Colombia' },
  { id: 'K-6', group: 'K', home: 'Uzbekistan', away: 'DR Congo' },

  // Group L — England, Croatia, Ghana, Panama
  { id: 'L-1', group: 'L', home: 'Croatia', away: 'England' },
  { id: 'L-2', group: 'L', home: 'Panama', away: 'Ghana' },
  { id: 'L-3', group: 'L', home: 'Ghana', away: 'England' },
  { id: 'L-4', group: 'L', home: 'Croatia', away: 'Panama' },
  { id: 'L-5', group: 'L', home: 'Ghana', away: 'Croatia' },
  { id: 'L-6', group: 'L', home: 'England', away: 'Panama' },
]

export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L']

export const TOTAL_FIXTURES = FIXTURES.length

export function fixturesByGroup() {
  return GROUPS.reduce((acc, group) => {
    acc[group] = FIXTURES.filter((f) => f.group === group)
    return acc
  }, {})
}
