"use client"

import React from 'react'
import SpotLightCard from './SpotLightCard'
import SpotlightBeamOverlay from './SpotlightBeamOverlay'

const cardConfigs = [
    { width: 140, height: 200, left: '-40%', bottom: '35%', bg: "/card-back_1.png", front: "/card-front-1.png", label: "About" },
    { width: 170, height: 260, left: '-20%', bottom: '25%', bg: "/card-back_2.png", front: "/card-front-2.png", label: "Projects" },
    { width: 220, height: 330, left: '0%', bottom: '15%', bg: "/card-back_3.png", front: "/card-front-3.png", label: "Contact" },
    { width: 170, height: 260, left: '20%', bottom: '25%', bg: "/card-back_4.png", front: "/card-front-4.png", label: "Skills" },
    { width: 140, height: 200, left: '40%', bottom: '35%', bg: "/card-back_5.png", front: "/card-front-3.png", label: "Achievements" }
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
                    frontBg={(card as any).front}
                    label={(card as any).label}
                    active={hoveredIndex === index}
                />
            ))}
        </div>
    );
};

export default SpotLightCardContainer