// src/contexts/AlertContext.js
import React, { createContext, useState, useContext } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (type, message) => {
    if (typeof message !== 'string') {
      message = JSON.stringify(message);
    }
    const id = new Date().getTime(); // Unique ID for each alert
    setAlerts([...alerts, { id, type, message }]);
  };

  const removeAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);

