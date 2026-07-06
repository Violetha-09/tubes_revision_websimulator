const db = require('../../db');

async function getAllMatches() {
  return await db.getMatches();
}

async function updateMatch(id, data) {
  return await db.updateMatchScore(id, data);
}

async function simulateGroup() {
  return await db.simulateGroupStage();
}

async function advanceKnockout() {
  return await db.advanceToKnockout();
}

async function reset() {
  return await db.resetTournament();
}

module.exports = {
  getAllMatches,
  updateMatch,
  simulateGroup,
  advanceKnockout,
  reset
};
