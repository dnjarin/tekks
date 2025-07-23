import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { invoke } from '@tauri-apps/api/core';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    usuario: '',  
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = await invoke('login_user', {
        data: formData  
      });
      
      onLogin(user);
      navigate('/gestion');
    } catch (err) {
      console.error('Error de login:', err);
      setError(err.includes('Credenciales') ? err : 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '500px' }}>
      <h1 className="text-center mb-4">Iniciar Sesión</h1>
      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                required
                placeholder="Tu nombre de usuario"
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                required
                placeholder="••••••••"
                disabled={loading}
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
              className="w-100 mt-3"
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Verificando...
                </>
              ) : 'Iniciar Sesión'}
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default Login;