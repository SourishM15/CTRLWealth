import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
        
        <footer className="bg-gray-800 text-white p-4 mt-10">
          <div className="container mx-auto">
            <p className="text-center text-sm">
              &copy; 2025 Seattle Demographics Dashboard
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;