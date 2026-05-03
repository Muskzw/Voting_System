import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Vote } from 'lucide-react';

const Header = ({ currentVoterCode, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="glass-panel" style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem 2rem',
      margin: '1rem 2rem',
      borderRadius: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
        <Vote size={32} color="var(--accent-color)" />
        <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 700 }}>CATHSOC Elections</h1>
      </div>
      
      <div>
        {currentVoterCode ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Voter ID: <strong style={{ color: 'white' }}>{currentVoterCode}</strong>
            </span>
            <button className="btn" onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '8px 16px' }}>
              <LogOut size={18} /> Logout
            </button>
          </div>
        ) : (
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Welcome to the Voting Portal
          </span>
        )}
      </div>
    </header>
  );
};

export default Header;
