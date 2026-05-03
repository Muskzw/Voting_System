import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Vote, LogOut, LayoutDashboard, Home } from 'lucide-react';

const Header = ({ currentVoterCode, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 2rem', height: '64px',
      background: 'rgba(5,10,26,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      {/* Logo */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        <div style={{
          width: 36, height: 36, borderRadius: '8px',
          background: 'linear-gradient(135deg, #1a6cf5, #00d4ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 20px rgba(26,108,245,0.5)'
        }}>
          <Vote size={20} color="white" />
        </div>
        <div>
          <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.25rem', letterSpacing: '0.05em', lineHeight: 1 }}>
            CATHSOC
          </div>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: 1 }}>
            Executive Election 2024
          </div>
        </div>
      </div>

      {/* Nav + Auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          className="btn-ghost"
          onClick={() => navigate('/')}
          style={{
            padding: '8px 16px', fontSize: '0.82rem',
            borderColor: location.pathname === '/' ? 'var(--accent-blue)' : undefined,
            color: location.pathname === '/' ? 'white' : undefined
          }}
        >
          <Home size={15} /> Live Results
        </button>

        {currentVoterCode ? (
          <>
            <div style={{
              padding: '6px 14px', borderRadius: '6px',
              background: 'rgba(26,108,245,0.1)', border: '1px solid rgba(26,108,245,0.25)',
              fontSize: '0.8rem', color: 'var(--text-secondary)'
            }}>
              Voter: <strong style={{ color: 'white', fontFamily: 'monospace' }}>{currentVoterCode}</strong>
            </div>
            <button className="btn-ghost" onClick={onLogout} style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
              <LogOut size={15} /> Exit
            </button>
          </>
        ) : (
          <button
            className="btn-primary"
            onClick={() => navigate('/login')}
            style={{ padding: '9px 20px', fontSize: '0.85rem' }}
          >
            Cast Your Vote
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
