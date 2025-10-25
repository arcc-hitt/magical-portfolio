"use client"

import React from 'react';

interface SpotLightCardProps {
  index: number;
  width: number;
  height: number;
  left: string;
  bottom: string;
  bg: string;
  active?: boolean;
}

const SpotLightCard: React.FC<SpotLightCardProps> = ({ index, width, height, left, bottom, bg, active = false }) => {
  return (
    <div
      data-card
      data-card-index={index}
      className="absolute cursor-pointer overflow-hidden rounded-lg"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `calc(50% + ${left})`,
        bottom: bottom,
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transform: 'translateX(-50%)',
      }}
    >
      {/* Dimmer overlay: blend with page background using gradient + multiply */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none transition-opacity duration-200 ease-out mix-blend-darken bg-gradient-to-b from-[rgba(42,13,83,0.45)] to-[rgba(5,0,0,0.79)]"
        style={{ opacity: active ? 0 : 1 }}
      />
    </div>
  );
};

export default SpotLightCard;