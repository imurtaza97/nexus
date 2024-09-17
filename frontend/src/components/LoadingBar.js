import React from 'react';
import { useLoading } from '../contexts/LoadingContext';

const LoadingBar = () => {
  const { loading, progress } = useLoading();

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div
            className="h-full bg-blue-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </>
  );
};

export default LoadingBar;
