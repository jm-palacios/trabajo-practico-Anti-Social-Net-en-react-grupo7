import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import PostDetail from './pages/PostDetail'
import Profile from './pages/Profile'
import Register from './pages/Register'
import CreatePost from './pages/CreatePost'
import Header from './components/Header'


function App() {
  return (
    <>
      <Header />
      <Routes>
        {/*Rutas publicas*/}
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/posts/:id' element={<PostDetail />} />
        {/*Rutas protegidas*/}
        <Route path='/posts/new' element={<ProtectedRoute><CreatePost /> </ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /> </ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App