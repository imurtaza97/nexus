import React, { createContext, useState, useContext } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const showLoading = () => setLoading(true);
  const hideLoading = () => {
    setProgress(100); // Ensure completion before hiding
    setTimeout(() => {
      setLoading(false);
      setProgress(0); // Reset after hiding
    }, 500); // Smooth finish
  };
  
  const setLoadingProgress = (value) => setProgress(value);

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading, progress, setLoadingProgress }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);