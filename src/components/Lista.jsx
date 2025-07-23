import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Button, Card, Badge, Form, Alert, Spinner, Row, Col, Toast } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './lista.css';

function Lista() {
  // Estados
  const [treats, setTreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: 0,
    nombre: '',
    cant: 0,
    precio: 0.0,
    isEditing: false
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Función para manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cant' ? parseInt(value) || 0 : 
              name === 'precio' ? parseFloat(value) || 0.0 : 
              value
    }));
  };

  // Función para obtener productos
  const fetchTreats = async () => {
    try {
      setLoading(true);
      const data = await invoke('fetch_treats');
      setTreats(data);
      setError(null);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos al inicio
  useEffect(() => {
    fetchTreats();
  }, []);

  // Función para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (formData.isEditing) {
        await invoke('update_treat', {
          id: formData.id,
          form: {
            nombre: formData.nombre,
            cant: formData.cant,
            precio: formData.precio
          }
        });
        setToastMessage('Producto actualizado correctamente');
      } else {
        await invoke('add_treat', {
          form: {
            nombre: formData.nombre,
            cant: formData.cant,
            precio: formData.precio
          }
        });
        setToastMessage('Producto agregado correctamente');
      }
      
      setShowToast(true);
      resetForm();
      await fetchTreats();
    } catch (err) {
      console.error('Error:', err);
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      id: 0,
      nombre: '',
      cant: 0,
      precio: 0.0,
      isEditing: false
    });
  };

  // Función para editar producto
  const handleEdit = (treat) => {
    setFormData({
      id: treat.id,
      nombre: treat.nombre,
      cant: treat.cant,
      precio: treat.precio,
      isEditing: true
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para eliminar producto
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        setLoading(true);
        await invoke('delete_treat', { id });
        setToastMessage('Producto eliminado correctamente');
        setShowToast(true);
        await fetchTreats();
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && treats.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Cargando productos...</span>
      </div>
    );
  }

  return (
    <div className="container py-4">
        
      <h1 className="text-center mb-4">Gestión de Productos</h1>
      
      {/* Notificación Toast */}
      <Toast 
        show={showToast} 
        onClose={() => setShowToast(false)} 
        delay={3000} 
        autohide
        className="position-fixed top-0 end-0 m-3"
        bg="success"
      >
        <Toast.Header closeButton>
          <strong className="me-auto">Operación exitosa</strong>
        </Toast.Header>
        <Toast.Body className="text-white">{toastMessage}</Toast.Body>
      </Toast>

      {/* Mostrar error si hay alguno */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      )}
      
      {/* Formulario de producto */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del producto</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    placeholder="Ej: Galletas de chocolate"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    name="cant"
                    value={formData.cant || ''}
                    onChange={handleInputChange}
                    min="0"
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="precio"
                    value={formData.precio || ''}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                    disabled={loading}
                  />
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <div className="d-flex gap-2 w-100">
                  <Button 
                    variant={formData.isEditing ? "warning" : "primary"} 
                    type="submit" 
                    className="flex-grow-1"
                    disabled={loading}
                  >
                    {loading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <>
                        <i className={`bi ${formData.isEditing ? 'bi-arrow-repeat' : 'bi-plus-lg'} me-2`}></i>
                        {formData.isEditing ? 'Actualizar' : 'Agregar'}
                      </>
                    )}
                  </Button>
                  {formData.isEditing && (
                    <Button 
                      variant="outline-secondary" 
                      onClick={resetForm} 
                      disabled={loading}
                    >
                      <i className="bi bi-x-lg"></i>
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Lista de productos */}
      {treats.length === 0 && !loading ? (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle-fill me-2"></i>
          No hay productos registrados. Agrega uno para comenzar.
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {treats.map((treat) => (
            <Col key={treat.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0 text-truncate">{treat.nombre}</Card.Title>
                    <Badge bg={treat.cant > 0 ? "success" : "danger"}>
                      {treat.cant} {treat.cant === 1 ? 'unidad' : 'unidades'}
                    </Badge>
                  </div>
                  <Card.Subtitle className="mb-2 text-muted small">ID: {treat.id}</Card.Subtitle>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="text-primary mb-0">${treat.precio.toFixed(2)}</h4>
                    </div>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleEdit(treat)}
                        className="flex-grow-1"
                        disabled={loading}
                      >
                        <i className="bi bi-pencil me-1"></i> Editar
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(treat.id)}
                        className="flex-grow-1"
                        disabled={loading}
                      >
                        <i className="bi bi-trash me-1"></i> Eliminar
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Lista;