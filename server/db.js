const { PrismaClient } = require('./generated/prisma');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// --- Static Data and Generators (from frontend) ---
const TEAMS = {
  // Group A
  MEX: { id: "MEX", name: "Mexico", code: "MEX", group: "A", flag: "🇲🇽" },
  JPN: { id: "JPN", name: "Japan", code: "JPN", group: "A", flag: "🇯🇵" },
  RSA: { id: "RSA", name: "South Africa", code: "RSA", group: "A", flag: "🇿🇦" },
  CZE: { id: "CZE", name: "Czech Republic", code: "CZE", group: "A", flag: "🇨🇿" },
  // Group B
  BRA: { id: "BRA", name: "Brazil", code: "BRA", group: "B", flag: "🇧🇷" },
  SUI: { id: "SUI", name: "Switzerland", code: "SUI", group: "B", flag: "🇨🇭" },
  CAN: { id: "CAN", name: "Canada", code: "CAN", group: "B", flag: "🇨🇦" },
  TUN: { id: "TUN", name: "Tunisia", code: "TUN", group: "B", flag: "🇹🇳" },
  // Group C
  ARG: { id: "ARG", name: "Argentina", code: "ARG", group: "C", flag: "🇦🇷" },
  POL: { id: "POL", name: "Poland", code: "POL", group: "C", flag: "🇵🇱" },
  KSA: { id: "KSA", name: "Saudi Arabia", code: "KSA", group: "C", flag: "🇸🇦" },
  ECU: { id: "ECU", name: "Ecuador", code: "ECU", group: "C", flag: "🇪🇨" },
  // Group D
  FRA: { id: "FRA", name: "France", code: "FRA", group: "D", flag: "🇫🇷" },
  DEN: { id: "DEN", name: "Denmark", code: "DEN", group: "D", flag: "🇩🇰" },
  AUS: { id: "AUS", name: "Australia", code: "AUS", group: "D", flag: "🇦🇺" },
  PER: { id: "PER", name: "Peru", code: "PER", group: "D", flag: "🇵🇪" },
  // Group E
  ESP: { id: "ESP", name: "Spain", code: "ESP", group: "E", flag: "🇪🇸" },
  GER: { id: "GER", name: "Germany", code: "GER", group: "E", flag: "🇩🇪" },
  CRC: { id: "CRC", name: "Costa Rica", code: "CRC", group: "E", flag: "🇨🇷" },
  NZL: { id: "NZL", name: "New Zealand", code: "NZL", group: "E", flag: "🇳🇿" },
  // Group F
  BEL: { id: "BEL", name: "Belgium", code: "BEL", group: "F", flag: "🇧🇪" },
  CRO: { id: "CRO", name: "Croatia", code: "CRO", group: "F", flag: "🇭🇷" },
  MAR: { id: "MAR", name: "Morocco", code: "MAR", group: "F", flag: "🇲🇦" },
  SEN: { id: "SEN", name: "Senegal", code: "SEN", group: "F", flag: "🇸🇳" },
  // Group G
  ENG: { id: "ENG", name: "England", code: "ENG", group: "G", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  USA: { id: "USA", name: "USA", code: "USA", group: "G", flag: "🇺🇸" },
  IRN: { id: "IRN", name: "Iran", code: "IRN", group: "G", flag: "🇮🇷" },
  WAL: { id: "WAL", name: "Wales", code: "WAL", group: "G", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿" },
  // Group H
  POR: { id: "POR", name: "Portugal", code: "POR", group: "H", flag: "🇵🇹" },
  URU: { id: "URU", name: "Uruguay", code: "URU", group: "H", flag: "🇺🇾" },
  KOR: { id: "KOR", name: "South Korea", code: "KOR", group: "H", flag: "🇰🇷" },
  GHA: { id: "GHA", name: "Ghana", code: "GHA", group: "H", flag: "🇬🇭" },
  // Group I
  ITA: { id: "ITA", name: "Italy", code: "ITA", group: "I", flag: "🇮🇹" },
  COL: { id: "COL", name: "Colombia", code: "COL", group: "I", flag: "🇨🇴" },
  ALG: { id: "ALG", name: "Algeria", code: "ALG", group: "I", flag: "🇩🇿" },
  UKR: { id: "UKR", name: "Ukraine", code: "UKR", group: "I", flag: "🇺🇦" },
  // Group J
  NED: { id: "NED", name: "Netherlands", code: "NED", group: "J", flag: "🇳🇱" },
  CHI: { id: "CHI", name: "Chile", code: "CHI", group: "J", flag: "🇨🇱" },
  NGA: { id: "NGA", name: "Nigeria", code: "NGA", group: "J", flag: "🇳🇬" },
  SWE: { id: "SWE", name: "Sweden", code: "SWE", group: "J", flag: "🇸🇪" },
  // Group K
  EGY: { id: "EGY", name: "Egypt", code: "EGY", group: "K", flag: "🇪🇬" },
  AUT: { id: "AUT", name: "Austria", code: "AUT", group: "K", flag: "🇦🇹" },
  TUR: { id: "TUR", name: "Turkey", code: "TUR", group: "K", flag: "🇹🇷" },
  JAM: { id: "JAM", name: "Jamaica", code: "JAM", group: "K", flag: "🇯🇲" },
  // Group L
  NOR: { id: "NOR", name: "Norway", code: "NOR", group: "L", flag: "🇳🇴" },
  SRB: { id: "SRB", name: "Serbia", code: "SRB", group: "L", flag: "🇷🇸" },
  CMR: { id: "CMR", name: "Cameroon", code: "CMR", group: "L", flag: "🇨🇲" },
  PAN: { id: "PAN", name: "Panama", code: "PAN", group: "L", flag: "🇵🇦" }
};

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

const STADIUMS = [
  "Azteca Stadium, Mexico City",
  "MetLife Stadium, East Rutherford",
  "SoFi Stadium, Los Angeles",
  "Mercedes-Benz Stadium, Atlanta",
  "AT&T Stadium, Arlington",
  "Hard Rock Stadium, Miami",
  "Lincoln Financial Field, Philadelphia",
  "CenturyLink Field, Seattle",
  "Levi's Stadium, Santa Clara",
  "Gillette Stadium, Foxborough",
  "BC Place, Vancouver",
  "BMO Field, Toronto"
];

const generateGroupMatches = () => {
  const matches = [];
  let matchId = 1;
  const startDate = new Date("2026-06-11");

  GROUPS.forEach((groupChar, groupIdx) => {
    const groupTeams = Object.values(TEAMS).filter((t) => t.group === groupChar);
    
    const getStadium = (index) => STADIUMS[(groupIdx + index) % STADIUMS.length];
    const getMatchDateString = (dayOffset) => {
      const d = new Date(startDate);
      d.setDate(d.getDate() + dayOffset + Math.floor(groupIdx / 2));
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    // Match 1: Team 0 vs Team 1
    matches.push({
      id: `G-${matchId++}`,
      type: "group",
      group: groupChar,
      homeTeam: groupTeams[0].code,
      awayTeam: groupTeams[1].code,
      homeScore: 2,
      awayScore: 1,
      status: "finished",
      stadium: getStadium(0),
      date: getMatchDateString(0),
      kickoff: "18:00"
    });

    // Match 2: Team 2 vs Team 3
    matches.push({
      id: `G-${matchId++}`,
      type: "group",
      group: groupChar,
      homeTeam: groupTeams[2].code,
      awayTeam: groupTeams[3].code,
      homeScore: 1,
      awayScore: 2,
      status: "finished",
      stadium: getStadium(1),
      date: getMatchDateString(0),
      kickoff: "21:00"
    });

    // Match 3: Team 0 vs Team 2
    matches.push({
      id: `G-${matchId++}`,
      type: "group",
      group: groupChar,
      homeTeam: groupTeams[0].code,
      awayTeam: groupTeams[2].code,
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      stadium: getStadium(2),
      date: getMatchDateString(4),
      kickoff: "15:00"
    });

    // Match 4: Team 1 vs Team 3
    matches.push({
      id: `G-${matchId++}`,
      type: "group",
      group: groupChar,
      homeTeam: groupTeams[1].code,
      awayTeam: groupTeams[3].code,
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      stadium: getStadium(3),
      date: getMatchDateString(4),
      kickoff: "18:00"
    });

    // Match 5: Team 3 vs Team 0
    matches.push({
      id: `G-${matchId++}`,
      type: "group",
      group: groupChar,
      homeTeam: groupTeams[3].code,
      awayTeam: groupTeams[0].code,
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      stadium: getStadium(4),
      date: getMatchDateString(8),
      kickoff: "17:00"
    });

    // Match 6: Team 1 vs Team 2
    matches.push({
      id: `G-${matchId++}`,
      type: "group",
      group: groupChar,
      homeTeam: groupTeams[1].code,
      awayTeam: groupTeams[2].code,
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      stadium: getStadium(5),
      date: getMatchDateString(8),
      kickoff: "20:00"
    });
  });

  return matches;
};

const initialKnockoutMatches = [
  // Round of 32 (16 matches)
  { id: "R32-1", type: "knockout", round: "R32", name: "Round of 32", homeTeam: "MEX", awayTeam: "ARG", homeScore: 2, awayScore: 1, status: "finished", winner: "MEX", nextMatchId: "R16-1", isHomeInNextMatch: true, placeholderHome: "Winner Group A", placeholderAway: "Best 3rd Place 1", stadium: "Azteca Stadium, Mexico City", date: "Jun 26, 2026", kickoff: "18:00" },
  { id: "R32-2", type: "knockout", round: "R32", name: "Round of 32", homeTeam: "BRA", awayTeam: "POL", homeScore: 3, awayScore: 0, status: "finished", winner: "BRA", nextMatchId: "R16-1", isHomeInNextMatch: false, placeholderHome: "Runner-up Group B", placeholderAway: "Runner-up Group C", stadium: "MetLife Stadium, East Rutherford", date: "Jun 26, 2026", kickoff: "21:00" },
  { id: "R32-3", type: "knockout", round: "R32", name: "Round of 32", homeTeam: "FRA", awayTeam: "USA", homeScore: 1, awayScore: 2, status: "finished", winner: "USA", nextMatchId: "R16-2", isHomeInNextMatch: true, placeholderHome: "Winner Group D", placeholderAway: "Best 3rd Place 2", stadium: "SoFi Stadium, Los Angeles", date: "Jun 27, 2026", kickoff: "18:00" },
  { id: "R32-4", type: "knockout", round: "R32", name: "Round of 32", homeTeam: "ESP", awayTeam: "CRO", homeScore: 2, awayScore: 2, penaltyWinner: "ESP", status: "finished", winner: "ESP", nextMatchId: "R16-2", isHomeInNextMatch: false, placeholderHome: "Winner Group E", placeholderAway: "Runner-up Group F", stadium: "Mercedes-Benz Stadium, Atlanta", date: "Jun 27, 2026", kickoff: "21:00" },
  
  { id: "R32-5", type: "knockout", round: "R32", name: "Round of 32", homeTeam: "BEL", awayTeam: "JPN", homeScore: 1, awayScore: 0, status: "finished", winner: "BEL", nextMatchId: "R16-3", isHomeInNextMatch: true, placeholderHome: "Winner Group F", placeholderAway: "Best 3rd Place 3", stadium: "AT&T Stadium, Arlington", date: "Jun 28, 2026", kickoff: "18:00" },
  { id: "R32-6", type: "knockout", round: "R32", name: "Round of 32", homeTeam: "ENG", awayTeam: "POR", homeScore: 0, awayScore: 1, status: "finished", winner: "POR", nextMatchId: "R16-3", isHomeInNextMatch: false, placeholderHome: "Runner-up Group G", placeholderAway: "Runner-up Group H", stadium: "Hard Rock Stadium, Miami", date: "Jun 28, 2026", kickoff: "21:00" },
  { id: "R32-7", type: "knockout", round: "R32", name: "Round of 32", homeTeam: "URU", awayTeam: "SUI", homeScore: 2, awayScore: 0, status: "finished", winner: "URU", nextMatchId: "R16-4", isHomeInNextMatch: true, placeholderHome: "Winner Group H", placeholderAway: "Best 3rd Place 4", stadium: "Lincoln Financial Field, Philadelphia", date: "Jun 29, 2026", kickoff: "18:00" },
  { id: "R32-8", type: "knockout", round: "R32", name: "Round of 32", homeTeam: "ITA", awayTeam: "NED", homeScore: 1, awayScore: 3, status: "finished", winner: "NED", nextMatchId: "R16-4", isHomeInNextMatch: false, placeholderHome: "Winner Group I", placeholderAway: "Runner-up Group J", stadium: "CenturyLink Field, Seattle", date: "Jun 29, 2026", kickoff: "21:00" },
  
  { id: "R32-9", type: "knockout", round: "R32", name: "Round of 32", homeTeam: "CAN", awayTeam: "KSA", homeScore: 2, awayScore: 1, status: "finished", winner: "CAN", nextMatchId: "R16-5", isHomeInNextMatch: true, placeholderHome: "Winner Group B", placeholderAway: "Best 3rd Place 5", stadium: "Levi's Stadium, Santa Clara", date: "Jun 30, 2026", kickoff: "18:00" },
  { id: "R32-10", type: "knockout", round: "R32", name: "Round of 32", homeTeam: "CZE", awayTeam: "DEN", homeScore: 1, awayScore: 2, status: "finished", winner: "DEN", nextMatchId: "R16-5", isHomeInNextMatch: false, placeholderHome: "Runner-up Group A", placeholderAway: "Runner-up Group D", stadium: "Gillette Stadium, Foxborough", date: "Jun 30, 2026", kickoff: "21:00" },
  { id: "R32-11", type: "knockout", round: "R32", name: "Round of 32", homeTeam: "KSA", awayTeam: "GER", homeScore: 0, awayScore: 4, status: "finished", winner: "GER", nextMatchId: "R16-6", isHomeInNextMatch: true, placeholderHome: "Winner Group C", placeholderAway: "Best 3rd Place 6", stadium: "BC Place, Vancouver", date: "Jul 01, 2026", kickoff: "18:00" },
  { id: "R32-12", type: "knockout", round: "R32", name: "Round of 32", homeTeam: "WAL", awayTeam: "CRC", homeScore: 2, awayScore: 1, status: "finished", winner: "WAL", nextMatchId: "R16-6", isHomeInNextMatch: false, placeholderHome: "Winner Group G", placeholderAway: "Runner-up Group E", stadium: "BMO Field, Toronto", date: "Jul 01, 2026", kickoff: "21:00" },
  
  { id: "R32-13", type: "knockout", round: "R32", name: "Round of 32", homeTeam: "CHI", awayTeam: "EGY", homeScore: 3, awayScore: 1, status: "finished", winner: "CHI", nextMatchId: "R16-7", isHomeInNextMatch: true, placeholderHome: "Winner Group J", placeholderAway: "Best 3rd Place 7", stadium: "Azteca Stadium, Mexico City", date: "Jul 02, 2026", kickoff: "18:00" },
  { id: "R32-14", type: "knockout", round: "R32", name: "Round of 32", homeTeam: "AUT", awayTeam: "SRB", homeScore: 1, awayScore: 1, penaltyWinner: "SRB", status: "finished", winner: "SRB", nextMatchId: "R16-7", isHomeInNextMatch: false, placeholderHome: "Runner-up Group K", placeholderAway: "Runner-up Group L", stadium: "MetLife Stadium, East Rutherford", date: "Jul 02, 2026", kickoff: "21:00" },
  { id: "R32-15", type: "knockout", round: "R32", name: "Round of 32", homeTeam: "TUR", awayTeam: "NOR", homeScore: 0, awayScore: 2, status: "finished", winner: "NOR", nextMatchId: "R16-8", isHomeInNextMatch: true, placeholderHome: "Winner Group K", placeholderAway: "Best 3rd Place 8", stadium: "SoFi Stadium, Los Angeles", date: "Jul 03, 2026", kickoff: "18:00" },
  { id: "R32-16", type: "knockout", round: "R32", name: "Round of 32", homeTeam: "CMR", awayTeam: "COL", homeScore: 1, awayScore: 2, status: "finished", winner: "COL", nextMatchId: "R16-8", isHomeInNextMatch: false, placeholderHome: "Winner Group L", placeholderAway: "Runner-up Group I", stadium: "Mercedes-Benz Stadium, Atlanta", date: "Jul 03, 2026", kickoff: "21:00" },

  // Round of 16 (8 matches)
  { id: "R16-1", type: "knockout", round: "R16", name: "Round of 16", homeTeam: "MEX", awayTeam: "BRA", homeScore: 1, awayScore: 3, status: "finished", winner: "BRA", nextMatchId: "QF-1", isHomeInNextMatch: true, placeholderHome: "Winner R32-1", placeholderAway: "Winner R32-2", stadium: "AT&T Stadium, Arlington", date: "Jul 05, 2026", kickoff: "18:00" },
  { id: "R16-2", type: "knockout", round: "R16", name: "Round of 16", homeTeam: "USA", awayTeam: "ESP", homeScore: 0, awayScore: 2, status: "finished", winner: "ESP", nextMatchId: "QF-1", isHomeInNextMatch: false, placeholderHome: "Winner R32-3", placeholderAway: "Winner R32-4", stadium: "Hard Rock Stadium, Miami", date: "Jul 05, 2026", kickoff: "21:00" },
  { id: "R16-3", type: "knockout", round: "R16", name: "Round of 16", homeTeam: "BEL", awayTeam: "POR", homeScore: 2, awayScore: 1, status: "finished", winner: "BEL", nextMatchId: "QF-2", isHomeInNextMatch: true, placeholderHome: "Winner R32-5", placeholderAway: "Winner R32-6", stadium: "Lincoln Financial Field, Philadelphia", date: "Jul 06, 2026", kickoff: "18:00" },
  { id: "R16-4", type: "knockout", round: "R16", name: "Round of 16", homeTeam: "URU", awayTeam: "NED", homeScore: 1, awayScore: 1, penaltyWinner: "NED", status: "finished", winner: "NED", nextMatchId: "QF-2", isHomeInNextMatch: false, placeholderHome: "Winner R32-7", placeholderAway: "Winner R32-8", stadium: "CenturyLink Field, Seattle", date: "Jul 06, 2026", kickoff: "21:00" },
  { id: "R16-5", type: "knockout", round: "R16", name: "Round of 16", homeTeam: "CAN", awayTeam: "DEN", homeScore: 1, awayScore: 2, status: "finished", winner: "DEN", nextMatchId: "QF-3", isHomeInNextMatch: true, placeholderHome: "Winner R32-9", placeholderAway: "Winner R32-10", stadium: "Levi's Stadium, Santa Clara", date: "Jul 07, 2026", kickoff: "18:00" },
  { id: "R16-6", type: "knockout", round: "R16", name: "Round of 16", homeTeam: "GER", awayTeam: "WAL", homeScore: 3, awayScore: 0, status: "finished", winner: "GER", nextMatchId: "QF-3", isHomeInNextMatch: false, placeholderHome: "Winner R32-11", placeholderAway: "Winner R32-12", stadium: "Gillette Stadium, Foxborough", date: "Jul 07, 2026", kickoff: "21:00" },
  { id: "R16-7", type: "knockout", round: "R16", name: "Round of 16", homeTeam: "CHI", awayTeam: "SRB", homeScore: 2, awayScore: 0, status: "finished", winner: "CHI", nextMatchId: "QF-4", isHomeInNextMatch: true, placeholderHome: "Winner R32-13", placeholderAway: "Winner R32-14", stadium: "BC Place, Vancouver", date: "Jul 08, 2026", kickoff: "18:00" },
  { id: "R16-8", type: "knockout", round: "R16", name: "Round of 16", homeTeam: "NOR", awayTeam: "COL", homeScore: 0, awayScore: 1, status: "finished", winner: "COL", nextMatchId: "QF-4", isHomeInNextMatch: false, placeholderHome: "Winner R32-15", placeholderAway: "Winner R32-16", stadium: "BMO Field, Toronto", date: "Jul 08, 2026", kickoff: "21:00" },

  // Quarterfinals (4 matches)
  { id: "QF-1", type: "knockout", round: "QF", name: "Quarter-final", homeTeam: "BRA", awayTeam: "ESP", homeScore: 2, awayScore: 1, status: "finished", winner: "BRA", nextMatchId: "SF-1", isHomeInNextMatch: true, placeholderHome: "Winner R16-1", placeholderAway: "Winner R16-2", stadium: "Azteca Stadium, Mexico City", date: "Jul 11, 2026", kickoff: "18:00" },
  { id: "QF-2", type: "knockout", round: "QF", name: "Quarter-final", homeTeam: "BEL", awayTeam: "NED", homeScore: 0, awayScore: 2, status: "finished", winner: "NED", nextMatchId: "SF-1", isHomeInNextMatch: false, placeholderHome: "Winner R16-3", placeholderAway: "Winner R16-4", stadium: "MetLife Stadium, East Rutherford", date: "Jul 11, 2026", kickoff: "21:00" },
  { id: "QF-3", type: "knockout", round: "QF", name: "Quarter-final", homeTeam: "DEN", awayTeam: "GER", homeScore: 1, awayScore: 3, status: "finished", winner: "GER", nextMatchId: "SF-2", isHomeInNextMatch: true, placeholderHome: "Winner R16-5", placeholderAway: "Winner R16-6", stadium: "SoFi Stadium, Los Angeles", date: "Jul 12, 2026", kickoff: "18:00" },
  { id: "QF-4", type: "knockout", round: "QF", name: "Quarter-final", homeTeam: "CHI", awayTeam: "COL", homeScore: 1, awayScore: 0, status: "finished", winner: "CHI", nextMatchId: "SF-2", isHomeInNextMatch: false, placeholderHome: "Winner R16-7", placeholderAway: "Winner R16-8", stadium: "Mercedes-Benz Stadium, Atlanta", date: "Jul 12, 2026", kickoff: "21:00" },

  // Semifinals (2 matches)
  { id: "SF-1", type: "knockout", round: "SF", name: "Semi-final", homeTeam: "BRA", awayTeam: "NED", homeScore: 3, awayScore: 2, status: "finished", winner: "BRA", nextMatchId: "F", isHomeInNextMatch: true, placeholderHome: "Winner QF-1", placeholderAway: "Winner QF-2", stadium: "AT&T Stadium, Arlington", date: "Jul 15, 2026", kickoff: "18:00" },
  { id: "SF-2", type: "knockout", round: "SF", name: "Semi-final", homeTeam: "GER", awayTeam: "CHI", homeScore: 2, awayScore: 0, status: "finished", winner: "GER", nextMatchId: "F", isHomeInNextMatch: false, placeholderHome: "Winner QF-3", placeholderAway: "Winner QF-4", stadium: "Hard Rock Stadium, Miami", date: "Jul 15, 2026", kickoff: "21:00" },

  // Final (1 match)
  { id: "F", type: "knockout", round: "F", name: "Final", homeTeam: "BRA", awayTeam: "GER", homeScore: 2, awayScore: 1, status: "finished", winner: "BRA", nextMatchId: null, placeholderHome: "Winner SF-1", placeholderAway: "Winner SF-2", stadium: "MetLife Stadium, East Rutherford", date: "Jul 19, 2026", kickoff: "19:00" }
];

// --- In-Memory Fallback Database ---
let inMemoryTeams = Object.values(TEAMS);
let inMemoryMatches = generateGroupMatches().concat(initialKnockoutMatches);

// --- Prisma Initialization with Fallback Support ---
let prisma = null;
let useDatabase = false;

const isPasswordPlaceholder = (url) => {
  return !url || url.includes('[YOUR-PASSWORD]');
};

const initPrisma = async () => {
  const dbUrl = process.env.DATABASE_URL;
  if (isPasswordPlaceholder(dbUrl)) {
    console.warn("⚠️  DATABASE_URL uses [YOUR-PASSWORD] placeholder. Falling back to In-Memory DB.");
    useDatabase = false;
    return;
  }

  try {
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);
    prisma = new PrismaClient({ adapter });
    await prisma.$connect();
    useDatabase = true;
    console.log("🚀 Connected to Supabase PostgreSQL via Prisma Client (v7 adapter)!");
    await seedDatabaseIfNeeded();
  } catch (error) {
    console.error("❌ Failed to connect to PostgreSQL database. Falling back to In-Memory DB.", error.message);
    useDatabase = false;
  }
};

const seedDatabaseIfNeeded = async () => {
  if (!useDatabase || !prisma) return;
  try {
    // Seed admin user if not exists
    const adminUser = await prisma.user.findUnique({ where: { username: "admin" } });
    if (!adminUser) {
      console.log("🌱 Default admin user not found. Seeding admin...");
      await prisma.user.create({
        data: {
          username: "admin",
          password: "$2a$10$bT.J8r/Ny8Bd4rdN7yGcHur5l4JKgKUOeS.FHCgdFiCuvdE7sqt1q", // bcrypt hash of admin123
          role: "Admin"
        }
      });
    }

    const teamCount = await prisma.team.count();
    const matchCount = await prisma.match.count();
    
    // If the database is empty, or has outdated 32-team schema records (e.g. less than 48 teams)
    if (teamCount !== 48 || matchCount !== 103) {
      console.log("🌱 Database data missing, incomplete or outdated. Seeding 48 teams and 103 matches...");
      
      // Clean start
      await prisma.match.deleteMany({});
      await prisma.team.deleteMany({});
      
      // Seed teams
      await prisma.team.createMany({
        data: Object.values(TEAMS).map(t => ({
          id: t.id,
          name: t.name,
          code: t.code,
          group: t.group,
          flag: t.flag
        }))
      });

      // Seed matches
      const defaultMatches = generateGroupMatches().concat(initialKnockoutMatches);
      await prisma.match.createMany({
        data: defaultMatches.map(m => ({
          id: m.id,
          type: m.type,
          group: m.group || null,
          round: m.round || null,
          name: m.name || null,
          homeTeam: m.homeTeam || null,
          awayTeam: m.awayTeam || null,
          homeScore: m.homeScore,
          awayScore: m.awayScore,
          status: m.status,
          nextMatchId: m.nextMatchId || null,
          isHomeInNextMatch: m.isHomeInNextMatch !== undefined ? m.isHomeInNextMatch : null,
          placeholderHome: m.placeholderHome || null,
          placeholderAway: m.placeholderAway || null,
          winner: m.winner || null,
          penaltyWinner: m.penaltyWinner || null,
          stadium: m.stadium || null,
          date: m.date || null,
          kickoff: m.kickoff || null
        }))
      });

      console.log("🌱 Database successfully seeded with 48 teams and 103 matches!");
    } else {
      console.log("👍 Database already contains 48 teams and 103 matches. Skipping seeding.");
    }
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
};

// --- Database operations abstraction ---

const getTeams = async () => {
  if (useDatabase && prisma) {
    try {
      return await prisma.team.findMany();
    } catch (e) {
      console.error("Prisma error, falling back to memory:", e.message);
    }
  }
  return inMemoryTeams;
};

const getMatches = async () => {
  if (useDatabase && prisma) {
    try {
      const dbMatches = await prisma.match.findMany();
      return dbMatches;
    } catch (e) {
      console.error("Prisma error, falling back to memory:", e.message);
    }
  }
  return inMemoryMatches;
};

const resetTournament = async () => {
  const cleanMatches = generateGroupMatches().concat(initialKnockoutMatches);
  
  if (useDatabase && prisma) {
    try {
      await prisma.match.deleteMany({});
      await prisma.match.createMany({
        data: cleanMatches.map(m => ({
          id: m.id,
          type: m.type,
          group: m.group || null,
          round: m.round || null,
          name: m.name || null,
          homeTeam: m.homeTeam || null,
          awayTeam: m.awayTeam || null,
          homeScore: m.homeScore,
          awayScore: m.awayScore,
          status: m.status,
          nextMatchId: m.nextMatchId || null,
          isHomeInNextMatch: m.isHomeInNextMatch !== undefined ? m.isHomeInNextMatch : null,
          placeholderHome: m.placeholderHome || null,
          placeholderAway: m.placeholderAway || null,
          winner: m.winner || null,
          penaltyWinner: m.penaltyWinner || null,
          stadium: m.stadium || null,
          date: m.date || null,
          kickoff: m.kickoff || null
        }))
      });
      return cleanMatches;
    } catch (e) {
      console.error("Prisma error, falling back to memory:", e.message);
    }
  }
  
  inMemoryMatches = cleanMatches;
  return inMemoryMatches;
};

// Simulate Group matches
const simulateGroupStage = async () => {
  let currentMatches = await getMatches();
  
  const updatedMatches = currentMatches.map((m) => {
    if (m.type === "group" && m.status !== "finished") {
      const homeScore = Math.floor(Math.random() * 4);
      const awayScore = Math.floor(Math.random() * 3);
      return {
        ...m,
        homeScore,
        awayScore,
        status: "finished"
      };
    }
    return m;
  });

  if (useDatabase && prisma) {
    try {
      for (const m of updatedMatches) {
        if (m.type === "group") {
          await prisma.match.update({
            where: { id: m.id },
            data: {
              homeScore: m.homeScore,
              awayScore: m.awayScore,
              status: m.status
            }
          });
        }
      }
      return updatedMatches;
    } catch (e) {
      console.error("Prisma error, falling back to memory:", e.message);
    }
  }

  inMemoryMatches = updatedMatches;
  return inMemoryMatches;
};

// Standings Calculator for a specific group (Helper)
const calculateGroupStandings = (groupChar, matchesList, teamsList) => {
  const currentTeamsList = teamsList || Object.values(TEAMS);
  const groupTeams = currentTeamsList.filter((t) => t.group === groupChar);
  
  const standings = groupTeams.reduce((acc, team) => {
    acc[team.code] = {
      ...team,
      P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0
    };
    return acc;
  }, {});

  const groupMatches = matchesList.filter(
    (m) => m.type === "group" && m.group === groupChar && m.status === "finished"
  );

  groupMatches.forEach((m) => {
    const home = standings[m.homeTeam];
    const away = standings[m.awayTeam];

    if (home && away) {
      home.P += 1;
      away.P += 1;
      home.GF += m.homeScore;
      home.GA += m.awayScore;
      away.GF += m.awayScore;
      away.GA += m.homeScore;

      if (m.homeScore > m.awayScore) {
        home.W += 1;
        home.Pts += 3;
        away.L += 1;
      } else if (m.awayScore > m.homeScore) {
        away.W += 1;
        away.Pts += 3;
        home.L += 1;
      } else {
        home.D += 1;
        away.D += 1;
        home.Pts += 1;
        away.Pts += 1;
      }
    }
  });

  Object.values(standings).forEach((team) => {
    team.GD = team.GF - team.GA;
  });

  return Object.values(standings).sort((a, b) => {
    if (b.Pts !== a.Pts) return b.Pts - a.Pts;
    if (b.GD !== a.GD) return b.GD - a.GD;
    if (b.GF !== a.GF) return b.GF - a.GF;
    return a.name.localeCompare(b.name);
  });
};

const getBestThirdPlaceTeams = (allGroupStandings) => {
  const thirdPlaceTeams = [];
  Object.keys(allGroupStandings).forEach((groupChar) => {
    const standings = allGroupStandings[groupChar];
    if (standings[2]) {
      thirdPlaceTeams.push({
        ...standings[2],
        group: groupChar
      });
    }
  });
  
  return thirdPlaceTeams.sort((a, b) => {
    if (b.Pts !== a.Pts) return b.Pts - a.Pts;
    if (b.GD !== a.GD) return b.GD - a.GD;
    if (b.GF !== a.GF) return b.GF - a.GF;
    return a.name.localeCompare(b.name);
  }).slice(0, 8); // Top 8 advance
};

// Advance to Knockout Stage
const advanceToKnockout = async () => {
  const currentMatches = await getMatches();
  const currentTeams = await getTeams();
  
  // Get group standings
  const allStandings = GROUPS.reduce((acc, g) => {
    acc[g] = calculateGroupStandings(g, currentMatches, currentTeams);
    return acc;
  }, {});

  // Best 3rd place teams
  const bestThirds = getBestThirdPlaceTeams(allStandings);
  
  // Map of qualifiers
  const winners = {};
  const runnersUp = {};
  
  GROUPS.forEach((g) => {
    winners[g] = allStandings[g][0]?.code || null;
    runnersUp[g] = allStandings[g][1]?.code || null;
  });

  const getBestThirdCode = (idx) => {
    return bestThirds[idx]?.code || null;
  };

  const updatedMatches = currentMatches.map((m) => {
    if (m.type === "knockout") {
      const cleanNode = {
        ...m,
        homeScore: null,
        awayScore: null,
        status: "scheduled",
        winner: null,
        penaltyWinner: null
      };

      if (m.round === "R32") {
        if (m.id === "R32-1") { cleanNode.homeTeam = winners["A"]; cleanNode.awayTeam = getBestThirdCode(0); }
        else if (m.id === "R32-2") { cleanNode.homeTeam = runnersUp["B"]; cleanNode.awayTeam = runnersUp["C"]; }
        else if (m.id === "R32-3") { cleanNode.homeTeam = winners["D"]; cleanNode.awayTeam = getBestThirdCode(1); }
        else if (m.id === "R32-4") { cleanNode.homeTeam = winners["E"]; cleanNode.awayTeam = runnersUp["F"]; }
        
        else if (m.id === "R32-5") { cleanNode.homeTeam = winners["F"]; cleanNode.awayTeam = getBestThirdCode(2); }
        else if (m.id === "R32-6") { cleanNode.homeTeam = runnersUp["G"]; cleanNode.awayTeam = runnersUp["H"]; }
        else if (m.id === "R32-7") { cleanNode.homeTeam = winners["H"]; cleanNode.awayTeam = getBestThirdCode(3); }
        else if (m.id === "R32-8") { cleanNode.homeTeam = winners["I"]; cleanNode.awayTeam = runnersUp["J"]; }
        
        else if (m.id === "R32-9") { cleanNode.homeTeam = winners["B"]; cleanNode.awayTeam = getBestThirdCode(4); }
        else if (m.id === "R32-10") { cleanNode.homeTeam = runnersUp["A"]; cleanNode.awayTeam = runnersUp["D"]; }
        else if (m.id === "R32-11") { cleanNode.homeTeam = winners["C"]; cleanNode.awayTeam = getBestThirdCode(5); }
        else if (m.id === "R32-12") { cleanNode.homeTeam = winners["G"]; cleanNode.awayTeam = runnersUp["E"]; }
        
        else if (m.id === "R32-13") { cleanNode.homeTeam = winners["J"]; cleanNode.awayTeam = getBestThirdCode(6); }
        else if (m.id === "R32-14") { cleanNode.homeTeam = runnersUp["K"]; cleanNode.awayTeam = runnersUp["L"]; }
        else if (m.id === "R32-15") { cleanNode.homeTeam = winners["K"]; cleanNode.awayTeam = getBestThirdCode(7); }
        else if (m.id === "R32-16") { cleanNode.homeTeam = winners["L"]; cleanNode.awayTeam = runnersUp["I"]; }

        // Fallback for R32 if null
        if (!cleanNode.homeTeam) cleanNode.homeTeam = "MEX";
        if (!cleanNode.awayTeam) cleanNode.awayTeam = "BRA";
      } else {
        cleanNode.homeTeam = null;
        cleanNode.awayTeam = null;
      }

      return cleanNode;
    }
    return m;
  });

  if (useDatabase && prisma) {
    try {
      for (const m of updatedMatches) {
        if (m.type === "knockout") {
          await prisma.match.update({
            where: { id: m.id },
            data: {
              homeTeam: m.homeTeam,
              awayTeam: m.awayTeam,
              homeScore: m.homeScore,
              awayScore: m.awayScore,
              status: m.status,
              winner: m.winner,
              penaltyWinner: m.penaltyWinner
            }
          });
        }
      }
      return updatedMatches;
    } catch (e) {
      console.error("Prisma error, falling back to memory:", e.message);
    }
  }

  inMemoryMatches = updatedMatches;
  return inMemoryMatches;
};

// Update Match Score
const updateMatchScore = async (id, homeScoreOrData, awayScore, penaltyWinner) => {
  let homeScore, status, stadium, date, kickoff, homeTeam, awayTeam;
  if (homeScoreOrData && typeof homeScoreOrData === 'object') {
    homeScore = homeScoreOrData.homeScore;
    awayScore = homeScoreOrData.awayScore;
    penaltyWinner = homeScoreOrData.penaltyWinner;
    status = homeScoreOrData.status;
    stadium = homeScoreOrData.stadium;
    date = homeScoreOrData.date;
    kickoff = homeScoreOrData.kickoff;
    homeTeam = homeScoreOrData.homeTeam;
    awayTeam = homeScoreOrData.awayTeam;
  } else {
    homeScore = homeScoreOrData;
  }

  let currentMatches = await getMatches();
  const matchToUpdate = currentMatches.find((m) => m.id === id);
  if (!matchToUpdate) throw new Error("Match not found");

  // Determine scores and status values
  const finalHomeScore = homeScore !== undefined && homeScore !== null && homeScore !== "" ? parseInt(homeScore, 10) : null;
  const finalAwayScore = awayScore !== undefined && awayScore !== null && awayScore !== "" ? parseInt(awayScore, 10) : null;
  
  // If scores are provided, auto-set status to finished if not explicitly provided
  const finalStatus = status !== undefined ? status : (finalHomeScore !== null && finalAwayScore !== null ? "finished" : matchToUpdate.status);

  // Compute winner for knockout match if finished
  let winnerTeam = null;
  const currentHomeTeam = homeTeam !== undefined ? homeTeam : matchToUpdate.homeTeam;
  const currentAwayTeam = awayTeam !== undefined ? awayTeam : matchToUpdate.awayTeam;
  if (matchToUpdate.type === "knockout" && finalStatus === "finished" && currentHomeTeam && currentAwayTeam) {
    if (finalHomeScore > finalAwayScore) {
      winnerTeam = currentHomeTeam;
    } else if (finalAwayScore > finalHomeScore) {
      winnerTeam = currentAwayTeam;
    } else {
      winnerTeam = penaltyWinner || null;
    }
  }

  // Update match itself
  let updatedMatches = currentMatches.map((m) => {
    if (m.id === id) {
      return {
        ...m,
        homeTeam: currentHomeTeam,
        awayTeam: currentAwayTeam,
        homeScore: finalHomeScore,
        awayScore: finalAwayScore,
        status: finalStatus,
        winner: winnerTeam,
        penaltyWinner: finalHomeScore === finalAwayScore ? penaltyWinner : null,
        stadium: stadium !== undefined ? stadium : m.stadium,
        date: date !== undefined ? date : m.date,
        kickoff: kickoff !== undefined ? kickoff : m.kickoff
      };
    }
    return m;
  });

  // Handle knockout propagation
  if (matchToUpdate.type === "knockout" && finalStatus === "finished" && winnerTeam) {
    const updatedMatchObj = updatedMatches.find((m) => m.id === id);
    let tempMatches = [...updatedMatches];
    const nextMatchId = updatedMatchObj.nextMatchId;
    
    if (nextMatchId) {
      tempMatches = tempMatches.map((m) => {
        if (m.id === nextMatchId) {
          const nextNode = { ...m };
          if (updatedMatchObj.isHomeInNextMatch) {
            nextNode.homeTeam = winnerTeam;
          } else {
            nextNode.awayTeam = winnerTeam;
          }
          nextNode.homeScore = null;
          nextNode.awayScore = null;
          nextNode.status = "scheduled";
          nextNode.winner = null;
          nextNode.penaltyWinner = null;
          return nextNode;
        }
        return m;
      });

      // Clear downstream nodes
      const nextNode = tempMatches.find(m => m.id === nextMatchId);
      let nextNextId = nextNode.nextMatchId;
      while (nextNextId) {
        const currentNext = nextNextId;
        let nextFound = false;
        tempMatches = tempMatches.map((m) => {
          if (m.id === currentNext) {
            nextFound = true;
            const node = { ...m };
            node.homeTeam = null;
            node.awayTeam = null;
            node.homeScore = null;
            node.awayScore = null;
            node.status = "scheduled";
            node.winner = null;
            node.penaltyWinner = null;
            nextNextId = node.nextMatchId;
            return node;
          }
          return m;
        });
        if (!nextFound) break;
      }
    }
    updatedMatches = tempMatches;
  }

  if (useDatabase && prisma) {
    try {
      for (const m of updatedMatches) {
        const oldMatch = currentMatches.find(old => old.id === m.id);
        if (
          oldMatch.homeScore !== m.homeScore ||
          oldMatch.awayScore !== m.awayScore ||
          oldMatch.status !== m.status ||
          oldMatch.homeTeam !== m.homeTeam ||
          oldMatch.awayTeam !== m.awayTeam ||
          oldMatch.winner !== m.winner ||
          oldMatch.penaltyWinner !== m.penaltyWinner ||
          oldMatch.stadium !== m.stadium ||
          oldMatch.date !== m.date ||
          oldMatch.kickoff !== m.kickoff
        ) {
          await prisma.match.update({
            where: { id: m.id },
            data: {
              homeTeam: m.homeTeam,
              awayTeam: m.awayTeam,
              homeScore: m.homeScore,
              awayScore: m.awayScore,
              status: m.status,
              winner: m.winner,
              penaltyWinner: m.penaltyWinner,
              stadium: m.stadium,
              date: m.date,
              kickoff: m.kickoff
            }
          });
        }
      }
      return updatedMatches;
    } catch (e) {
      console.error("Prisma error, falling back to memory:", e.message);
    }
  }

  inMemoryMatches = updatedMatches;
  return inMemoryMatches;
};

module.exports = {
  initPrisma,
  getTeams,
  getMatches,
  resetTournament,
  simulateGroupStage,
  advanceToKnockout,
  updateMatchScore,
  calculateGroupStandings,
  getBestThirdPlaceTeams,
  GROUPS
};
