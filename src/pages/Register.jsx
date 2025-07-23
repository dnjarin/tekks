import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
import { invoke } from '@tauri-apps/api/core';

function Register({ onRegister }) {
  const [formData, setFormData] = useState({
    usuario: '',  
    correo: '',   
    contrasena: '',
    confirmPassword: ''
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
    
    if (formData.contrasena !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }

    setLoading(true);
    setError('');

    try {
      const user = await invoke('register_user', {
        usuario: formData.usuario,
        correo: formData.correo,
        contrasena: formData.contrasena
      });
      
      onRegister(user);
      navigate('/gestion');
    } catch (err) {
      console.error('Error de registro:', err);
      setError(err.includes('Error') ? err : 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '500px' }}>
      <h1 className="text-center mb-4">Crear Cuenta</h1>
      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de Usuario</Form.Label>
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
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
                placeholder="tu@email.com"
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
                minLength={6}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
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
              className="w-100"
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
                  Registrando...
                </>
              ) : 'Registrarse'}
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default Register;