import React from 'react';

const Spinner = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh'
      }}>
        <div className="spinner" />
      </div>
    );
  }
  return (
    <div className="spinner-overlay">
      <div className="spinner" />
    </div>
  );
};

export default Spinner;
