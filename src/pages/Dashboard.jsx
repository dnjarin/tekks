import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Panel de Control</h1>
      <Row className="g-4">
        {[
          { 
            title: "Gestión de Productos", 
            description: "Administra tu inventario de productos",
            link: "/gestion"
          },
          { 
            title: "Estadísticas", 
            description: "Visualiza tus métricas y ventas",
            link: "/stats"
          }
        ].map((item, index) => (
          <Col md={4} key={index}>
            <Card as={Link} to={item.link} className="text-center h-100 shadow-sm mb-4">
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text className="text-muted">
                  {item.description}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="text-center mt-5">
        <Button 
          variant="outline-danger" 
          onClick={handleLogout}
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}

export default Dashboard;