import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_CANDIDATES } from '../data/mockData';
import { CheckCircle2, ChevronRight, ChevronLeft, Send } from 'lucide-react';

const ROLE_META = {
  president:         { label: 'President',         icon: '👑', color: '#f5c842' },
  vice_president:    { label: 'Vice President',    icon: '🤝', color: '#1a6cf5' },
  general_secretary: { label: 'General Secretary', icon: '📋', color: '#9b59f5' },
  treasurer:         { label: 'Treasurer',         icon: '💰', color: '#00e676' },
};

const ROLES = Object.keys(ROLE_META);

const AVATAR_COLORS = [
  ['#1a6cf5','#00d4ff'], ['#9b59f5','#e040fb'],
  ['#f5c842','#ff9800'], ['#00e676','#00bcd4'],
];

const getInitials = (name) =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

/* ─── Candidate Card ─── */
const CandidateCard = ({ candidate, isSelected, onSelect, colorPair }) => {
  const [gradA, gradB] = colorPair;
  return (
    <div
      className={`candidate-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(candidate.id)}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect(candidate.id)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div className="avatar" style={{
          background: `linear-gradient(135deg, ${gradA}, ${gradB})`,
          boxShadow: isSelected ? `0 0 16px ${gradA}66` : 'none'
        }}>
          {getInitials(candidate.name)}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{
            fontWeight: 700, fontSize: '0.95rem',
            color: isSelected ? 'white' : 'var(--text-secondary)',
            transition: 'color 0.2s'
          }}>
            {candidate.name}
          </div>
          <div style={{ fontSize: '0.78rem', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)', marginTop: '2px' }}>
            {candidate.course}
          </div>
          <div style={{
            fontSize: '0.82rem', color: 'var(--text-secondary)',
            marginTop: '8px', lineHeight: 1.5, fontStyle: 'italic'
          }}>
            "{candidate.bio}"
          </div>
        </div>

        {/* Radio indicator */}
        <div style={{
          width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 2,
          border: `2px solid ${isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'border-color 0.2s'
        }}>
          {isSelected && (
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: 'var(--accent-cyan)',
              animation: 'count-up 0.2s ease'
            }} />
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Voting Booth ─── */
const VotingBooth = ({ voterCode, onComplete }) => {
  const [step, setStep] = useState(0);
  const [votes, setVotes] = useState(
    Object.fromEntries(ROLES.map(r => [r, null]))
  );
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const currentRole = ROLES[step];
  const meta = ROLE_META[currentRole];
  const candidates = MOCK_CANDIDATES[currentRole];

  const handleSelect = (id) =>
    setVotes(prev => ({ ...prev, [currentRole]: id }));

  const handleSubmit = () => {
    if (!ROLES.every(r => votes[r])) {
      alert('Please vote for all positions.');
      return;
    }
    const existing = JSON.parse(localStorage.getItem('cathsoc_votes') || '{}');
    ROLES.forEach(role => {
      const id = votes[role];
      existing[role] = existing[role] || {};
      existing[role][id] = (existing[role][id] || 0) + 1;
    });
    localStorage.setItem('cathsoc_votes', JSON.stringify(existing));
    localStorage.setItem(`voted_${voterCode}`, 'true');
    setSubmitted(true);
  };

  /* ─── Success Screen ─── */
  if (submitted) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)', padding: '2rem'
      }}>
        <div className="glass" style={{
          maxWidth: 480, width: '100%', padding: '3rem',
          textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem'
        }}>
          <div style={{ fontSize: '4rem' }}>🎉</div>
          <CheckCircle2 size={56} color="var(--accent-green)" style={{ margin: '0 auto' }} />
          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem',
            letterSpacing: '0.05em', color: 'var(--accent-green)'
          }}>
            Vote Submitted!
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.93rem' }}>
            Your votes have been securely recorded. Thank you for participating in the CATHSOC Executive Election 2024!
          </p>
          <button className="btn-primary" onClick={() => navigate('/')} style={{ justifyContent: 'center' }}>
            View Live Results
          </button>
        </div>
      </div>
    );
  }

  /* ─── Voting Interface ─── */
  return (
    <div style={{
      maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem',
      display: 'flex', flexDirection: 'column', gap: '1.25rem'
    }}>

      {/* ── Stepper ── */}
      <div className="glass" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
          {ROLES.map((role, i) => {
            const done = i < step;
            const active = i === step;
            const m = ROLE_META[role];
            return (
              <React.Fragment key={role}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flex: 1 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: done ? '1rem' : '0.85rem', fontWeight: 700,
                    background: done
                      ? 'var(--accent-green)'
                      : active
                        ? `linear-gradient(135deg, #1a6cf5, #00d4ff)`
                        : 'rgba(255,255,255,0.06)',
                    border: active ? 'none' : done ? 'none' : '1px solid var(--border-dim)',
                    boxShadow: active ? '0 0 18px rgba(26,108,245,0.5)' : 'none',
                    transition: 'all 0.3s',
                    color: done || active ? 'white' : 'var(--text-muted)',
                  }}>
                    {done ? '✓' : m.icon}
                  </div>
                  <span style={{
                    fontSize: '0.65rem', textAlign: 'center',
                    color: active ? 'white' : done ? 'var(--accent-green)' : 'var(--text-muted)',
                    fontWeight: active ? 600 : 400
                  }}>
                    {m.label}
                  </span>
                </div>
                {i < ROLES.length - 1 && (
                  <div style={{
                    flex: 1, height: '2px', marginBottom: '22px',
                    background: done
                      ? 'var(--accent-green)'
                      : 'rgba(255,255,255,0.06)',
                    transition: 'background 0.5s'
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── Role card ── */}
      <div className="glass" style={{ padding: '1.75rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.5rem' }}>{meta.icon}</span>
            <h2 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '1.6rem', letterSpacing: '0.04em',
            }}>
              Vote for <span style={{ color: meta.color }}>{meta.label}</span>
            </h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Select one candidate — Step {step + 1} of {ROLES.length}
          </p>
        </div>

        {/* Candidates */}
        <div className="candidate-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '0.85rem', marginBottom: '1.75rem'
        }}>
          {candidates.map((candidate, i) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isSelected={votes[currentRole] === candidate.id}
              onSelect={handleSelect}
              colorPair={AVATAR_COLORS[i % AVATAR_COLORS.length]}
            />
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button
            className="btn-ghost"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
          >
            <ChevronLeft size={17} /> Back
          </button>

          {step < ROLES.length - 1 ? (
            <button
              className="btn-primary"
              onClick={() => setStep(s => s + 1)}
              disabled={!votes[currentRole]}
            >
              Next <ChevronRight size={17} />
            </button>
          ) : (
            <button
              className="btn-success"
              onClick={handleSubmit}
              disabled={!votes[currentRole]}
            >
              <Send size={16} /> Submit Vote
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingBooth;
