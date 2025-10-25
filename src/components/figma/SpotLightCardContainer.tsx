"use client"

import React from 'react'
import SpotLightCard from './SpotLightCard'
import SpotlightBeamOverlay from './SpotlightBeamOverlay'

const cardConfigs = [
    { width: 150, height: 200, left: '-40%', bottom: '35%', bg: "/card-back-1.png" },
    { width: 200, height: 280, left: '-20%', bottom: '25%', bg: "/card-back-2.png" },
    { width: 250, height: 350, left: '0%', bottom: '15%', bg: "/card-back-3.png" },
    { width: 200, height: 280, left: '20%', bottom: '25%', bg: "/card-back-4.png" },
    { width: 150, height: 200, left: '40%', bottom: '35%', bg: "/card-back-5.png" }
];

const SpotLightCardContainer = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [hovering, setHovering] = React.useState(false);
    const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
    const [target, setTarget] = React.useState<{ x: number; y: number; w: number; h: number } | null>(null);

    const handleLeave = () => {
        setHovering(false);
        setHoveredIndex(null);
        setTarget(null);
    };
    const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const targetEl = e.target as HTMLElement;
        const cardEl = targetEl.closest('[data-card]') as HTMLElement | null;
        const cardRect = cardEl?.getBoundingClientRect() as DOMRect | undefined;
        if (cardRect && cardEl) {
            const idxAttr = cardEl.getAttribute('data-card-index');
            const parsed = idxAttr !== null ? Number.parseInt(idxAttr, 10) : Number.NaN;
            setHoveredIndex(Number.isNaN(parsed) ? null : parsed);
            setHovering(true);
            setTarget({ x: cardRect.left + cardRect.width / 2, y: cardRect.top + cardRect.height / 2, w: cardRect.width, h: cardRect.height });
        } else {
            setHovering(false);
            setHoveredIndex(null);
            setTarget(null);
        }
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative flex items-center justify-center"
            onMouseLeave={handleLeave}
            onMouseMove={handleMove}
        >
            <SpotlightBeamOverlay target={target} visible={hovering} />

            {cardConfigs.map((card, index) => (
                <SpotLightCard
                    key={index}
                    index={index}
                    width={card.width}
                    height={card.height}
                    left={card.left}
                    bottom={card.bottom}
                    bg={card.bg}
                    active={hoveredIndex === index}
                />
            ))}
        </div>
    );
};

export default SpotLightCardContainer