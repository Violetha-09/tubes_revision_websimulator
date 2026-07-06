const teamService = require('../services/teamService');

const getProp = (obj, key) => {
  if (!obj) return undefined;
  const foundKey = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
  return foundKey ? obj[foundKey] : undefined;
};

async function getTeams(req, res) {
  try {
    const teams = await teamService.getAllTeams();
    res.status(200).json(teams);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function createTeam(req, res) {
  const body = (req.body && Object.keys(req.body).length > 0)
    ? req.body
    : (req.query || {});

  const code = getProp(body, 'code') || getProp(body, 'id');
  const name = getProp(body, 'name');
  const group = getProp(body, 'group');
  const flag = getProp(body, 'flag');

  if (!code || !name || !group || !flag) {
    return res.status(400).json({ error: "code/id, name, group, and flag are required" });
  }
  try {
    const team = await teamService.createTeam({ code, name, group, flag });
    res.status(201).json({ message: "Team added successfully", team });
  } catch (error) {
    res.status(error.statusCode || 400).json({ error: error.message });
  }
}

async function updateTeam(req, res) {
  const { id } = req.params;
  const body = (req.body && Object.keys(req.body).length > 0) ? req.body : (req.query || {});
  const name = getProp(body, 'name');
  const group = getProp(body, 'group');
  const flag = getProp(body, 'flag');

  if (name === undefined && group === undefined && flag === undefined) {
    return res.status(400).json({ error: "At least one of name, group, or flag is required for update" });
  }
  try {
    const team = await teamService.updateTeam(id, { name, group, flag });
    res.status(200).json({ message: "Team updated successfully", team });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

async function deleteTeam(req, res) {
  const { id } = req.params;
  try {
    const result = await teamService.deleteTeam(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  }
}

module.exports = {
  getTeams,
  createTeam,
  updateTeam,
  deleteTeam
};
