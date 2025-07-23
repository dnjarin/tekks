import Card from 'react-bootstrap/Card';

function Home() {
  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Bienvenido</h1>
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <div className="text-center">
            <h2 className="mb-3 text-primary">
              Gestión de Productos
            </h2>
            <p className="lead mb-0 text-secondary">
              Administra tu inventario de productos de manera sencilla y eficiente.<br />
              Gracias por confiar en nuestra aplicación para gestionar tu tienda.
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Home;