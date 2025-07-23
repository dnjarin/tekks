import './nav.css';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavbarExternal({ darkMode, toggleDarkMode }) {
  return (
    <Navbar expand="lg" className={`app-navbar${darkMode ? ' dark-mode' : ''}`}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand" style={{ color: 'var(--primary-color)' }}>
          MiTienda
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="nav-link">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/login" className="nav-link">
              Login
            </Nav.Link>
            <Nav.Link as={Link} to="/register" className="nav-link">
              Registro
            </Nav.Link>
          </Nav>
          <div className="d-flex align-items-center">
            <Button
              variant="outline-secondary"
              onClick={toggleDarkMode}
              className="mode-toggle"
              style={{
                color: darkMode ? '#4a9fe0' : 'var(--primary-color)',
                backgroundColor: darkMode ? 'rgba(74, 159, 224, 0.1)' : 'rgba(74, 111, 165, 0.1)'
              }}
            >
              {darkMode ? '☀️' : '🌙'}
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarExternal;