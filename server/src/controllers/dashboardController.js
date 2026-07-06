const db = require('../../db');

async function getDashboard(req, res) {
  try {
    const teams = await db.getTeams();
    const matches = await db.getMatches();
    const totalTeams = teams.length;
    const totalMatches = matches.length;
    const playedMatches = matches.filter(m => m.status === 'finished').length;
    const remainingMatches = totalMatches - playedMatches;
    
    res.status(200).json({
      success: true,
      stats: {
        totalTeams,
        totalMatches,
        playedMatches,
        remainingMatches
      },
      teams,
      matches
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getStandings(req, res) {
  try {
    const matches = await db.getMatches();
    const GROUPS = db.GROUPS;
    
    const allStandings = GROUPS.reduce((acc, g) => {
      acc[g] = db.calculateGroupStandings(g, matches);
      return acc;
    }, {});

    const bestThirdPlaceTeams = db.getBestThirdPlaceTeams(allStandings);

    res.status(200).json({
      success: true,
      standings: allStandings,
      bestThirdPlaceTeams
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getResults(req, res) {
  try {
    const matches = await db.getMatches();
    const results = matches.filter(m => m.status === 'finished');
    res.status(200).json({
      success: true,
      results,
      matches
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getBracket(req, res) {
  try {
    const matches = await db.getMatches();
    const knockoutMatches = matches.filter(m => m.type === 'knockout');
    res.status(200).json(knockoutMatches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getDashboard,
  getStandings,
  getResults,
  getBracket
};
