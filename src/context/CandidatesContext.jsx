import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_CANDIDATES } from '../data/mockData';
import { fetchCandidatesFromSheet } from '../services/dataService';

const CandidatesContext = createContext();

export const CandidatesProvider = ({ children }) => {
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
  const [loading, setLoading] = useState(true);

  const refreshCandidates = async () => {
    const data = await fetchCandidatesFromSheet();
    if (data) {
      setCandidates(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshCandidates();
  }, []);

  return (
    <CandidatesContext.Provider value={{ candidates, loading, refreshCandidates }}>
      {children}
    </CandidatesContext.Provider>
  );
};

export const useCandidates = () => useContext(CandidatesContext);
