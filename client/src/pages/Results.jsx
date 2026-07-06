import React, { useState } from "react";
import { getFlagUrl } from "../utils/countryFlag";

function Results({ matches, TEAMS }) {
  const [filter, setFilter] = useState("All");

  const filtered = matches.filter((m) => {
    if (filter === "All") return true;
    if (filter === "Finished") return m.status === "finished";
    if (filter === "Upcoming") return m.status === "scheduled";
    if (filter === "Live") return m.status === "live"; // We can mark some matches as live or keep it empty
    return true;
  });

  return (
    <div className="container fade-in" style={{ paddingTop: "30px", marginBottom: "50px" }}>
      <h2 style={{ fontFamily: "var(--font-heading)", marginBottom: "8px", fontSize: "28px" }}>
        Tournament Match Results
      </h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "30px", fontSize: "15px" }}>
        Full results of all simulated and scheduled matches across all tournament stages.
      </p>

      {/* Filter Tabs */}
      <div className="filters-bar" style={{ justifyContent: "center", marginBottom: "30px" }}>
        <button className={`filter-tab ${filter === "All" ? "active" : ""}`} onClick={() => setFilter("All")}>
          All Matches ({matches.length})
        </button>
        <button className={`filter-tab ${filter === "Finished" ? "active" : ""}`} onClick={() => setFilter("Finished")}>
          Finished ({matches.filter((m) => m.status === "finished").length})
        </button>
        <button className={`filter-tab ${filter === "Upcoming" ? "active" : ""}`} onClick={() => setFilter("Upcoming")}>
          Upcoming ({matches.filter((m) => m.status === "scheduled").length})
        </button>
        <button className={`filter-tab ${filter === "Live" ? "active" : ""}`} onClick={() => setFilter("Live")}>
          Live ({matches.filter((m) => m.status === "live").length})
        </button>
      </div>

      {/* Results List */}
      <div className="matches-grid">
        {filtered.length > 0 ? (
          filtered.map((m) => {
            const home = TEAMS[m.homeTeam];
            const away = TEAMS[m.awayTeam];
            const isFinished = m.status === "finished";

            return (
              <div key={m.id} className="match-card">
                <div className="match-card-header">
                  <span>{m.type === "group" ? `Group ${m.group}` : m.name}</span>
                  <span className={`match-status-badge ${m.status}`}>{m.status}</span>
                </div>

                <div className="match-teams-layout" style={{ margin: "16px 0" }}>
                  <div className="team-display home" style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-end" }}>
                    <span className="team-display-name">{home ? home.name : m.placeholderHome || "TBD"}</span>
                    {home ? (
                      <img
                        src={getFlagUrl(home.code)}
                        alt={home.name}
                        width={24}
                        height={18}
                        loading="lazy"
                        style={{ objectFit: "cover", borderRadius: "2px" }}
                      />
                    ) : (
                      <span className="team-display-flag">🏳️</span>
                    )}
                  </div>

                  <div className="match-score-center">
                    {isFinished ? (
                      <div className="score-box" style={{ fontSize: "18px" }}>
                        <span>{m.homeScore}</span>
                        <span className="score-separator">-</span>
                        <span>{m.awayScore}</span>
                      </div>
                    ) : (
                      <div className="vs-box">VS</div>
                    )}
                    {m.penaltyWinner && (
                      <span style={{ fontSize: "10px", color: "var(--success)", fontWeight: 700, marginTop: "4px" }}>
                        ({TEAMS[m.penaltyWinner]?.code} pens)
                      </span>
                    )}
                  </div>

                  <div className="team-display away" style={{ display: "flex", alignItems: "center", gap: "8px", justifyContent: "flex-start" }}>
                    {away ? (
                      <img
                        src={getFlagUrl(away.code)}
                        alt={away.name}
                        width={24}
                        height={18}
                        loading="lazy"
                        style={{ objectFit: "cover", borderRadius: "2px" }}
                      />
                    ) : (
                      <span className="team-display-flag">🏳️</span>
                    )}
                    <span className="team-display-name">{away ? away.name : m.placeholderAway || "TBD"}</span>
                  </div>
                </div>

                <div className="match-card-footer" style={{ border: "none", paddingTop: "0" }}>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {m.date} • Stadium: {m.stadium || "TBD"}
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "bold" }}>
                    ID: {m.id}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            No matches found under this status.
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;
