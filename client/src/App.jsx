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
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial teams and matches from backend
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
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
        console.error("Error loading data from backend, using fallbacks:", err);
        const savedTeams = localStorage.getItem("wc_teams_48_v2");
        if (savedTeams) setTeams(JSON.parse(savedTeams));
        const savedMatches = localStorage.getItem("wc_matches_48_v2");
        if (savedMatches) {
          setMatches(JSON.parse(savedMatches));
        } else {
          setMatches(generateGroupMatches().concat(initialKnockoutMatches));
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

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

  // Triggered by Navbar logo secret trigger
  const handleSecretTrigger = () => {
    setShowLoginModal(true);
    addToast("Secret Trigger activated! Please log in.", "warning");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await api.login("admin", password);
      if (result.success) {
        setIsAdmin(true);
        localStorage.setItem("adminToken", result.data.token);
        setShowLoginModal(false);
        setPassword("");
        addToast("Successfully logged in as Admin!");
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
        const result = await api.resetTournament();
        setTeams(INITIAL_TEAMS);
        setMatches(result.matches);
        addToast("Tournament reset successfully!");
      } catch (err) {
        console.error(err);
        addToast("Failed to reset tournament on backend.", "error");
      }
    }
  };

  const handleSimulateGroupStage = async () => {
    try {
      const result = await api.simulateGroupStage();
      setMatches(result.matches);
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
      const result = await api.advanceToKnockout();
      setMatches(result.matches);
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
        <div className="modal-overlay">
          <div className="modal-card fade-in">
            <button className="modal-close" onClick={() => setShowLoginModal(false)}>✕</button>
            <h3 className="modal-title">Login Admin</h3>
            <p className="modal-subtitle">Enter administrator password to access simulation control dashboard.</p>
            
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label" htmlFor="popup-pw">Password</label>
                <input
                  type="password"
                  id="popup-pw"
                  className="form-input"
                  placeholder="Password (hint: admin123)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>
              <button type="submit" className="form-btn">Unlock Admin</button>
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
          <Route path="/matches" element={<Matches GROUPS={GROUPS} matches={matches} setMatches={setMatches} TEAMS={teams} isAdmin={isAdmin} addToast={addToast} />} />
          <Route path="/results" element={<Results matches={matches} TEAMS={teams} />} />
          <Route path="/bracket" element={<Bracket matches={matches} TEAMS={teams} />} />
          <Route path="/panduan" element={<Panduan />} />
          <Route path="/admin" element={isAdmin ? <AdminDashboard matches={matches} setMatches={setMatches} TEAMS={teams} setTeams={setTeams} GROUPS={GROUPS} STADIUMS={STADIUMS} handleResetTournament={handleResetTournament} handleSimulateGroupStage={handleSimulateGroupStage} handleAdvanceToKnockout={handleAdvanceToKnockout} addToast={addToast} onLogout={handleLogout} /> : <div style={{padding: "50px", textAlign: "center"}}>Please login to access Admin.</div>} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </>
  );
}

export default App;
