"use client"

import React from 'react'
import SpotLightCard from './SpotLightCard'
import SpotlightBeamOverlay from './SpotlightBeamOverlay'

// Static layout for cards (size and position)
const baseLayout = [
    { width: 140, height: 200, left: '-40%', bottom: '35%' },
    { width: 170, height: 260, left: '-20%', bottom: '25%' },
    { width: 220, height: 330, left: '0%', bottom: '15%' },
    { width: 170, height: 260, left: '20%', bottom: '25%' },
    { width: 140, height: 200, left: '40%', bottom: '35%' },
];

// Available assets and labels to randomize per page load
const backImages = [
    "/card-back_1.png",
    "/card-back_2.png",
    "/card-back_3.png",
    "/card-back_4.png",
    "/card-back_5.png",
];

const frontImages = [
    "/card-front-1.png",
    "/card-front-2.png",
    "/card-front-3.png",
    "/card-front-4.png",
];

const labels = [
    "About",
    "Projects",
    "Contact",
    "Skills",
    "Achievements",
];

// Utility: Fisher–Yates shuffle (non-mutating)
function shuffle<T>(arr: readonly T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

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

    // Generate randomized assignments on the client after mount to avoid SSR hydration mismatch
    const [randomizedConfigs, setRandomizedConfigs] = React.useState(
        // deterministic initial configs for SSR
        [
            { ...baseLayout[0], bg: "/card-back_1.png", front: "/card-front-1.png", label: "About" },
            { ...baseLayout[1], bg: "/card-back_2.png", front: "/card-front-2.png", label: "Projects" },
            { ...baseLayout[2], bg: "/card-back_3.png", front: "/card-front-3.png", label: "Contact" },
            { ...baseLayout[3], bg: "/card-back_4.png", front: "/card-front-4.png", label: "Skills" },
            { ...baseLayout[4], bg: "/card-back_5.png", front: "/card-front-3.png", label: "Achievements" },
        ]
    );

    React.useEffect(() => {
        const backs = shuffle(backImages);
        const fronts = shuffle(frontImages);
        const texts = shuffle(labels);

        const pick = <T,>(arr: T[], idx: number): T => arr[idx % arr.length];
        const configs = baseLayout.map((layout, idx) => ({
            ...layout,
            bg: pick(backs, idx),
            front: pick(fronts, idx),
            label: pick(texts, idx),
        }));
        setRandomizedConfigs(configs);
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full relative flex items-center justify-center"
            onMouseLeave={handleLeave}
            onMouseMove={handleMove}
        >
            <SpotlightBeamOverlay target={target} visible={hovering} />

            {randomizedConfigs.map((card, index) => (
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