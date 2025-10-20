import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  // Check which tab is active based on current route
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <div 
            className="nav-brand" 
            onClick={() => handleNavClick("/")}
            style={{ cursor: "pointer" }}
          >
            <div className="logo-text">
              <span className="logo-subtitle">Flight Booking System</span>
            </div>
          </div>

          <ul className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
            <li>
              <button
                className={isActive("/") || isActive("/flights") || isActive("/my-bookings") ? "active" : ""}
                onClick={() => handleNavClick("/my-bookings")}
              >
                <i className="fas fa-suitcase"></i>
                My Bookings
              </button>
            </li>
            <li>
              <button
                className={isActive("/cancel") ? "active" : ""}
                onClick={() => handleNavClick("/cancel")}
              >
                <i className="fas fa-times-circle"></i>
                Cancel Booking
              </button>
            </li>
            {/* ✅ Admin Link */}
            <li>
              <button
                className={isActive("/admin-dashboard") ? "active" : ""}
                onClick={() => handleNavClick("/admin-dashboard")}
              >
                <i className="fas fa-user-shield"></i>
                Admin
              </button>
            </li>
          </ul>

          <button 
            className={`mobile-menu-toggle ${isMobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}
    </>
  );
};

export default Navbar;
