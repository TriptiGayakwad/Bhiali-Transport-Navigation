import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          🚌 Bhilai Transport
        </div>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/bus-routes">Bus Routes</Link>
          <Link to="/emergency">Emergency</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;