import React, { useState, useEffect } from 'react';
import { MOCK_CANDIDATES } from '../data/mockData';
import { BarChart3, RefreshCw } from 'lucide-react';

const ROLE_LABELS = {
  president: 'President',
  vice_president: 'Vice President',
  general_secretary: 'General Secretary',
  treasurer: 'Treasurer',
};

const ROLES = Object.keys(ROLE_LABELS);

const AdminDashboard = () => {
  const [votes, setVotes] = useState({});

  const loadVotes = () => {
    const saved = JSON.parse(localStorage.getItem('cathsoc_votes') || '{}');
    setVotes(saved);
  };

  useEffect(() => {
    loadVotes();
  }, []);

  const getVoteCount = (role, candidateId) => {
    return votes[role]?.[candidateId] || 0;
  };

  const getTotalForRole = (role) => {
    if (!votes[role]) return 0;
    return Object.values(votes[role]).reduce((sum, v) => sum + v, 0);
  };

  const getWinner = (role) => {
    if (!votes[role]) return null;
    const entries = Object.entries(votes[role]);
    if (!entries.length) return null;
    const winnerId = entries.reduce((a, b) => (a[1] >= b[1] ? a : b))[0];
    return MOCK_CANDIDATES[role].find(c => c.id === winnerId);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart3 size={28} color="var(--accent-color)" />
          <h2 style={{ fontSize: '1.8rem' }}>Admin Dashboard — Live Results</h2>
        </div>
        <button className="btn" onClick={loadVotes} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '10px 16px' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {ROLES.map(role => {
          const total = getTotalForRole(role);
          const winner = getWinner(role);
          return (
            <div key={role} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-color)' }}>{ROLE_LABELS[role]}</h3>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Total Votes: <strong style={{ color: 'white' }}>{total}</strong>
                  {winner && total > 0 && (
                    <span style={{ marginLeft: '1rem', color: '#4cd137' }}>🏆 Leading: {winner.name}</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {MOCK_CANDIDATES[role].map(candidate => {
                  const count = getVoteCount(role, candidate.id);
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={candidate.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <span style={{ fontWeight: 500 }}>{candidate.name}</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                          {count} votes ({pct}%)
                        </span>
                      </div>
                      <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: 'linear-gradient(90deg, #7597de, #e5a4cb)',
                          borderRadius: '5px',
                          transition: 'width 0.8s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(votes).length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <p>No votes have been cast yet. Results will appear here once students begin voting.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
