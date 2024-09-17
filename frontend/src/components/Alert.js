// src/components/Alert.js
import React, { useEffect, useState } from 'react';
import { useAlert } from '../contexts/AlertContext';
import '../index.css'; // Adjust the path as needed

const Alert = () => {
    const { alerts, removeAlert } = useAlert();
    const [visibleAlerts, setVisibleAlerts] = useState(alerts);
  
    useEffect(() => {
      setVisibleAlerts(alerts); // Update visible alerts when context changes
    }, [alerts]);
  
    useEffect(() => {
      const timers = visibleAlerts.map(alert =>
        setTimeout(() => {
          document.getElementById(`alert-${alert.id}`).classList.add('slide-out');
          setTimeout(() => {
            removeAlert(alert.id);
          }, 500); // Match duration of slide-out animation
        }, 20000) // Alert will disappear after 20 seconds
      );
  
      return () => timers.forEach(timer => clearTimeout(timer));
    }, [visibleAlerts, removeAlert]);
  
    return (
      <div className="alerts-container">
        {visibleAlerts.map(({ id, type, message }) => (
          <div
            id={`alert-${id}`}
            key={id}
            className={`alert alert-${type}`}
          >
            <div className='flex flex-col'>
              <span className='text-md font-semibold'>{type}!</span>
              <span className='text-sm'>{message}</span>
            </div>
            <button className='close-btn' onClick={() => {
              document.getElementById(`alert-${id}`).classList.add('slide-out');
              setTimeout(() => {
                removeAlert(id);
              }, 500); // Match duration of slide-out animation
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    );
  };
  
  export default Alert;
