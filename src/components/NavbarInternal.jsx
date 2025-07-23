import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { Sun, Moon, PersonCircle } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';


function NavbarInternal({ darkMode, toggleDarkMode, onLogout }) {
  return (
    <Navbar expand="lg" className={`app-navbar ${darkMode ? 'dark-mode' : ''}`}>
      <Container>
        <Navbar.Brand as={Link} to="/dashboard" className="navbar-brand">
          MiTienda
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/info" className="nav-link">
              Info
            </Nav.Link>
            <Nav.Link as={Link} to="/gestion" className="nav-link">
              Gestión
            </Nav.Link>
          </Nav>
          <div className="d-flex align-items-center gap-3">
            <Button 
              variant="outline-secondary" 
              onClick={toggleDarkMode}
              className="mode-toggle"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>
            <Dropdown>
              <Dropdown.Toggle variant="link" className="user-toggle">
                <PersonCircle size={24} />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/profile">Perfil</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={onLogout}>Cerrar Sesión</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarInternal;