import React, { useState, useEffect } from 'react';
import { useCandidates } from '../context/CandidatesContext';
import { BarChart3, RefreshCw, Trophy, Trash2, Users, UserCheck, ShieldCheck, Download, ChevronRight } from 'lucide-react';

const ROLE_LABELS = {
  president: 'President',
  vice_president: 'Vice President',
  general_secretary: 'General Secretary',
  treasurer: 'Treasurer',
};

const AdminDashboard = () => {
  const { candidates: allCandidates, loading } = useCandidates();
  const [votes, setVotes] = useState({});
  const [activeTab, setActiveTab] = useState('results');
  const [voterStats, setVoterStats] = useState({ total: 0, voted: 0 });
  
  const roles = Object.keys(allCandidates);

  const loadData = () => {
    // Load Votes
    const savedVotes = JSON.parse(localStorage.getItem('cathsoc_votes') || '{}');
    setVotes(savedVotes);

    // Load Voter Stats
    let votedCount = 0;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('voted_')) votedCount++;
    });
    setVoterStats({ total: 50, voted: votedCount }); // Hardcoded 50 for demo, could be MOCK_VOTER_CODES.length
  };

  const handleReset = () => {
    if (window.confirm('CRITICAL: Are you sure you want to RESET ALL VOTES and voter statuses? This action is permanent.')) {
      localStorage.removeItem('cathsoc_votes');
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('voted_')) localStorage.removeItem(key);
      });
      loadData();
      alert('System has been reset.');
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getVoteCount = (role, candidateId) => votes[role]?.[candidateId] || 0;
  
  const getTotalForRole = (role) => {
    if (!votes[role]) return 0;
    return Object.values(votes[role]).reduce((sum, v) => sum + v, 0);
  };

  const getWinner = (role) => {
    if (!votes[role]) return null;
    const entries = Object.entries(votes[role]);
    if (!entries.length) return null;
    const winnerId = entries.reduce((a, b) => (a[1] >= b[1] ? a : b))[0];
    return (allCandidates[role] || []).find(c => c.id === winnerId);
  };

  const exportResults = () => {
    const data = roles.map(role => {
      const candidates = allCandidates[role] || [];
      const total = getTotalForRole(role);
      return {
        role: ROLE_LABELS[role] || role,
        totalVotes: total,
        results: candidates.map(c => ({
          name: c.name,
          votes: getVoteCount(role, c.id),
          percent: total > 0 ? ((getVoteCount(role, c.id) / total) * 100).toFixed(1) + '%' : '0%'
        }))
      };
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cathsoc_election_results_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Admin Data...</div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ padding: '8px', background: 'rgba(0,212,255,0.1)', borderRadius: '10px' }}>
              <ShieldCheck size={24} color="var(--accent-cyan)" />
            </div>
            <h1 style={{ fontSize: '2rem', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.05em' }}>Control Center</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Secure management and real-time auditing of the CATHSOC 2024 Election.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-ghost" onClick={exportResults} style={{ gap: '8px' }}>
            <Download size={16} /> Export
          </button>
          <button className="btn-primary" onClick={loadData} style={{ gap: '8px' }}>
            <RefreshCw size={16} /> Sync
          </button>
          <button className="btn-ghost" onClick={handleReset} style={{ color: 'var(--accent-red)', gap: '8px', borderColor: 'rgba(255,107,107,0.2)' }}>
            <Trash2 size={16} /> Reset
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: 50, height: 50, borderRadius: '12px', background: 'rgba(26,108,245,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={24} color="#1a6cf5" />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{voterStats.voted}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Confirmed Ballots</div>
          </div>
        </div>
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: 50, height: 50, borderRadius: '12px', background: 'rgba(155,89,245,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} color="#9b59f5" />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{roles.length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Races</div>
          </div>
        </div>
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ width: 50, height: 50, borderRadius: '12px', background: 'rgba(0,230,118,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={24} color="#00e676" />
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{Object.values(allCandidates).flat().length}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Candidates</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border-dim)', marginBottom: '2rem' }}>
        {[
          { id: 'results', label: 'Live Standings', icon: BarChart3 },
          { id: 'candidates', label: 'Candidate Registry', icon: Users },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '1rem 0',
              background: 'none',
              border: 'none',
              color: activeTab === tab.id ? 'var(--accent-cyan)' : 'var(--text-muted)',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-cyan)' : '2px solid transparent',
              transition: 'all 0.2s',
              marginBottom: '-1px'
            }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'results' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '1.5rem' }} className="results-grid">
          {roles.map(role => {
            const total = getTotalForRole(role);
            const winner = getWinner(role);
            const candidates = allCandidates[role] || [];
            return (
              <div key={role} className="glass" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-cyan)' }}>
                    {ROLE_LABELS[role] || role.replace(/_/g, ' ')}
                  </h3>
                  <div style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px' }}>
                    {total} Votes
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {candidates.map(candidate => {
                    const count = getVoteCount(role, candidate.id);
                    const pct = total > 0 ? (count / total) * 100 : 0;
                    const isLeading = winner?.id === candidate.id && total > 0;
                    
                    return (
                      <div key={candidate.id}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                          <span style={{ fontWeight: isLeading ? 700 : 400, color: isLeading ? 'white' : 'var(--text-secondary)' }}>
                            {candidate.name} {isLeading && '👑'}
                          </span>
                          <span style={{ fontWeight: 700 }}>{count} ({pct.toFixed(0)}%)</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ 
                            height: '100%', 
                            width: `${pct}%`, 
                            background: isLeading ? 'linear-gradient(90deg, #1a6cf5, #00d4ff)' : 'rgba(255,255,255,0.15)',
                            transition: 'width 1s ease-out'
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
      )}

      {activeTab === 'candidates' && (
        <div className="glass" style={{ padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-dim)' }}>
                <th style={{ padding: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>CANDIDATE</th>
                <th style={{ padding: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>POSITION</th>
                <th style={{ padding: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>BIO / MANIFESTO</th>
                <th style={{ padding: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {roles.flatMap(role => (allCandidates[role] || []).map(candidate => (
                <tr key={candidate.id} style={{ borderBottom: '1px solid var(--border-dim)' }}>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: 40, height: 40, borderRadius: '8px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {candidate.photo ? (
                          <img src={candidate.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '0.8rem' }}>{candidate.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{candidate.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{candidate.course}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', padding: '4px 10px', borderRadius: '12px', 
                      background: 'rgba(0,212,255,0.08)', color: 'var(--accent-cyan)',
                      textTransform: 'uppercase', fontWeight: 600
                    }}>
                      {ROLE_LABELS[role] || role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {candidate.bio}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-green)', fontSize: '0.85rem' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
                      Verified
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      )}

      {/* CSS for grid */}
      <style>{`
        @media (max-width: 900px) {
          .results-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
