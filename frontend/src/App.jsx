
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import SignUpPage from './pages/auth/SignUpPage';
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/auth/HomePage';

function App() {
 
  return (
  <Layout>
  <Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/signup" element={<SignUpPage/>}/>
    <Route path="/login" element={<LoginPage/>}/>
  </Routes>
  </Layout>
  )
}

export default App
