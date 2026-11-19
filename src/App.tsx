import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profile from './pages/profile';
import ProtectedRoute from './components/protectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Inicio</h1>}/>
        <Route path="/login" element={<h1>Login</h1>}/>

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
