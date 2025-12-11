import React from 'react';

interface CurtainRectangleRedProps {
  className?: string;
}

const Stage: React.FC<CurtainRectangleRedProps> = ({ className = '' }) => {
  return (
    <div
      className={`w-full h-4/7 bg-bg-stage absolute bottom-0 blur-md shadow-[0px_4px_4px_10px_rgba(42,13,83,0.8)] backdrop-blur-sm ${className}`}
    />
  );
};

export default Stage;
