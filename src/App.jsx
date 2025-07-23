import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavbarExternal from './pages/NavbarExternal';
import NavbarInternal from './components/NavbarInternal';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Lista from './components/Lista';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  return (
    <Router>
      {isAuthenticated ? (
        <NavbarInternal 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
          onLogout={() => setIsAuthenticated(false)} 
        />
      ) : (
        <NavbarExternal 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode} 
        />
      )}
      
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Login onLogin={() => setIsAuthenticated(true)} />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
              <Navigate to="/dashboard" /> : 
              <Register onRegister={() => setIsAuthenticated(true)} />
          } 
        />

        {/* Rutas protegidas */}
        <Route 
          path="/profile" 
          element={
            isAuthenticated ? 
              <Dashboard onLogout={() => setIsAuthenticated(false)} /> : 
              <Navigate to="/login" />
          } 
        />
        <Route 
          path="/gestion" 
          element={
            isAuthenticated ? 
              <Lista /> : 
              <Navigate to="/login" />
          } 
        />

        {/* Ruta de fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;