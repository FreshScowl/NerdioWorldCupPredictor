/**
 * 2026 World Cup group stage fixtures (plausible assignments — update after official draw).
 * 8 groups (A–H), 4 teams each, 6 matches per group = 48 fixtures.
 */
export const FIXTURES = [
  // Group A — USA, Paraguay, Australia, Ghana
  { id: 'A-1', group: 'A', home: 'USA', away: 'Paraguay' },
  { id: 'A-2', group: 'A', home: 'USA', away: 'Australia' },
  { id: 'A-3', group: 'A', home: 'USA', away: 'Ghana' },
  { id: 'A-4', group: 'A', home: 'Paraguay', away: 'Australia' },
  { id: 'A-5', group: 'A', home: 'Paraguay', away: 'Ghana' },
  { id: 'A-6', group: 'A', home: 'Australia', away: 'Ghana' },

  // Group B — Mexico, Ecuador, Japan, Tunisia
  { id: 'B-1', group: 'B', home: 'Mexico', away: 'Ecuador' },
  { id: 'B-2', group: 'B', home: 'Mexico', away: 'Japan' },
  { id: 'B-3', group: 'B', home: 'Mexico', away: 'Tunisia' },
  { id: 'B-4', group: 'B', home: 'Ecuador', away: 'Japan' },
  { id: 'B-5', group: 'B', home: 'Ecuador', away: 'Tunisia' },
  { id: 'B-6', group: 'B', home: 'Japan', away: 'Tunisia' },

  // Group C — Canada, Uruguay, Morocco, Panama
  { id: 'C-1', group: 'C', home: 'Canada', away: 'Uruguay' },
  { id: 'C-2', group: 'C', home: 'Canada', away: 'Morocco' },
  { id: 'C-3', group: 'C', home: 'Canada', away: 'Panama' },
  { id: 'C-4', group: 'C', home: 'Uruguay', away: 'Morocco' },
  { id: 'C-5', group: 'C', home: 'Uruguay', away: 'Panama' },
  { id: 'C-6', group: 'C', home: 'Morocco', away: 'Panama' },

  // Group D — Brazil, Colombia, Netherlands, Cameroon
  { id: 'D-1', group: 'D', home: 'Brazil', away: 'Colombia' },
  { id: 'D-2', group: 'D', home: 'Brazil', away: 'Netherlands' },
  { id: 'D-3', group: 'D', home: 'Brazil', away: 'Cameroon' },
  { id: 'D-4', group: 'D', home: 'Colombia', away: 'Netherlands' },
  { id: 'D-5', group: 'D', home: 'Colombia', away: 'Cameroon' },
  { id: 'D-6', group: 'D', home: 'Netherlands', away: 'Cameroon' },

  // Group E — Argentina, Chile, Belgium, Nigeria
  { id: 'E-1', group: 'E', home: 'Argentina', away: 'Chile' },
  { id: 'E-2', group: 'E', home: 'Argentina', away: 'Belgium' },
  { id: 'E-3', group: 'E', home: 'Argentina', away: 'Nigeria' },
  { id: 'E-4', group: 'E', home: 'Chile', away: 'Belgium' },
  { id: 'E-5', group: 'E', home: 'Chile', away: 'Nigeria' },
  { id: 'E-6', group: 'E', home: 'Belgium', away: 'Nigeria' },

  // Group F — France, Peru, Germany, Saudi Arabia
  { id: 'F-1', group: 'F', home: 'France', away: 'Peru' },
  { id: 'F-2', group: 'F', home: 'France', away: 'Germany' },
  { id: 'F-3', group: 'F', home: 'France', away: 'Saudi Arabia' },
  { id: 'F-4', group: 'F', home: 'Peru', away: 'Germany' },
  { id: 'F-5', group: 'F', home: 'Peru', away: 'Saudi Arabia' },
  { id: 'F-6', group: 'F', home: 'Germany', away: 'Saudi Arabia' },

  // Group G — England, Venezuela, Portugal, Egypt
  { id: 'G-1', group: 'G', home: 'England', away: 'Venezuela' },
  { id: 'G-2', group: 'G', home: 'England', away: 'Portugal' },
  { id: 'G-3', group: 'G', home: 'England', away: 'Egypt' },
  { id: 'G-4', group: 'G', home: 'Venezuela', away: 'Portugal' },
  { id: 'G-5', group: 'G', home: 'Venezuela', away: 'Egypt' },
  { id: 'G-6', group: 'G', home: 'Portugal', away: 'Egypt' },

  // Group H — Spain, Bolivia, Italy, Senegal
  { id: 'H-1', group: 'H', home: 'Spain', away: 'Bolivia' },
  { id: 'H-2', group: 'H', home: 'Spain', away: 'Italy' },
  { id: 'H-3', group: 'H', home: 'Spain', away: 'Senegal' },
  { id: 'H-4', group: 'H', home: 'Bolivia', away: 'Italy' },
  { id: 'H-5', group: 'H', home: 'Bolivia', away: 'Senegal' },
  { id: 'H-6', group: 'H', home: 'Italy', away: 'Senegal' },
]

export const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

export const TOTAL_FIXTURES = FIXTURES.length

export function fixturesByGroup() {
  return GROUPS.reduce((acc, group) => {
    acc[group] = FIXTURES.filter((f) => f.group === group)
    return acc
  }, {})
}
