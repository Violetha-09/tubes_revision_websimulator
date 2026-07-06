const API_BASE = "http://localhost:3000/api";

const getHeaders = () => {
  const token = localStorage.getItem("adminToken");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const fetchTeams = async () => {
  const res = await fetch(`${API_BASE}/teams`);
  if (!res.ok) throw new Error("Failed to fetch teams");
  return await res.json();
};

export const fetchMatches = async () => {
  const res = await fetch(`${API_BASE}/matches`);
  if (!res.ok) throw new Error("Failed to fetch matches");
  return await res.json();
};

export const resetTournament = async () => {
  const res = await fetch(`${API_BASE}/matches/reset`, {
    method: "POST",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Failed to reset tournament");
  return await res.json();
};

export const simulateGroupStage = async () => {
  const res = await fetch(`${API_BASE}/matches/simulate-group`, {
    method: "POST",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Failed to simulate group stage");
  return await res.json();
};

export const advanceToKnockout = async () => {
  const res = await fetch(`${API_BASE}/matches/advance-knockout`, {
    method: "POST",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Failed to advance to knockout");
  return await res.json();
};

export const updateMatch = async (matchId, data) => {
  const res = await fetch(`${API_BASE}/matches/${matchId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Failed to update match ${matchId}`);
  return await res.json();
};

export const addTeam = async (teamData) => {
  const res = await fetch(`${API_BASE}/teams`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(teamData)
  });
  if (!res.ok) throw new Error("Failed to add team");
  return await res.json();
};

export const updateTeam = async (code, teamData) => {
  const res = await fetch(`${API_BASE}/teams/${code}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(teamData)
  });
  if (!res.ok) throw new Error("Failed to update team");
  return await res.json();
};

export const deleteTeam = async (code) => {
  const res = await fetch(`${API_BASE}/teams/${code}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!res.ok) throw new Error("Failed to delete team");
  return await res.json();
};

export const login = async (username, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Invalid username or password");
  }
  return await res.json();
};
