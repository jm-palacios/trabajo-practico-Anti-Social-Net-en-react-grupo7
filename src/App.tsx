import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PostDetail from './pages/PostDetail';

// Tipado del usuario en sesión
interface User {
  id: number;
  nickName: string;
}
const App: React.FC = () => {
  // Usuario simulado para pruebas (reemplazable por el contexto global de Auth)
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 1,
    nickName: 'Nacho',
  });
  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Barra de navegación superior */}
      <Navbar currentUser={currentUser} onLogout={handleLogout} />
      {/* Contenido dinámico de la página */}
      <main className="flex-grow-1">
        <Routes>
          <Route
            path="/"
            element={
              <div className="container py-5 text-center">
                <h1 className="fw-bold">UnaHur Anti-Social Net</h1>
                <p className="text-muted">
                  Seleccioná una publicación para ver sus detalles y comentarios.
                </p>
              </div>
            }
          />
          {/* Ruta dinámica del Integrante 3 */}
          <Route
            path="/post/:id"
            element={<PostDetail currentUserId={currentUser?.id} />}
          />
          {/* Ruta de respaldo para URLs no encontradas */}
          <Route
            path="*"
            element={
              <div className="container py-5 text-center">
                <h2>404 - Página no encontrada</h2>
              </div>
            }
          />
        </Routes>
      </main>
      {/* Pie de página */}
      <Footer />
    </div>
  );
};

export default App;