const prisma = require('../config/prisma');
const { getTeams, getMatches } = require('../../db');

async function isInMemoryMode() {
  const t1 = await getTeams();
  const t2 = await getTeams();
  return t1 === t2;
}

async function getAllTeams() {
  return await getTeams();
}

async function createTeam(teamData) {
  const codeUpper = teamData.code.toUpperCase();
  const inMemory = await isInMemoryMode();
  if (inMemory) {
    const teams = await getTeams();
    if (teams.some(t => t.code === codeUpper)) {
      const err = new Error("Team with this code already exists");
      err.statusCode = 400;
      throw err;
    }
    const newTeam = {
      id: codeUpper,
      name: teamData.name,
      code: codeUpper,
      group: teamData.group,
      flag: teamData.flag
    };
    teams.push(newTeam);
    return newTeam;
  } else {
    // Database mode
    const existing = await prisma.team.findUnique({
      where: { id: codeUpper }
    });
    if (existing) {
      const err = new Error("Team with this code already exists");
      err.statusCode = 400;
      throw err;
    }
    return await prisma.team.create({
      data: {
        id: codeUpper,
        name: teamData.name,
        code: codeUpper,
        group: teamData.group,
        flag: teamData.flag
      }
    });
  }
}

async function updateTeam(id, teamData) {
  const codeUpper = id.toUpperCase();
  const inMemory = await isInMemoryMode();
  if (inMemory) {
    const teams = await getTeams();
    const index = teams.findIndex(t => t.id === codeUpper || t.code === codeUpper);
    if (index === -1) {
      const err = new Error("Team not found");
      err.statusCode = 404;
      throw err;
    }
    teams[index] = {
      ...teams[index],
      name: teamData.name !== undefined ? teamData.name : teams[index].name,
      group: teamData.group !== undefined ? teamData.group : teams[index].group,
      flag: teamData.flag !== undefined ? teamData.flag : teams[index].flag
    };
    return teams[index];
  } else {
    // Database mode
    const existing = await prisma.team.findUnique({
      where: { id: codeUpper }
    });
    if (!existing) {
      const err = new Error("Team not found");
      err.statusCode = 404;
      throw err;
    }
    return await prisma.team.update({
      where: { id: codeUpper },
      data: {
        name: teamData.name !== undefined ? teamData.name : existing.name,
        group: teamData.group !== undefined ? teamData.group : existing.group,
        flag: teamData.flag !== undefined ? teamData.flag : existing.flag
      }
    });
  }
}

async function deleteTeam(id) {
  const codeUpper = id.toUpperCase();
  const inMemory = await isInMemoryMode();
  if (inMemory) {
    const teams = await getTeams();
    const index = teams.findIndex(t => t.id === codeUpper || t.code === codeUpper);
    if (index === -1) {
      const err = new Error("Team not found");
      err.statusCode = 404;
      throw err;
    }
    const teamCode = teams[index].code;
    teams.splice(index, 1);
    
    // Logically nullify match references
    const matches = await getMatches();
    matches.forEach(m => {
      if (m.homeTeam === teamCode) m.homeTeam = null;
      if (m.awayTeam === teamCode) m.awayTeam = null;
      if (m.winner === teamCode) m.winner = null;
      if (m.penaltyWinner === teamCode) m.penaltyWinner = null;
    });
    
    return { message: "Team deleted successfully" };
  } else {
    // Database mode
    const existing = await prisma.team.findUnique({
      where: { id: codeUpper }
    });
    if (!existing) {
      const err = new Error("Team not found");
      err.statusCode = 404;
      throw err;
    }
    
    // Logically nullify match references in PostgreSQL DB
    await prisma.match.updateMany({
      where: { homeTeam: codeUpper },
      data: { homeTeam: null }
    });
    await prisma.match.updateMany({
      where: { awayTeam: codeUpper },
      data: { awayTeam: null }
    });
    await prisma.match.updateMany({
      where: { winner: codeUpper },
      data: { winner: null }
    });
    await prisma.match.updateMany({
      where: { penaltyWinner: codeUpper },
      data: { penaltyWinner: null }
    });
    
    // Delete team
    await prisma.team.delete({
      where: { id: codeUpper }
    });
    return { message: "Team deleted successfully" };
  }
}

module.exports = {
  getAllTeams,
  createTeam,
  updateTeam,
  deleteTeam
};
