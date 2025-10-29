"use client"

import React from 'react';
import Image from 'next/image';

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
        transform: 'translateX(-50%)',
      }}
    >
      {/* Image */}
      <div className="relative w-full h-full z-0">
        <Image
          src={bg}
          alt={`Card ${index + 1}`}
          fill
          className="object-fill"
          draggable={false}
          priority={false}
        />
      </div>

      {/* Dimmer overlay */}
      <div
        className="absolute inset-0 z-10 rounded-lg pointer-events-none transition-opacity duration-200 ease-out mix-blend-multiply bg-gradient-to-b from-[rgba(41,0,118,0.71)] to-[rgba(0,0,0,0.95)]"
        style={{
          opacity: active ? 0 : 1,
          width: `${width}px`,
          height: `${height}px`,
        }}
      />
    </div>
  );
};

export default SpotLightCard;