import React from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
import VotingBooth from './pages/VotingBooth';
import Header from './components/Header';
import Ticker from './components/Ticker';
import { MOCK_VOTER_CODES } from './data/mockData';

function App() {
  const [currentVoterCode, setCurrentVoterCode] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (code) => {
    if (MOCK_VOTER_CODES.includes(code)) {
      const hasVoted = localStorage.getItem(`voted_${code}`);
      if (hasVoted) {
        alert('This Voter Code has already been used. Each code may only vote once.');
      } else {
        setCurrentVoterCode(code);
        navigate('/vote');
      }
    } else if (code === 'ADMIN-123') {
      navigate('/');
    } else {
      alert('Invalid Voter Code. Please check your code and try again.');
    }
  };

  const handleLogout = () => {
    setCurrentVoterCode(null);
    navigate('/');
  };

  return (
    <>
      <Header currentVoterCode={currentVoterCode} onLogout={handleLogout} />
      <main>
        <Routes>
          <Route path="/"       element={<HomePage />} />
          <Route path="/login"  element={<LandingPage onLogin={handleLogin} />} />
          <Route
            path="/vote"
            element={
              currentVoterCode
                ? <VotingBooth voterCode={currentVoterCode} onComplete={handleLogout} />
                : <Navigate to="/login" replace />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Ticker />
    </>
  );
}

export default App;
