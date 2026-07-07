import React, { useState } from "react";
import { getFlagUrl } from "../utils/countryFlag";
import HeadToHeadGuide from "../components/HeadToHeadGuide";

function Standings({ GROUPS, getGroupStandings, getBestThirdPlaceTeams }) {
  const [hoveredTeam, setHoveredTeam] = useState(null);

  // Calculate the 8 best third place teams to see if we can highlight them dynamically!
  const allStandings = GROUPS.reduce((acc, g) => {
    acc[g] = getGroupStandings(g);
    return acc;
  }, {});

  const bestThirdPlaceTeams = getBestThirdPlaceTeams(allStandings);
  const bestThirdPlaceCodes = bestThirdPlaceTeams.map(t => t.code);

  return (
    <div className="container fade-in" style={{ paddingTop: "30px", marginBottom: "50px" }}>
      <h2 style={{ fontFamily: "var(--font-heading)", marginBottom: "8px", fontSize: "28px" }}>
        Official Group Standings
      </h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "30px", fontSize: "15px" }}>
        FIFA World Cup 2026 Format: 48 teams in 12 Groups (A to L). Top 2 teams from each group qualify automatically, plus the 8 best third-place teams across all groups.
      </p>

      {/* Grid of Groups */}
      <div className="standings-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
        {GROUPS.map((groupChar) => {
          const standings = allStandings[groupChar];
          return (
            <div key={groupChar} className="group-card">
              <div className="group-header" style={{ background: "var(--primary)" }}>
                <h3>Group {groupChar}</h3>
                <span>FIFA World Cup 2026</span>
              </div>
              <div className="table-responsive">
                <table className="standings-table">
                  <thead>
                    <tr>
                      <th style={{ width: "40px" }} className="text-center">Pos</th>
                      <th>Country</th>
                      <th className="text-center">MP</th>
                      <th className="text-center">W</th>
                      <th className="text-center">D</th>
                      <th className="text-center">L</th>
                      <th className="text-center">GD</th>
                      <th className="text-center font-bold">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((team, idx) => {
                      const isTop2 = idx < 2;
                      const isThird = idx === 2;
                      const isBestThird = isThird && bestThirdPlaceCodes.includes(team.code);
                      
                      let qualificationClass = "";
                      if (isTop2) {
                        qualificationClass = "qualify-spot"; // Green side-border
                      } else if (isBestThird) {
                        qualificationClass = "best-third-spot"; // Gold side-border style
                      }

                      return (
                        <tr
                          key={team.code}
                          className={qualificationClass}
                          onMouseEnter={() => setHoveredTeam(team.code)}
                          onMouseLeave={() => setHoveredTeam(null)}
                          style={{
                            backgroundColor: hoveredTeam === team.code ? "rgba(244, 197, 66, 0.08)" : "",
                            borderLeft: isTop2 
                              ? "4px solid var(--success)" 
                              : isBestThird 
                                ? "4px solid var(--accent)" 
                                : isThird 
                                  ? "4px solid var(--text-muted)" 
                                  : "none"
                          }}
                        >
                          <td className="text-center font-bold">{idx + 1}</td>
                          <td>
                            <div className="team-cell">
                              <img src={getFlagUrl(team.code)} alt={team.name} width={24} height={18} style={{ marginRight: "8px", borderRadius: "2px" }} />
                              <span style={{ fontWeight: isTop2 ? "600" : "normal" }}>{team.name}</span>
                              <span className="team-code">{team.code}</span>
                            </div>
                          </td>
                          <td className="text-center">{team.P}</td>
                          <td className="text-center">{team.W}</td>
                          <td className="text-center">{team.D}</td>
                          <td className="text-center">{team.L}</td>
                          <td className="text-center" style={{ color: team.GD > 0 ? "var(--success)" : team.GD < 0 ? "var(--danger)" : "inherit" }}>
                            {team.GD > 0 ? `+${team.GD}` : team.GD}
                          </td>
                          <td className="text-center font-bold">{team.Pts}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>

      {/* Best Third-Place Teams Table */}
      <div className="glass" style={{
        marginTop: "50px",
        padding: "24px",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        background: "var(--card)"
      }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "20px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>🌟</span> 3rd Place Teams Ranking
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
          Top 8 third-place teams across all 12 groups advance to the Round of 32. Marked in gold.
        </p>

        <div className="table-responsive">
          <table className="standings-table" style={{ fontSize: "15px" }}>
            <thead>
              <tr>
                <th className="text-center" style={{ width: "60px" }}>Rank</th>
                <th>Group</th>
                <th>Country</th>
                <th className="text-center">MP</th>
                <th className="text-center">W</th>
                <th className="text-center">D</th>
                <th className="text-center">L</th>
                <th className="text-center">GF</th>
                <th className="text-center">GA</th>
                <th className="text-center">GD</th>
                <th className="text-center font-bold">PTS</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {GROUPS.map((g) => {
                const std = standingsOfGroup(g);
                return std[2] ? { ...std[2], group: g } : null;
              }).filter(Boolean)
              .sort((a, b) => {
                if (b.Pts !== a.Pts) return b.Pts - a.Pts;
                if (b.GD !== a.GD) return b.GD - a.GD;
                if (b.GF !== a.GF) return b.GF - a.GF;
                return a.name.localeCompare(b.name);
              })
              .map((team, idx) => {
                const isAdvancing = idx < 8;
                return (
                  <tr
                    key={team.code}
                    style={{
                      backgroundColor: isAdvancing ? "rgba(244, 197, 66, 0.05)" : "",
                      borderLeft: isAdvancing ? "4px solid var(--accent)" : "4px solid var(--danger)"
                    }}
                  >
                    <td className="text-center font-bold">{idx + 1}</td>
                    <td className="font-bold">Group {team.group}</td>
                    <td>
                      <div className="team-cell">
                        <img src={getFlagUrl(team.code)} alt={team.name} width={24} height={18} style={{ marginRight: "8px", borderRadius: "2px" }} />
                        <span>{team.name}</span>
                        <span className="team-code">{team.code}</span>
                      </div>
                    </td>
                    <td className="text-center">{team.P}</td>
                    <td className="text-center">{team.W}</td>
                    <td className="text-center">{team.D}</td>
                    <td className="text-center">{team.L}</td>
                    <td className="text-center">{team.GF}</td>
                    <td className="text-center">{team.GA}</td>
                    <td className="text-center" style={{ color: team.GD > 0 ? "var(--success)" : team.GD < 0 ? "var(--danger)" : "inherit" }}>
                      {team.GD > 0 ? `+${team.GD}` : team.GD}
                    </td>
                    <td className="text-center font-bold">{team.Pts}</td>
                    <td>
                      <span className={`match-status-badge ${isAdvancing ? "finished" : "scheduled"}`} style={{
                        backgroundColor: isAdvancing ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                        color: isAdvancing ? "var(--success)" : "var(--danger)"
                      }}>
                        {isAdvancing ? "Advancing (Q)" : "Eliminated"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Head-to-Head Indicator Guide */}
      <HeadToHeadGuide />
    </div>
  );

  // Local helper to grab group standings
  function standingsOfGroup(gChar) {
    return allStandings[gChar] || [];
  }
}

export default Standings;
