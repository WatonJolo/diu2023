import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './App.css';

const HomePage = () => {

  return (
    <div className="container">
      <header className="navbar">
        <a className="navbar-brand"href='/'>Chocobito</a>
        <label htmlFor="menu-toggle" className="navbar-toggler">
          <span className="navbar-toggler-icon"></span>
        </label>
        <nav className="navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <label htmlFor="evaluacionDropdown" className="nav-link dropdown-label">
                EVALUACION
              </label>
              <ul className="dropdown-menu">
                <li className="dropdown-item">
                  <Link to="/Satisfaccion">Satisfacción</Link>
                </li>
                <li className="dropdown-item">
                  <Link to="/Resumen">Resumen</Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
      </div>
  );
};

export default HomePage;