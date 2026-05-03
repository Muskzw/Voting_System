import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCandidates } from '../context/CandidatesContext';
import AnimatedNumber from '../components/AnimatedNumber';
import { Trophy, ChevronRight, RefreshCw, Users, TrendingUp, Clock, Crown, ClipboardList, Coins, Vote } from 'lucide-react';

const ROLE_LABELS = {
  president:        { label: 'President',         icon: Crown, color: '#f5c842', bg: 'rgba(245,200,66,0.12)' },
  vice_president:   { label: 'Vice President',    icon: Users, color: '#1a6cf5', bg: 'rgba(26,108,245,0.12)' },
  general_secretary:{ label: 'General Secretary', icon: ClipboardList, color: '#9b59f5', bg: 'rgba(155,89,245,0.12)' },
  treasurer:        { label: 'Treasurer',         icon: Coins, color: '#00e676', bg: 'rgba(0,230,118,0.12)' },
};

// Fallback icon for new roles from Google Sheet
const DEFAULT_ICON = Vote;

const ROLES = Object.keys(ROLE_LABELS);

const AVATAR_COLORS = [
  ['#1a6cf5','#00d4ff'], ['#9b59f5','#e040fb'],
  ['#f5c842','#ff9800'], ['#00e676','#00bcd4'],
];

const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatRole = (role) => {
  if (ROLE_LABELS[role]) return ROLE_LABELS[role].label;
  return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

/** Single race result panel */
const RacePanel = ({ role, votes, candidates: allCandidates }) => {
  const meta = ROLE_LABELS[role] || { label: formatRole(role), icon: DEFAULT_ICON, color: '#7597de', bg: 'rgba(117,151,222,0.12)' };
  const { label, icon: IconComponent, color, bg } = meta;
  const candidates = allCandidates[role] || [];
  const total = candidates.reduce((sum, c) => sum + (votes[role]?.[c.id] || 0), 0);

  const sorted = [...candidates].sort(
    (a, b) => (votes[role]?.[b.id] || 0) - (votes[role]?.[a.id] || 0)
  );

  const leaderId = sorted[0]?.id;

  return (
    <div className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header */}
      <div className="role-header">
        <div className="role-icon" style={{ background: bg }}>
          <IconComponent size={18} color={color} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem' }}>{label}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {total} vote{total !== 1 ? 's' : ''} counted
          </div>
        </div>
        {total > 0 && (
          <div className="winner-crown" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Trophy size={12} /> Leading
          </div>
        )}
      </div>

      {/* Candidates */}
      {sorted.map((candidate, idx) => {
        const count = votes[role]?.[candidate.id] || 0;
        const pct = total > 0 ? (count / total) * 100 : 0;
        const isLeading = candidate.id === leaderId && total > 0;
        const [gradA, gradB] = AVATAR_COLORS[idx % AVATAR_COLORS.length];

        return (
          <div key={candidate.id} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Avatar */}
              <div className="avatar" style={{
                background: candidate.photo ? 'none' : `linear-gradient(135deg, ${gradA}, ${gradB})`,
                width: '40px', height: '40px', fontSize: '0.8rem',
                boxShadow: isLeading ? `0 0 12px ${gradA}66` : 'none',
                overflow: 'hidden', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%'
              }}>
                {candidate.photo ? (
                  <img src={candidate.photo} alt={candidate.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  getInitials(candidate.name)
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  marginBottom: '5px'
                }}>
                  <span style={{
                    fontWeight: isLeading ? 700 : 500,
                    fontSize: '0.88rem',
                    color: isLeading ? 'white' : 'var(--text-secondary)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                  }}>
                    {candidate.name}
                  </span>
                  <span style={{
                    fontSize: '0.82rem', fontWeight: 700, flexShrink: 0, marginLeft: 8,
                    color: isLeading ? color : 'var(--text-muted)'
                  }}>
                    <AnimatedNumber value={count} /> &nbsp;
                    <span style={{ fontWeight: 400, fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      ({pct.toFixed(0)}%)
                    </span>
                  </span>
                </div>

                {/* Bar */}
                <div className="result-bar-wrap">
                  <div className="result-bar-fill" style={{
                    width: `${pct}%`,
                    background: isLeading
                      ? `linear-gradient(90deg, ${gradA}, ${gradB})`
                      : 'rgba(255,255,255,0.12)',
                  }} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Stat card */
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <div style={{
      width: 44, height: 44, borderRadius: '10px', flexShrink: 0,
      background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <Icon size={20} color={color} />
    </div>
    <div>
      <div style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
    </div>
  </div>
);

/* ─── Main Page ─── */
const HomePage = () => {
  const navigate = useNavigate();
  const { candidates, loading } = useCandidates();
  const [votes, setVotes] = useState({});
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const roles = Object.keys(candidates);

  const loadVotes = useCallback(() => {
    const saved = JSON.parse(localStorage.getItem('cathsoc_votes') || '{}');
    setVotes(saved);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    loadVotes();
    const interval = setInterval(loadVotes, 5000); // auto-refresh every 5s
    return () => clearInterval(interval);
  }, [loadVotes]);

  const totalVotesCast = (() => {
    let max = 0;
    roles.forEach(role => {
      const t = Object.values(votes[role] || {}).reduce((s, v) => s + v, 0);
      if (t > max) max = t;
    });
    return max;
  })();

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="page-content" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 120px' }}>

      {/* ── HERO ── */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '5rem 1rem 3rem', gap: '1.25rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="live-badge"><span className="dot" />Live</div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Election Night Coverage
          </span>
        </div>

        <h1 style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(2.5rem, 8vw, 4.2rem)',
          letterSpacing: '0.04em', lineHeight: 1.05,
          background: 'linear-gradient(135deg, #ffffff 40%, #00d4ff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          margin: '0.5rem 0'
        }}>
          CATHSOC Executive Election
        </h1>

        <p style={{ color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.65, fontSize: '0.97rem' }}>
          Real-time voting results for the Catholic Society 2024 Executive Election.
          Results refresh automatically every&nbsp;5&nbsp;seconds.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn-primary" onClick={() => navigate('/login')}>
            Cast Your Vote <ChevronRight size={16} />
          </button>
          <button className="btn-ghost" onClick={loadVotes}>
            <RefreshCw size={15} /> Refresh Now
          </button>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Last updated: <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{formatTime(lastUpdated)}</span>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem', marginBottom: '2rem'
      }}>
        <StatCard icon={Users}     label="Total Votes Cast"    value={totalVotesCast} color="#1a6cf5" />
        <StatCard icon={TrendingUp} label="Races Being Tracked" value={roles.length}   color="#9b59f5" />
        <StatCard icon={Trophy}    label="Positions Available"  value={roles.length}   color="#f5c842" />
        <StatCard icon={Clock}     label="Polls Status"         value="OPEN"           color="#00e676" />
      </div>

      {/* ── RESULTS GRID ── */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{
          fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.6rem',
          letterSpacing: '0.06em', color: 'var(--text-secondary)'
        }}>
          Live Race Results
        </h2>
        <div style={{ height: 1, background: 'var(--border-dim)', marginTop: '0.5rem' }} />
      </div>

      <div className="results-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '1.25rem'
      }}>
        {roles.map(role => (
          <RacePanel key={role} role={role} votes={votes} candidates={candidates} />
        ))}
      </div>

      {/* ── No Votes Yet ── */}
      {totalVotesCast === 0 && (
        <div style={{
          textAlign: 'center', padding: '4rem 2rem',
          color: 'var(--text-muted)', fontSize: '0.95rem'
        }}>
          <div style={{ color: 'var(--accent-blue)', marginBottom: '1.25rem', opacity: 0.5 }}>
            <Vote size={48} />
          </div>
          <p>No votes have been cast yet. Be the first to vote!</p>
          <button className="btn-primary" onClick={() => navigate('/login')} style={{ marginTop: '1.5rem' }}>
            Open Voting Booth
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
