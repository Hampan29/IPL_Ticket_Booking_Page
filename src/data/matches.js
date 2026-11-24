export const teams = [
  { code: 'CSK', name: 'Chennai Super Kings' },
  { code: 'MI', name: 'Mumbai Indians' },
  { code: 'RCB', name: 'Royal Challengers Bengaluru' },
  { code: 'KKR', name: 'Kolkata Knight Riders' },
  { code: 'SRH', name: 'Sunrisers Hyderabad' },
  { code: 'RR', name: 'Rajasthan Royals' },
  { code: 'DC', name: 'Delhi Capitals' },
  { code: 'PBKS', name: 'Punjab Kings' },
  { code: 'GT', name: 'Gujarat Titans' },
  { code: 'LSG', name: 'Lucknow Super Giants' },
]

export const venues = [
  'M. A. Chidambaram Stadium, Chennai',
  'Wankhede Stadium, Mumbai',
  'M. Chinnaswamy Stadium, Bengaluru',
  'Eden Gardens, Kolkata',
  'Rajiv Gandhi International Cricket Stadium, Hyderabad',
  'Sawai Mansingh Stadium, Jaipur',
  'Arun Jaitley Stadium, Delhi',
  'Narendra Modi Stadium, Ahmedabad',
]

export const matches = [
  {
    id: 'match-1',
    matchNumber: 'Match 1',
    team1: 'Royal Challengers Bengaluru',
    team1Code: 'RCB',
    team2: 'Chennai Super Kings',
    team2Code: 'CSK',
    date: '31 October 2026, 7:30 PM IST',
    venue: 'M. Chinnaswamy Stadium, Bengaluru',
    prices: {
      General: 500,
      Premium: 1500,
      VIP: 3000,
    },
  },
  {
    id: 'match-2',
    matchNumber: 'Match 2',
    team1: 'Mumbai Indians',
    team1Code: 'MI',
    team2: 'Gujarat Titans',
    team2Code: 'GT',
    date: '01 November 2026, 7:30 PM IST',
    venue: 'Wankhede Stadium, Mumbai',
    prices: {
      General: 600,
      Premium: 1800,
      VIP: 3500,
    },
  },
  {
    id: 'match-3',
    matchNumber: 'Match 3',
    team1: 'Sunrisers Hyderabad',
    team1Code: 'SRH',
    team2: 'Punjab Kings',
    team2Code: 'PBKS',
    date: '02 November 2026, 7:30 PM IST',
    venue: 'Rajiv Gandhi International Cricket Stadium, Hyderabad',
    prices: {
      General: 700,
      Premium: 2000,
      VIP: 4000,
    },
  },
]
