import React from 'react';

const CandidateCard = ({ candidate, isSelected, onSelect }) => {
  return (
    <div 
      className={`glass-panel candidate-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(candidate.id)}
      style={{
        padding: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: isSelected ? '2px solid var(--accent-color)' : '1px solid var(--card-border)',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isSelected ? '0 0 20px rgba(229, 164, 203, 0.3)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}
    >
      <h3 style={{ margin: 0, color: isSelected ? 'var(--accent-color)' : 'white' }}>
        {candidate.name}
      </h3>
      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
        {candidate.course}
      </p>
      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', lineHeight: '1.4' }}>
        "{candidate.bio}"
      </p>
      
      <div style={{ 
        marginTop: '1rem', 
        height: '24px', 
        width: '24px', 
        borderRadius: '50%', 
        border: `2px solid ${isSelected ? 'var(--accent-color)' : 'var(--text-secondary)'}`,
        alignSelf: 'flex-end',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {isSelected && <div style={{ height: '12px', width: '12px', borderRadius: '50%', backgroundColor: 'var(--accent-color)' }} />}
      </div>
    </div>
  );
};

export default CandidateCard;
