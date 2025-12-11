"use client";

import React from "react";
import { motion } from "framer-motion";

type Target = { x: number; y: number; w: number; h: number } | null;

interface SpotlightBeamOverlayProps {
  target: Target;
  visible: boolean;
  beamAngleDeg?: number; // total cone angle
  color?: string;
}

// Renders a full-screen overlay with a conical spotlight from the top (apex)
// aimed at the target point.
const SpotlightBeamOverlay: React.FC<SpotlightBeamOverlayProps> = ({
  target,
  visible,
  beamAngleDeg = 50,
  color = "255,255,255",
}) => {
  const [vw, setVw] = React.useState(0);
  const [vh, setVh] = React.useState(0);

  React.useEffect(() => {
    const onResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Compute polygon points for the cone; make base width slightly wider than card
  const points = React.useMemo(() => {
    if (!target || vw === 0 || vh === 0) return "";
    const apexX = target.x; // align spotlight directly above the target
    const apexY = 0; // top of the viewport
    const halfAngleRad = (beamAngleDeg / 2) * (Math.PI / 180);
    // baseHalfWidth derived from angle and distance; ensure it's at least slightly wider than card
    const derivedHalf = Math.tan(halfAngleRad) * Math.max(0, target.y - apexY);
    const minHalf = (target.w * 0.6); // 20% wider than half the card width
    const halfWidth = Math.max(derivedHalf, minHalf);
    const leftX = Math.max(0, Math.min(vw, target.x - halfWidth));
    const rightX = Math.max(0, Math.min(vw, target.x + halfWidth));
    // Extend to the bottom edge of the card (target.y is center; add half height)
    const baseY = Math.max(0, Math.min(vh, target.y + target.h / 2));
    // Polygon: apex -> right base -> left base
    return `${apexX},${apexY} ${rightX},${baseY} ${leftX},${baseY}`;
  }, [target, vw, vh, beamAngleDeg]);

  // Base ellipse (hotspot on the target area) — slightly larger than the card
  const ellipse = React.useMemo(() => {
    if (!target || vw === 0 || vh === 0) return { cx: 0, cy: 0, rx: 0, ry: 0 };
    const rx = Math.max(target.w * 0.6, 30); // slightly wider than half card width
    const ry = Math.max(target.h * 0.15, 18); // a bit taller than thin ellipse
    const bottomY = Math.min(vh, target.y + target.h / 2);
    const cy = Math.max(0, bottomY - Math.max(2, target.h * 0.02));
    return { cx: target.x, cy, rx: Math.min(rx, vw * 0.35), ry };
  }, [target, vw, vh, beamAngleDeg]);

  // Rounded rectangle matching the card's bounds to make sure the card area is not tinted at all
  const cardHole = React.useMemo(() => {
    if (!target || vw === 0 || vh === 0) return { x: 0, y: 0, w: 0, h: 0, r: 0 };
    const padding = 1.5; // small padding to ensure clean edge
    const w = Math.min(target.w + padding * 2, vw);
    const h = Math.min(target.h + padding * 2, vh);
    const x = Math.max(0, target.x - w / 2);
    const y = Math.max(0, target.y - h / 2);
    const r = Math.min(12, w / 6, h / 6); // approximate Tailwind rounded-lg
    return { x, y, w, h, r };
  }, [target, vw, vh]);

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible && target ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      style={{ zIndex: 0 }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${vw} ${vh}`}>
        <defs>
          <linearGradient id="beamGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`rgba(${color},0.05)`} />
            <stop offset="70%" stopColor={`rgba(${color},0.18)`} />
            <stop offset="100%" stopColor={`rgba(${color},0.0)`} />
          </linearGradient>
          <filter id="beamBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          </filter>
          {/* Soft hotspot glow gradient (rendered under the card via mask) */}
          <radialGradient id="hotspot" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={`rgba(${color},0.35)`} />
            <stop offset="100%" stopColor={`rgba(${color},0)`} />
          </radialGradient>
          {/**
           * Mask that cuts a clean hole where the spotlight hits the card.
           * This ensures the spotlight color does NOT tint the card image inside the ellipse.
           * White areas of the mask keep the overlay visible; black areas punch it out (transparent).
           */}
          <mask id="spotlightCutout">
            <rect width={vw} height={vh} fill="white" />
          </mask>
        </defs>
        {/*
          Overlay group uses the mask to avoid tinting the card area under the spotlight.
          Everything inside the ellipse becomes transparent, revealing the original card colors.
        */}
        <g mask="url(#spotlightCutout)">
          {/* Dim the surroundings slightly for effect */}
          <rect width={vw} height={vh} fill="rgba(0,0,0,0.08)" />

          {/* Beam cone */}
          {points && (
            <motion.polygon
              points={points}
              fill="url(#beamGrad)"
              filter="url(#beamBlur)"
              initial={{ opacity: 0 }}
              animate={{ opacity: visible ? 1 : 0, points }}
              transition={{ duration: 0.2 }}
            />
          )}

          {/* Hotspot ellipse at target base — masked to avoid coloring the card itself */}
          {visible && target && (
            <motion.ellipse
              cx={ellipse.cx}
              cy={ellipse.cy}
              rx={ellipse.rx}
              ry={ellipse.ry}
              fill="url(#hotspot)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </g>
      </svg>
    </motion.div>
  );
};

export default SpotlightBeamOverlay;
