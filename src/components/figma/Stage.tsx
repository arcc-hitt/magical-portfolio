import React from 'react';

interface CurtainRectangleRedProps {
  className?: string;
}

const Stage: React.FC<CurtainRectangleRedProps> = ({ className = '' }) => {
  return (
    <div
      className={`w-full h-4/7 bg-bg-stage absolute bottom-0 blur-md shadow-none ${className}`}
    />
  );
};

export default Stage;
