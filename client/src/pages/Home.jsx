import React from "react";

function Home({ setActiveTab, getGroupStandings, matches, TEAMS }) {
  // 1. Group Standings Previews for Group A, B, C
  const previewGroups = ["A", "B", "C"];

  // 2. Recent Matches Preview
  // We can show some notable matches: Mexico vs Japan (Group A), Canada vs Germany (Group E - wait, Canada is B, Germany is E; let's show some scheduled or finished matches)
  // Let's filter some interesting matches
  const previewMatches = matches.slice(0, 4); // Just show the first 4 group stage matches for preview

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-overlay"></div>
        <div className="container">
          <span className="hero-badge">🏆 OFFICIAL 48-TEAM SIMULATOR</span>
          <h2 className="hero-title">FIFA WORLD CUP 2026 SIMULATOR</h2>
          <p className="hero-subtitle">
            Predict group stage results, simulate team scores, generate knockout brackets, and discover alternate tournament outcomes in real-time.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => setActiveTab("matches")}>
              Start Simulation
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveTab("matches")}>
              View Matches
            </button>
          </div>
        </div>
      </section>

      {/* Main Preview sections grid */}
      <section className="container" style={{ marginTop: "40px", marginBottom: "50px" }}>
        
        {/* Section 1: Group Standings Preview */}
        <div className="preview-container" style={{ marginBottom: "50px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", borderBottom: "2px solid var(--accent)", paddingBottom: "4px" }}>
              📊 Group Standings Preview
            </h3>
            <button className="btn btn-secondary" style={{ padding: "6px 16px", fontSize: "14px" }} onClick={() => setActiveTab("standings")}>
              View All Groups →
            </button>
          </div>
          
          <div className="standings-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            {previewGroups.map((groupChar) => {
              const standings = getGroupStandings(groupChar);
              return (
                <div key={groupChar} className="group-card">
                  <div className="group-header">
                    <h3>Group {groupChar}</h3>
                    <span>FIFA 2026</span>
                  </div>
                  <div className="table-responsive">
                    <table className="standings-table">
                      <thead>
                        <tr>
                          <th>Pos</th>
                          <th>Team</th>
                          <th className="text-center">P</th>
                          <th className="text-center">W</th>
                          <th className="text-center">D</th>
                          <th className="text-center font-bold">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {standings.map((team, idx) => (
                          <tr key={team.code} className={idx < 2 ? "qualify-spot" : ""}>
                            <td className="text-center font-bold">{idx + 1}</td>
                            <td>
                              <div className="team-cell">
                                <span className="team-flag">{team.flag}</span>
                                <span>{team.name}</span>
                              </div>
                            </td>
                            <td className="text-center">{team.P}</td>
                            <td className="text-center">{team.W}</td>
                            <td className="text-center">{team.D}</td>
                            <td className="text-center font-bold">{team.Pts}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Matches Preview */}
        <div className="preview-container" style={{ marginBottom: "50px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", borderBottom: "2px solid var(--accent)", paddingBottom: "4px" }}>
              ⚽ Matches Preview
            </h3>
            <button className="btn btn-secondary" style={{ padding: "6px 16px", fontSize: "14px" }} onClick={() => setActiveTab("matches")}>
              View All Matches →
            </button>
          </div>

          <div className="matches-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            {previewMatches.map((m) => {
              const home = TEAMS[m.homeTeam];
              const away = TEAMS[m.awayTeam];
              return (
                <div key={m.id} className="match-card" style={{ padding: "14px" }}>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "8px", fontWeight: "bold" }}>
                    GROUP {m.group} • {m.date}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>{home?.flag}</span>
                      <span style={{ fontWeight: 600, fontSize: "14px" }}>{home?.name}</span>
                    </div>
                    <span style={{ fontWeight: "bold", fontSize: "14px", color: "var(--text-muted)" }}>
                      {m.status === "finished" ? m.homeScore : "-"}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span>{away?.flag}</span>
                      <span style={{ fontWeight: 600, fontSize: "14px" }}>{away?.name}</span>
                    </div>
                    <span style={{ fontWeight: "bold", fontSize: "14px", color: "var(--text-muted)" }}>
                      {m.status === "finished" ? m.awayScore : "-"}
                    </span>
                  </div>
                  <div style={{ marginTop: "10px", textAlign: "right", fontSize: "11px", color: "var(--text-muted)" }}>
                    {m.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Knockout Bracket Preview */}
        <div className="preview-container" style={{ marginBottom: "50px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", borderBottom: "2px solid var(--accent)", paddingBottom: "4px" }}>
              🏆 Knockout Bracket Preview
            </h3>
            <button className="btn btn-secondary" style={{ padding: "6px 16px", fontSize: "14px" }} onClick={() => setActiveTab("bracket")}>
              View Full Bracket →
            </button>
          </div>

          <div className="glass" style={{
            padding: "30px",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            textAlign: "center",
            background: "rgba(8, 20, 45, 0.03)"
          }}>
            {/* Horizontal Mini Bracket Map */}
            <div style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "20px",
              maxWidth: "800px",
              margin: "0 auto"
            }}>
              <div style={{ padding: "10px 16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontWeight: "bold" }}>
                R16
              </div>
              <div style={{ color: "var(--accent)", fontSize: "20px" }}>➔</div>
              <div style={{ padding: "10px 16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontWeight: "bold" }}>
                Quarter Final
              </div>
              <div style={{ color: "var(--accent)", fontSize: "20px" }}>➔</div>
              <div style={{ padding: "10px 16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontWeight: "bold" }}>
                Semi Final
              </div>
              <div style={{ color: "var(--accent)", fontSize: "20px" }}>➔</div>
              <div style={{ padding: "10px 16px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "8px", fontWeight: "bold" }}>
                Final
              </div>
              <div style={{ color: "var(--accent)", fontSize: "20px" }}>➔</div>
              <div style={{ padding: "12px 20px", background: "var(--accent)", color: "#08142D", borderRadius: "8px", fontWeight: "800", fontSize: "18px" }}>
                🏆 Champion
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Rules / Formats Section */}
        <div className="glass" style={{
          padding: "32px",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          textAlign: "left",
          background: "linear-gradient(135deg, #08142D 0%, #172554 100%)",
          color: "white"
        }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "24px", color: "var(--accent)", marginBottom: "16px" }}>
            📋 Tournament Format Rules
          </h3>
          <ul style={{
            listStyle: "none",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "16px",
            marginBottom: "24px"
          }}>
            <li style={{ display: "flex", gap: "10px", fontSize: "15px" }}>
              <span style={{ color: "var(--accent)" }}>⚽</span>
              <span>48 teams compete across 12 groups (A-L).</span>
            </li>
            <li style={{ display: "flex", gap: "10px", fontSize: "15px" }}>
              <span style={{ color: "var(--accent)" }}>🛡️</span>
              <span>Top 2 teams qualify automatically.</span>
            </li>
            <li style={{ display: "flex", gap: "10px", fontSize: "15px" }}>
              <span style={{ color: "var(--accent)" }}>🌟</span>
              <span>Best 8 third-place teams advance to playoffs.</span>
            </li>
            <li style={{ display: "flex", gap: "10px", fontSize: "15px" }}>
              <span style={{ color: "var(--accent)" }}>⚡</span>
              <span>Knockout stage begins with Round of 32.</span>
            </li>
          </ul>
          <button className="btn btn-primary" onClick={() => setActiveTab("panduan")}>
            Learn More
          </button>
        </div>

      </section>
    </div>
  );
}

export default Home;
