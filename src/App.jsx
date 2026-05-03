import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import VotingBooth from './pages/VotingBooth';
import AdminDashboard from './pages/AdminDashboard';
import Header from './components/Header';
import { MOCK_VOTER_CODES } from './data/mockData';

function App() {
  const [currentVoterCode, setCurrentVoterCode] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (code) => {
    if (MOCK_VOTER_CODES.includes(code)) {
      const hasVoted = localStorage.getItem(`voted_${code}`);
      if (hasVoted) {
        alert('This Voter Code has already been used to cast a vote.');
      } else {
        setCurrentVoterCode(code);
        navigate('/vote');
      }
    } else if (code === 'ADMIN-123') {
      navigate('/admin');
    } else {
      alert('Invalid Voter Code. Please try again.');
    }
  };

  const handleLogout = () => {
    setCurrentVoterCode(null);
    navigate('/');
  };

  return (
    <div className="app-container">
      <Header currentVoterCode={currentVoterCode} onLogout={handleLogout} />
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<LandingPage onLogin={handleLogin} />} />
          <Route 
            path="/vote" 
            element={
              currentVoterCode ? 
              <VotingBooth voterCode={currentVoterCode} onComplete={handleLogout} /> : 
              <Navigate to="/" />
            } 
          />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
