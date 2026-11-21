import { useState, type FormEvent } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ApiUser {
  id: number;
  nickName: string;
  email: string;
}

function Login() {
  const [nickName, setNickName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nickName.trim() || !password.trim()) {
      setError('Por favor completá tu nickName y contraseña.');
      return;
    }

    // 1. Validación local de la contraseña fija según el enunciado
    if (password !== '123456') {
      setError('Contraseña incorrecta.');
      return;
    }

    try {
      setLoading(true);
      // 2. Consulta GET /users para verificar si el usuario existe en la API
      const response = await fetch('http://localhost:3001/users');

      if (!response.ok) {
        throw new Error('Error al consultar los usuarios en el servidor.');
      }

      const users: ApiUser[] = await response.json();

      // Buscamos coincidencia por nickName (ignorando espacios extra)
      const foundUser = users.find(
        (u) => u.nickName.toLowerCase() === nickName.trim().toLowerCase()
      );

      if (!foundUser) {
        setError('No existe ningún usuario registrado con ese nickName.');
        return;
      }

      // 3. Guardamos en AuthContext + localStorage y redirigimos a Home
      login(foundUser);
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
          <h2 className="text-center mb-4">Iniciar sesión</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="loginNickName">
              <Form.Label>NickName</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingresá tu nickName"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="loginPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresá tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </Form>

          <div className="text-center mt-3">
            <small>
              ¿Todavía no tenés cuenta? <Link to="/register">Registrate acá</Link>
            </small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login