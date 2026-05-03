import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';

const LandingPage = ({ onLogin }) => {
  const [voterCode, setVoterCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (voterCode.trim()) {
      onLogin(voterCode.trim());
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      textAlign: 'center'
    }}>
      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', width: '100%' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>
          CATHSOC Executive Election
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
          Welcome to the official online voting portal. Please enter your unique Voter Code to access the voting booth and cast your ballot.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <KeyRound size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter Voter Code..." 
              value={voterCode}
              onChange={(e) => setVoterCode(e.target.value)}
              style={{ paddingLeft: '48px' }}
              required
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%' }}>
            Access Voting Booth
          </button>
        </form>

        <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <p>Demo Codes: CATH2024-ALPHA, CATH2024-BETA</p>
          <p>Admin Code: ADMIN-123</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
