import React from "react";

function Footer({ setActiveTab }) {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
          </svg>
          <span>FIFA World Cup 2026 Simulator</span>
        </div>
        <div className="footer-links">
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setActiveTab("home"); }}>Home</a>
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setActiveTab("standings"); }}>Standings</a>
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setActiveTab("matches"); }}>Matches</a>
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setActiveTab("results"); }}>Results</a>
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setActiveTab("bracket"); }}>Bracket</a>
          <a href="#" className="footer-link" onClick={(e) => { e.preventDefault(); setActiveTab("panduan"); }}>Panduan</a>
        </div>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: "4px 0" }}>
          Built for educational purposes. All tournament models are simulated.
        </p>
        <p className="footer-copyright">
          © 2026 FIFA World Cup Simulator. Designed under official specs.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
