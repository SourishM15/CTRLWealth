import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
        
        <footer className="bg-gray-800 text-white p-4 mt-10">
          <div className="container mx-auto">
            <p className="text-center text-sm">
              &copy; 2025 Inequality Forecast Dashboard | Data is simulated for demonstration purposes
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}