const matchService = require('../services/matchService');

async function getMatches(req, res) {
  try {
    const matches = await matchService.getAllMatches();
    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateMatch(req, res) {
  const { id } = req.params;
  try {
    const matches = await matchService.updateMatch(id, req.body);
    res.status(200).json({ message: `Match ${id} updated successfully`, matches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function simulateGroup(req, res) {
  try {
    const matches = await matchService.simulateGroup();
    res.status(200).json({ message: "Group stage simulated successfully", matches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function advanceKnockout(req, res) {
  try {
    const matches = await matchService.advanceKnockout();
    res.status(200).json({ message: "Advanced to knockout stage successfully", matches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function reset(req, res) {
  try {
    const matches = await matchService.reset();
    res.status(200).json({ message: "Tournament reset successfully", matches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getMatches,
  updateMatch,
  simulateGroup,
  advanceKnockout,
  reset
};
