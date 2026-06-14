import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/useStore';
import LoginPage from './pages/LoginPage';
import POSPage from './pages/POSPage';
import KDSPage from './pages/KDSPage';
import DashboardPage from './pages/DashboardPage';

const App = () => {
  const { token } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pos" element={token ? <POSPage /> : <Navigate to="/login" />} />
        <Route path="/kds" element={token ? <KDSPage /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={token ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
