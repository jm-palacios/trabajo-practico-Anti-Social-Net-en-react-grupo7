import React from 'react';
import { Link, NavLink } from 'react-router-dom';

interface NavbarProps {
  currentUser?: {
    id: number;
    nickName: string;
  } | null;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          Anti-Social Net
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active fw-bold' : ''}`
                }
              >
                Inicio
              </NavLink>
            </li>
            {currentUser && (
              <li className="nav-item">
                <NavLink
                  to="/create-post"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active fw-bold' : ''}`
                  }
                >
                  Crear Post
                </NavLink>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center gap-2">
            {currentUser ? (
              <>
                <span className="navbar-text text-white me-2">
                  Hola, <strong>{currentUser.nickName}</strong>
                </span>
                <button
                  onClick={onLogout}
                  className="btn btn-outline-danger btn-sm"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm me-2">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;