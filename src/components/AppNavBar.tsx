import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AppNavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Anti-Social-Net
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        
        <Navbar.Collapse id="responsive-navbar-nav">
          {/* Enlaces principales a la izquierda */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>
            {user && (
              <Nav.Link as={Link} to="/create-post">
                Crear Post
              </Nav.Link>
            )}
          </Nav>

          {/* Opciones de cuenta a la derecha */}
          <Nav className="align-items-lg-center gap-2">
            {user ? (
              <>
                <Nav.Link as={Link} to="/profile">
                  Perfil ({user.nickName})
                </Nav.Link>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Iniciar sesión
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Registrarse
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavBar;