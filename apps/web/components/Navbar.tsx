import React, { useState } from 'react';

type NavbarProps = {
  currentPath?: string;
};

export default function Navbar({ currentPath }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <a href="/" className="brand">
            <div className="brand-crest">
              <img src="/images/logo-crest.jpg" alt="Blason Officiel IUM-MORAVE" className="crest-img" />
            </div>
            <div className="brand-text">
              <span className="brand-full">Institut Universitaire Morave</span>
              <span className="brand-short">IUM‑MORAVE</span>
            </div>
          </a>

          <button 
            className={`menu-toggle ${menuOpen ? 'active' : ''}`} 
            aria-label="Ouvrir le menu" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span /><span /><span />
          </button>

          <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <a href="/" className={currentPath === '/' ? 'active' : ''}>Accueil</a>
            <a href="/formations" className={currentPath === '/formations' ? 'active' : ''}>Formations</a>
            <a href="/admissions" className={currentPath === '/admissions' ? 'active' : ''}>Admissions</a>
            <a href="/diplomes-reussite" className={currentPath === '/diplomes-reussite' ? 'active' : ''}>Diplômes</a>
            <a href="/gouvernance" className={currentPath === '/gouvernance' ? 'active' : ''}>Gouvernance</a>
            <a href="/campus-vie" className={currentPath === '/campus-vie' ? 'active' : ''}>Campus</a>
            <a href="/partenaires" className={currentPath === '/partenaires' ? 'active' : ''}>Partenaires</a>
            <a href="/actualites-recherche" className={currentPath === '/actualites-recherche' ? 'active' : ''}>Recherche</a>
            <a href="/contact" className={currentPath === '/contact' ? 'active' : ''}>Contact</a>
            <a href="/espace" className="nav-cta">Espace Numérique →</a>
          </nav>
        </div>
      </header>

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #071e38;
          border-bottom: 1px solid rgba(245, 185, 20, 0.25);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }
        .navbar-inner {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0.85rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          text-decoration: none;
          flex-shrink: 0;
        }
        .brand-crest {
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #f5b914;
          box-shadow: 0 0 12px rgba(245, 185, 20, 0.3);
          flex-shrink: 0;
          background: #fff;
        }
        .crest-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .brand-text {
          display: flex;
          flex-direction: column;
        }
        .brand-full {
          color: #fff;
          font-weight: 800;
          font-size: 1rem;
          line-height: 1.2;
        }
        .brand-short {
          color: #f5b914;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          flex-wrap: nowrap;
        }
        .nav-links a {
          color: rgba(255, 255, 255, 0.82);
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 600;
          transition: all 0.2s ease;
          position: relative;
          padding: 0.25rem 0;
        }
        .nav-links a:hover, .nav-links a.active {
          color: #f5b914;
        }
        .nav-links a.active::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 2px;
          background: #f5b914;
          border-radius: 2px;
        }
        .nav-cta {
          background: #f5b914 !important;
          color: #071e38 !important;
          font-weight: 800 !important;
          padding: 0.5rem 1.1rem !important;
          border-radius: 0.5rem;
          font-size: 0.84rem !important;
          box-shadow: 0 4px 14px rgba(245, 185, 20, 0.3);
          transition: transform 0.15s, box-shadow 0.15s !important;
          white-space: nowrap;
        }
        .nav-cta:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(245, 185, 20, 0.45) !important;
        }
        .nav-cta::after {
          display: none !important;
        }
        .menu-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
        }
        .menu-toggle span {
          display: block;
          width: 24px;
          height: 2.5px;
          background: #fff;
          border-radius: 2px;
          transition: all 0.2s ease;
        }
        @media (max-width: 1024px) {
          .nav-links {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #071e38;
            flex-direction: column;
            padding: 1.5rem;
            border-bottom: 1px solid rgba(245, 185, 20, 0.3);
            gap: 1.2rem;
            align-items: flex-start;
          }
          .nav-links.open {
            display: flex;
          }
          .menu-toggle {
            display: flex;
          }
          .brand-full {
            font-size: 0.9rem;
          }
        }
        @media (max-width: 600px) {
          .brand-full {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
