import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">AI Study Assistant</Link>
      </div>
      
      <button className="navbar-menu-button" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" className={isActive('/')}>Home</Link>
        <Link to="/summary" className={isActive('/summary')}>Summary</Link>
        <Link to="/quiz" className={isActive('/quiz')}>Quiz</Link>
        <Link to="/notes" className={isActive('/notes')}>Notes</Link>
      </div>
    </nav>
  );
};

export default Navbar; 