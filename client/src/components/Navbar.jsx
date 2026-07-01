import React, { useState } from "react";

function Navbar({ activeTab, setActiveTab, onSecretTrigger }) {
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    if (newCount >= 5) {
      setClickCount(0);
      onSecretTrigger(); // Call the parent secret handler (opens admin login)
    } else {
      setClickCount(newCount);
      // Auto-reset click count after 3 seconds of inactivity
      setTimeout(() => setClickCount(0), 3000);
    }
  };

  return (
    <header className="navbar">
      <div className="container nav-container">
        {/* Click 5 times on '2026' to open Admin Login */}
        <div className="logo-section" onClick={(e) => { e.preventDefault(); setActiveTab("home"); }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
          </svg>
          <div className="logo-text">
            <span>FIFA WORLD CUP</span>
            <span className="logo-year-trigger" onClick={(e) => { e.stopPropagation(); handleLogoClick(); }}> 2026</span>
          </div>
        </div>

        <nav className="nav-links">
          <button className={`nav-btn ${activeTab === "home" ? "active" : ""}`} onClick={() => setActiveTab("home")}>
            Home
          </button>
          <button className={`nav-btn ${activeTab === "standings" ? "active" : ""}`} onClick={() => setActiveTab("standings")}>
            Standings
          </button>
          <button className={`nav-btn ${activeTab === "matches" ? "active" : ""}`} onClick={() => setActiveTab("matches")}>
            Matches
          </button>
          <button className={`nav-btn ${activeTab === "results" ? "active" : ""}`} onClick={() => setActiveTab("results")}>
            Results
          </button>
          <button className={`nav-btn ${activeTab === "bracket" ? "active" : ""}`} onClick={() => setActiveTab("bracket")}>
            Bracket
          </button>
          <button className={`nav-btn ${activeTab === "panduan" ? "active" : ""}`} onClick={() => setActiveTab("panduan")}>
            Panduan
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
