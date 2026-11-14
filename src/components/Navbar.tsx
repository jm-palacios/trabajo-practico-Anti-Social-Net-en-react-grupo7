import React from 'react';
import { Link, NavLink } from 'react-router-dom';

interface NavbarProps {
  currentUser?: {
    nickName: string;
  } | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold text-warning" to="/">
          🌐 UnaHur Anti-Social Net
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active fw-bold text-white' : ''}`
                }
                end
              >
                Inicio
              </NavLink>
            </li>
            {currentUser && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/create-post"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'active fw-bold text-white' : ''}`
                    }
                  >
                    Crear Post
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'active fw-bold text-white' : ''}`
                    }
                  >
                    Mi Perfil
                  </NavLink>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex align-items-center gap-3">
            {currentUser ? (
              <>
                <span className="text-light small">
                  👤 Hola, <strong>{currentUser.nickName}</strong>
                </span>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="btn btn-outline-danger btn-sm"
                  >
                    Cerrar Sesión
                  </button>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn btn-warning btn-sm">
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