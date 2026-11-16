
import { useState, type FormEvent } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [nickName, setNickName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nickName.trim() || !email.trim()) {
      setError('Por favor completá todos los campos.');
      return;
    }

    try {
      setLoading(true);
      // Ajustá el puerto (ej. 3000 o 3001) según cómo esté configurado el backend del TP
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickName: nickName.trim(),
          email: email.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'No se pudo registrar el usuario (puede que el nickName o email ya existan).');
      }

      const createdUser = await response.json();
      
      // Guardamos el usuario en AuthContext (y localStorage) y redirigimos a Home
      login(createdUser);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '450px' }}>
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4">Crear cuenta</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="registerNickName">
              <Form.Label>Nombre de usuario (NickName)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: juan_perez"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="registerEmail">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small>
              ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión acá</Link>
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Register