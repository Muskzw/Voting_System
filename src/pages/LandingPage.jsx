import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowRight, ShieldCheck, Lock, CheckCircle2, BarChart2 } from 'lucide-react';

const LandingPage = ({ onLogin }) => {
  const [voterCode, setVoterCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (voterCode.trim()) onLogin(voterCode.trim());
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: 'calc(100vh - 64px)', padding: '2rem',
    }}>
      {/* Left column – branding */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        gap: '4rem', maxWidth: '900px', width: '100%', alignItems: 'center'
      }} className="login-grid">

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="live-badge" style={{ width: 'fit-content' }}>
            <span className="dot" /> Voting Open
          </div>

          <h1 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            letterSpacing: '0.04em', lineHeight: 1.1,
            background: 'linear-gradient(135deg, #ffffff 40%, #00d4ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Cast Your<br />Official Vote
          </h1>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.93rem' }}>
            Use the unique Voter Code issued to you at registration to securely access the voting booth. Each code can only be used once.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: <Lock size={16} />, text: 'End-to-end secure voting' },
              { icon: <CheckCircle2 size={16} />, text: 'One vote per registered student' },
              { icon: <BarChart2 size={16} />, text: 'Live results on the home page' },
            ].map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--accent-cyan)', display: 'flex' }}>{f.icon}</span> {f.text}
              </div>
            ))}
          </div>

          <button
            className="btn-ghost"
            onClick={() => navigate('/')}
            style={{ width: 'fit-content', fontSize: '0.82rem' }}
          >
            ← Back to Live Results
          </button>
        </div>

        {/* Right column – form */}
        <div className="glass" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
              <ShieldCheck size={18} color="var(--accent-cyan)" />
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>Voter Authentication</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Enter your unique code to enter the secure voting booth
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <KeyRound size={18} style={{
                position: 'absolute', left: '14px', top: '50%',
                transform: 'translateY(-50%)', color: 'var(--text-muted)'
              }} />
              <input
                id="voter-code-input"
                type="text"
                className="input-field"
                placeholder="e.g. CATH2024-ALPHA"
                value={voterCode}
                onChange={e => setVoterCode(e.target.value.toUpperCase())}
                autoComplete="off"
                autoFocus
                required
              />
            </div>

            <button id="submit-voter-code" type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Enter Voting Booth <ArrowRight size={17} />
            </button>
          </form>

          <div style={{
            padding: '0.85rem 1rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-muted)',
            lineHeight: 1.7
          }}>
            <strong style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Demo Codes</strong>
            CATH2024-ALPHA · CATH2024-BETA · CATH2024-GAMMA<br />
            CATH2024-DELTA · CATH2024-EPSILON<br />
            <span style={{ color: 'var(--accent-gold)' }}>Admin: ADMIN-123</span>
          </div>
        </div>
      </div>

      {/* Responsive collapse for mobile */}
      <style>{`
        @media (max-width: 680px) {
          .login-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
