import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'ACCUEIL' },
    { path: '/tutoriels', label: 'TUTORIELS' },
    { path: '/tournois', label: 'TOURNOIS CS2' },
    { path: '/communaute', label: 'COMMUNAUTÉ' },
    { path: '/a-propos', label: 'À PROPOS' }
  ];

  return (
    <header className="header-pro">
      <div className="header-container-pro">
        <Link to="/" className="logo-pro">
          <div className="logo-shield">
            <img 
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 10 L85 25 L85 65 Q85 80 50 90 Q15 80 15 65 L15 25 Z' fill='%23213547'/%3E%3Ctext x='50' y='55' text-anchor='middle' fill='%23ffffff' font-family='Arial Black' font-size='12' font-weight='bold'%3EOUPA%3C/text%3E%3C/svg%3E" 
              alt="Oupafamilly Logo" 
              className="logo-img"
            />
            <span className="logo-text-pro">OUPAFAMILLY</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-desktop-pro">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link-pro ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-text">{item.label}</span>
              <span className="nav-underline"></span>
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn-pro"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-pro ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Mobile Navigation */}
        <nav className={`nav-mobile-pro ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-nav-content">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link-mobile-pro ${isActive(item.path) ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;