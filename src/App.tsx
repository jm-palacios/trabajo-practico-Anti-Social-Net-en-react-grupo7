import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import PostDetail from './pages/PostDetail'
import Profile from './pages/Profile'
import Register from './pages/Register'
import CreatePost from './pages/CreatePost'
import Header from './components/Header'
import Footer from './components/Footer'


function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header/>
      <main className="flex-grow-1">
        <Routes>
          {/*Rutas publicas*/}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/post/:id' element={<PostDetail />} />
          {/*Rutas protegidas*/}
          <Route path='/create-post' element={<ProtectedRoute><CreatePost /> </ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><Profile /> </ProtectedRoute>} />
        </Routes>
      </main>
      <Footer/>
    </div>
  )
}

export default App