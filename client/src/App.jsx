import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Standings from "./pages/Standings";
import Matches from "./pages/Matches";
import Results from "./pages/Results";
import Bracket from "./pages/Bracket";
import Panduan from "./pages/Panduan";
import AdminDashboard from "./admin/AdminDashboard";

import { TEAMS as INITIAL_TEAMS, GROUPS, generateGroupMatches, initialKnockoutMatches, STADIUMS } from "./data/mockData";
import * as api from "./utils/api";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname === "/" ? "home" : location.pathname.substring(1);
  
  const setActiveTab = (tab) => {
    if (tab === "home") navigate("/");
    else navigate(`/${tab}`);
  };

  // Navigation & UI State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      localStorage.setItem("theme", "light");
      return "light";
    }
    return saved || "light";
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(() => !!localStorage.getItem("adminToken"));
  
  // Toasts
  const [toasts, setToasts] = useState([]);

  // Data State (Loaded from LocalStorage or initialized)
  // Data State
  const [teams, setTeams] = useState({});
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Auth state

  // Refresh entire data from backend (Supabase as single source of truth)
  const refreshData = async () => {
    try {
      const teamsData = await api.fetchTeams();
      const teamsMap = {};
      teamsData.forEach((t) => {
        teamsMap[t.code] = t;
      });
      setTeams(teamsMap);

      const matchesData = await api.fetchMatches();
      setMatches(matchesData);
    } catch (err) {
      console.error("Error refreshing data from backend:", err);
      addToast("Failed to sync with Supabase backend.", "error");
    }
  };

  // Fetch initial teams and matches from backend
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      await refreshData();
      setIsLoading(false);
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Redirect to home and trigger login modal if trying to access admin page when not logged in
  useEffect(() => {
    if (location.pathname === "/admin" && !isAdmin) {
      navigate("/");
      setShowLoginModal(true);
    }
  }, [location.pathname, isAdmin, navigate]);

  // Helper: Toast Notifications
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Helper: Toggle Dark Mode
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Triggered by Navbar logo secret trigger or Admin nav click
  const handleSecretTrigger = () => {
    setShowLoginModal(true);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      addToast("Password is required!", "error");
      return;
    }

    try {
      const result = await api.login("admin", password);
      if (result.success) {
        setIsAdmin(true);
        localStorage.setItem("adminToken", result.data.token);
        setShowLoginModal(false);
        setPassword("");
        addToast("Successfully logged in as admin!");
        setActiveTab("admin");
      }
    } catch (err) {
      addToast(err.message || "Invalid password!", "error");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("adminToken");
    addToast("Admin session ended.");
    setActiveTab("home");
  };

  // --- STANDINGS LOGIC ---
  const getGroupStandings = (groupChar) => {
    const groupTeams = Object.values(teams).filter((t) => t.group === groupChar);
    
    // Initialize stats
    const standings = groupTeams.reduce((acc, team) => {
      acc[team.code] = {
        ...team,
        P: 0, W: 0, D: 0, L: 0, GF: 0, GA: 0, GD: 0, Pts: 0
      };
      return acc;
    }, {});

    // Filter group matches
    const groupMatches = matches.filter(
      (m) => m.type === "group" && m.group === groupChar && m.status === "finished"
    );

    // Calculate stats
    groupMatches.forEach((m) => {
      const home = standings[m.homeTeam];
      const away = standings[m.awayTeam];

      if (home && away) {
        home.P += 1;
        away.P += 1;
        home.GF += m.homeScore;
        home.GA += m.awayScore;
        away.GF += m.awayScore;
        away.GA += m.homeScore;

        if (m.homeScore > m.awayScore) {
          home.W += 1;
          home.Pts += 3;
          away.L += 1;
        } else if (m.awayScore > m.homeScore) {
          away.W += 1;
          away.Pts += 3;
          home.L += 1;
        } else {
          home.D += 1;
          away.D += 1;
          home.Pts += 1;
          away.Pts += 1;
        }
      }
    });

    // Update Goal Difference
    Object.values(standings).forEach((team) => {
      team.GD = team.GF - team.GA;
    });

    // Sort by Points -> GD -> GF -> Alphabetical
    return Object.values(standings).sort((a, b) => {
      if (b.Pts !== a.Pts) return b.Pts - a.Pts;
      if (b.GD !== a.GD) return b.GD - a.GD;
      if (b.GF !== a.GF) return b.GF - a.GF;
      return a.name.localeCompare(b.name);
    });
  };

  // Best 3rd Place Teams ranking logic
  const getBestThirdPlaceTeams = (allGroupStandings) => {
    const thirdPlaceTeams = [];
    Object.keys(allGroupStandings).forEach((groupChar) => {
      const standings = allGroupStandings[groupChar];
      if (standings[2]) {
        thirdPlaceTeams.push({
          ...standings[2],
          group: groupChar
        });
      }
    });
    
    // Sort third place teams by points, GD, GF, name
    return thirdPlaceTeams.sort((a, b) => {
      if (b.Pts !== a.Pts) return b.Pts - a.Pts;
      if (b.GD !== a.GD) return b.GD - a.GD;
      if (b.GF !== a.GF) return b.GF - a.GF;
      return a.name.localeCompare(b.name);
    }).slice(0, 8); // Top 8 advance
  };

  // --- TOURNAMENT CONTROLS ---
  const handleResetTournament = async () => {
    if (window.confirm("Are you sure you want to reset all tournament data? All scores and knockout stages will be cleared.")) {
      try {
        await api.resetTournament();
        await refreshData();
        addToast("Tournament reset successfully!");
      } catch (err) {
        console.error(err);
        addToast("Failed to reset tournament on backend.", "error");
      }
    }
  };

  const handleSimulateGroupStage = async () => {
    try {
      await api.simulateGroupStage();
      await refreshData();
      addToast("All remaining group stage matches simulated!");
    } catch (err) {
      console.error(err);
      addToast("Failed to simulate group stage on backend.", "error");
    }
  };

  const handleAdvanceToKnockout = async () => {
    const groupMatches = matches.filter((m) => m.type === "group");
    const unplayed = groupMatches.filter((m) => m.status !== "finished");

    if (unplayed.length > 0) {
      if (!window.confirm(`There are still ${unplayed.length} unplayed group matches. Do you want to advance anyway?`)) {
        return;
      }
    }

    try {
      await api.advanceToKnockout();
      await refreshData();
      addToast("Advanced to Knockout Stage! Round of 32 populated.");
      setActiveTab("bracket");
    } catch (err) {
      console.error(err);
      addToast("Failed to advance to knockout stage on backend.", "error");
    }
  };

  return (
    <>
      {/* Toast Notification HUD */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type} fade-in`}>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Admin Secret Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay" style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div className="modal-card fade-in" style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            width: "90%",
            maxWidth: "400px",
            padding: "32px",
            position: "relative",
            color: "#0f172a"
          }}>
            <button className="modal-close" onClick={() => {
              setShowLoginModal(false);
              setPassword("");
            }} style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "transparent",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold"
            }}>✕</button>
            <h3 className="modal-title" style={{
              fontFamily: "var(--font-heading)",
              fontSize: "24px",
              fontWeight: "700",
              marginBottom: "8px",
              textAlign: "center",
              color: "#0f172a"
            }}>Login Admin</h3>
            <p className="modal-subtitle" style={{
              color: "#64748b",
              fontSize: "14px",
              marginBottom: "24px",
              textAlign: "center",
              lineHeight: "1.5"
            }}>
              Enter administrator password to access simulation control dashboard.
            </p>
            
            <form onSubmit={handleAuth}>
              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label className="form-label" htmlFor="popup-pw" style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  marginBottom: "8px",
                  color: "#334155"
                }}>Password</label>
                <input
                  type="password"
                  id="popup-pw"
                  className="form-input"
                  placeholder="Password (hint: admin123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    border: "1px solid #cbd5e1",
                    backgroundColor: "#f8fafc",
                    color: "#0f172a",
                    borderRadius: "8px",
                    fontSize: "14px",
                    outline: "none"
                  }}
                  autoFocus
                  required
                />
              </div>
              <button type="submit" className="form-btn" style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                fontSize: "15px",
                fontWeight: "600",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}>
                Unlock Admin
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sticky Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSecretTrigger={handleSecretTrigger}
        isAdmin={isAdmin}
      />

      {/* Main Pages Switcher */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home setActiveTab={setActiveTab} getGroupStandings={getGroupStandings} matches={matches} TEAMS={teams} />} />
          <Route path="/standings" element={<Standings GROUPS={GROUPS} getGroupStandings={getGroupStandings} getBestThirdPlaceTeams={getBestThirdPlaceTeams} />} />
          <Route path="/matches" element={<Matches GROUPS={GROUPS} matches={matches} setMatches={setMatches} TEAMS={teams} isAdmin={isAdmin} addToast={addToast} refreshData={refreshData} />} />
          <Route path="/results" element={<Results matches={matches} TEAMS={teams} />} />
          <Route path="/bracket" element={<Bracket matches={matches} TEAMS={teams} />} />
          <Route path="/panduan" element={<Panduan />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard matches={matches} setMatches={setMatches} TEAMS={teams} setTeams={setTeams} GROUPS={GROUPS} STADIUMS={STADIUMS} handleResetTournament={handleResetTournament} handleSimulateGroupStage={handleSimulateGroupStage} handleAdvanceToKnockout={handleAdvanceToKnockout} addToast={addToast} onLogout={handleLogout} refreshData={refreshData} /> : <div style={{padding: "50px", textAlign: "center"}}>Please login to access Admin.</div>} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </>
  );
}

export default App;
