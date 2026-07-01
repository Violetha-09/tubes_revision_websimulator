import React from "react";

function Bracket({ matches, TEAMS }) {
  const activeWinner = matches.find((m) => m.id === "F")?.winner;

  const getWinnerClass = (match, teamCode) => {
    if (match.status !== "finished") return "";
    return match.winner === teamCode ? "winner" : "loser";
  };

  const renderMatchNode = (m) => {
    const homeTeamObj = TEAMS[m.homeTeam];
    const awayTeamObj = TEAMS[m.awayTeam];
    const homeWinnerClass = getWinnerClass(m, m.homeTeam);
    const awayWinnerClass = getWinnerClass(m, m.awayTeam);

    return (
      <div key={m.id} className="bracket-match-node">
        <div className="bracket-node-header">{m.id} • {m.name}</div>
        
        {/* Home Team */}
        <div className={`bracket-node-team ${homeWinnerClass}`}>
          <div className="bracket-node-team-info">
            <span>{homeTeamObj?.flag || "🏳️"}</span>
            <span style={{ fontSize: "12px" }}>{homeTeamObj?.name || m.placeholderHome}</span>
          </div>
          {m.status === "finished" && m.homeTeam && (
            <span className="bracket-node-score">
              {m.homeScore}
              {m.penaltyWinner === m.homeTeam && " (P)"}
            </span>
          )}
        </div>

        {/* Away Team */}
        <div className={`bracket-node-team ${awayWinnerClass}`}>
          <div className="bracket-node-team-info">
            <span>{awayTeamObj?.flag || "🏳️"}</span>
            <span style={{ fontSize: "12px" }}>{awayTeamObj?.name || m.placeholderAway}</span>
          </div>
          {m.status === "finished" && m.awayTeam && (
            <span className="bracket-node-score">
              {m.awayScore}
              {m.penaltyWinner === m.awayTeam && " (P)"}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container fade-in" style={{ paddingTop: "30px", marginBottom: "50px" }}>
      <h2 style={{ fontFamily: "var(--font-heading)", marginBottom: "8px", fontSize: "28px" }}>
        Knockout Stage Bracket
      </h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "30px", fontSize: "15px" }}>
        From Round of 32 to the World Cup Champion. Updates dynamically based on results.
      </p>

      {/* Champion Banner */}
      {activeWinner && (
        <div className="winner-pulse" style={{
          background: "linear-gradient(135deg, #F4C542 0%, #D97706 100%)",
          color: "#08142D",
          borderRadius: "12px",
          padding: "30px",
          textAlign: "center",
          marginBottom: "40px",
          boxShadow: "var(--shadow-lg)"
        }}>
          <h2 style={{ fontSize: "32px", color: "#08142D", fontFamily: "var(--font-heading)" }}>🏆 WORLD CUP CHAMPION 🏆</h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", margin: "16px 0" }}>
            <span style={{ fontSize: "56px" }}>{TEAMS[activeWinner]?.flag}</span>
            <span style={{ fontSize: "40px", fontWeight: "900" }}>{TEAMS[activeWinner]?.name.toUpperCase()}</span>
          </div>
          <p style={{ fontWeight: "700", fontSize: "16px" }}>Congratulations to the Champions of the World Cup 2026!</p>
        </div>
      )}

      {/* Horizontal visual bracket */}
      <div className="bracket-scroll-container">
        <div className="bracket-container" style={{ gap: "30px" }}>
          
          {/* Column 1: Round of 32 */}
          <div className="bracket-column" style={{ width: "240px" }}>
            <div className="bracket-column-header">Round of 32</div>
            {matches.filter((m) => m.round === "R32").map(renderMatchNode)}
          </div>

          {/* Column 2: Round of 16 */}
          <div className="bracket-column" style={{ width: "240px" }}>
            <div className="bracket-column-header">Round of 16</div>
            {matches.filter((m) => m.round === "R16").map(renderMatchNode)}
          </div>

          {/* Column 3: Quarter-finals */}
          <div className="bracket-column" style={{ width: "240px" }}>
            <div className="bracket-column-header">Quarter-finals</div>
            {matches.filter((m) => m.round === "QF").map(renderMatchNode)}
          </div>

          {/* Column 4: Semi-finals */}
          <div className="bracket-column" style={{ width: "240px" }}>
            <div className="bracket-column-header">Semi-finals</div>
            {matches.filter((m) => m.round === "SF").map(renderMatchNode)}
          </div>

          {/* Column 5: Final */}
          <div className="bracket-column" style={{ width: "240px", justifyContent: "center" }}>
            <div className="bracket-column-header">Final</div>
            {matches.filter((m) => m.round === "F").map((m) => (
              <div key={m.id} className="bracket-match-node" style={{ borderColor: "var(--accent)", borderWidth: "2px" }}>
                <div className="bracket-node-header" style={{ backgroundColor: "rgba(244, 197, 66, 0.1)", color: "var(--accent)" }}>
                  World Cup Final
                </div>
                
                <div className={`bracket-node-team ${getWinnerClass(m, m.homeTeam)}`}>
                  <div className="bracket-node-team-info">
                    <span>{TEAMS[m.homeTeam]?.flag || "🏳️"}</span>
                    <span style={{ fontSize: "12px" }}>{TEAMS[m.homeTeam]?.name || m.placeholderHome}</span>
                  </div>
                  {m.status === "finished" && m.homeTeam && (
                    <span className="bracket-node-score">
                      {m.homeScore}
                      {m.penaltyWinner === m.homeTeam && " (P)"}
                    </span>
                  )}
                </div>

                <div className={`bracket-node-team ${getWinnerClass(m, m.awayTeam)}`}>
                  <div className="bracket-node-team-info">
                    <span>{TEAMS[m.awayTeam]?.flag || "🏳️"}</span>
                    <span style={{ fontSize: "12px" }}>{TEAMS[m.awayTeam]?.name || m.placeholderAway}</span>
                  </div>
                  {m.status === "finished" && m.awayTeam && (
                    <span className="bracket-node-score">
                      {m.awayScore}
                      {m.penaltyWinner === m.awayTeam && " (P)"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Column 6: Champion Display */}
          <div className="bracket-column" style={{ width: "220px", justifyContent: "center" }}>
            <div className="bracket-column-header">Champion</div>
            <div className="glass" style={{
              padding: "24px",
              borderRadius: "12px",
              border: "2px solid var(--accent)",
              textAlign: "center",
              background: "rgba(244, 197, 66, 0.05)"
            }}>
              <span style={{ fontSize: "40px", display: "block" }}>
                {activeWinner ? TEAMS[activeWinner]?.flag : "🏆"}
              </span>
              <h4 style={{ fontFamily: "var(--font-heading)", margin: "12px 0 6px 0", fontSize: "15px" }}>
                {activeWinner ? TEAMS[activeWinner]?.name : "TBD"}
              </h4>
              <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                {activeWinner ? "World Cup Champion" : "Awaiting Final Match"}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Bracket;
