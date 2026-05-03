import React from 'react';

const TICKER_ITEMS = [
  { label: 'CATHSOC Elections 2024', value: 'VOTING IS NOW OPEN' },
  { label: 'Eligible Voters', value: '5 Registered' },
  { label: 'Polls Close', value: 'Tonight at Midnight' },
  { label: 'Election Commission', value: 'CATHSOC Official' },
  { label: 'Admin Dashboard', value: 'Access with ADMIN-123' },
  { label: 'Results', value: 'Updated in Real Time' },
];

const Ticker = () => {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]; // duplicate for seamless loop

  return (
    <div className="ticker-bar" role="marquee" aria-label="Election updates ticker">
      <div className="ticker-label">Breaking</div>
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div className="ticker-track">
          {items.map((item, i) => (
            <span className="ticker-item" key={i}>
              {item.label}&nbsp;—&nbsp;<span>{item.value}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Ticker;
