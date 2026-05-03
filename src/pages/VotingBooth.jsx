import React, { useState } from 'react';
import CandidateCard from '../components/CandidateCard';
import { MOCK_CANDIDATES } from '../data/mockData';
import { CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

const ROLE_LABELS = {
  president: 'President',
  vice_president: 'Vice President',
  general_secretary: 'General Secretary',
  treasurer: 'Treasurer',
};

const ROLES = Object.keys(ROLE_LABELS);

const VotingBooth = ({ voterCode, onComplete }) => {
  const [step, setStep] = useState(0);
  const [votes, setVotes] = useState({
    president: null,
    vice_president: null,
    general_secretary: null,
    treasurer: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const currentRole = ROLES[step];
  const candidates = MOCK_CANDIDATES[currentRole];

  const handleSelect = (candidateId) => {
    setVotes(prev => ({ ...prev, [currentRole]: candidateId }));
  };

  const handleNext = () => {
    if (step < ROLES.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = () => {
    const allVoted = ROLES.every(role => votes[role] !== null);
    if (!allVoted) {
      alert('Please vote for all roles before submitting.');
      return;
    }

    const existingVotes = JSON.parse(localStorage.getItem('cathsoc_votes') || '{}');
    ROLES.forEach(role => {
      const candidateId = votes[role];
      existingVotes[role] = existingVotes[role] || {};
      existingVotes[role][candidateId] = (existingVotes[role][candidateId] || 0) + 1;
    });
    localStorage.setItem('cathsoc_votes', JSON.stringify(existingVotes));
    localStorage.setItem(`voted_${voterCode}`, 'true');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', textAlign: 'center' }}>
          <CheckCircle size={80} color="var(--success)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--success)' }}>Vote Submitted!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
            Your votes have been securely recorded. Thank you for participating in the CATHSOC Executive Election!
          </p>
          <button className="btn" onClick={onComplete}>Return to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Progress bar */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          {ROLES.map((role, i) => (
            <div key={role} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', flex: 1 }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i < step ? 'var(--success)' : i === step ? 'linear-gradient(90deg, #7597de, #e5a4cb)' : 'rgba(255,255,255,0.1)',
                fontSize: '0.85rem', fontWeight: 700, color: 'white',
                transition: 'background 0.3s'
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '0.7rem', color: i === step ? 'var(--accent-color)' : 'var(--text-secondary)', textAlign: 'center' }}>
                {ROLE_LABELS[role]}
              </span>
            </div>
          ))}
        </div>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${((step) / (ROLES.length)) * 100}%`,
            background: 'linear-gradient(90deg, #7597de, #e5a4cb)',
            borderRadius: '2px', transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Voting area */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '0.5rem', fontSize: '1.6rem' }}>
          Vote for <span style={{ color: 'var(--accent-color)' }}>{ROLE_LABELS[currentRole]}</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Select one candidate</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {candidates.map(candidate => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isSelected={votes[currentRole] === candidate.id}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn" onClick={handleBack} disabled={step === 0}
            style={{ background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ChevronLeft size={18} /> Back
          </button>

          {step < ROLES.length - 1 ? (
            <button className="btn" onClick={handleNext} disabled={!votes[currentRole]}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button className="btn" onClick={handleSubmit} disabled={!votes[currentRole]}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(90deg, #27ae60, #4cd137)' }}>
              <CheckCircle size={18} /> Submit Vote
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingBooth;
