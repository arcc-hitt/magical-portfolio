"use client"

import React from 'react';
import Image from 'next/image';
import { motion, useAnimate } from 'framer-motion';
import { TextAnimate } from "@/components/ui/text-animate";
import { Kaushan_Script } from "next/font/google";

const kaushan = Kaushan_Script({ weight: "400", subsets: ["latin"] });

interface SpotLightCardProps {
  index: number;
  width: number;
  height: number;
  left: string;
  bottom: string;
  bg: string;
  frontBg?: string;
  label?: string;
  active?: boolean;
}

// Center burst sparkles for reveal moment
const SparkleBurst: React.FC<{ count?: number; width: number; height: number; duration?: number }> = ({ count = 14, width, height, duration = 0.7 }) => {
  const minDim = Math.min(width, height);
  const maxR = minDim * 0.35; // how far sparkles travel
  const particles = React.useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const baseAngle = (i / count) * Math.PI * 2;
      const jitter = (Math.random() - 0.5) * (Math.PI / 10);
      const angle = baseAngle + jitter;
      const r = maxR * (0.5 + Math.random() * 0.5);
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      const size = 1.8 + Math.random() * 2.2; // 1.8 - 4 px
      const delay = Math.random() * 0.05; // tiny stagger
      return { x, y, size, delay };
    });
  }, [count, maxR]);

  return (
    <div className="absolute inset-0" style={{ pointerEvents: 'none' }}>
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          className="absolute rounded-full"
          style={{
            top: '50%',
            left: '50%',
            width: p.size,
            height: p.size,
            background: 'linear-gradient(135deg, #ffffff 10%, #cfd3d8 55%, #9aa1a9 100%)',
            filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.9))',
          }}
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0.9, 0],
            scale: [0, 1, 0.9, 0.6],
            x: [0, p.x],
            y: [0, p.y],
          }}
          transition={{ duration, ease: [0.2, 0.8, 0.2, 1], delay: p.delay }}
        />
      ))}
    </div>
  );
};

const SpotLightCard: React.FC<SpotLightCardProps> = ({ index, width, height, left, bottom, bg, frontBg, label, active = false }) => {
  const [showLabel, setShowLabel] = React.useState(false);
  const [burstKey, setBurstKey] = React.useState(0);
  const [scope, animate] = useAnimate();
  const hasShownRef = React.useRef(false);
  
  const fontPx = React.useMemo(() => {
    const v = width * 0.16;
    return Math.round(Math.max(18, Math.min(44, v)));
  }, [width]);

  // Magical spinning animation sequence
  React.useEffect(() => {
    const runAnimation = async () => {
      if (active && !hasShownRef.current) {
        // Phase 1: 4-5 spins at normal speed, gradually slowing, while scaling up
        const spins = 5;
        const baseRotation = spins * 360; // normal speed spins
        const endRotation = baseRotation + 180; // reveal back side

        // Phase 1: steady spins at normal speed (no easing jitters)
        await animate(
          scope.current,
          { rotateY: baseRotation },
          { duration: 2.3, ease: 'linear' }
        );

        // Phase 2: ease-out to final 180 and scale up smoothly
        await animate(
          scope.current,
          { rotateY: endRotation, scale: 1.12 },
          { duration: 1, ease: [0.22, 1, 0.36, 1] }
        );

        // Phase 2: At max scale, burst sparkles + reveal text immediately
        setBurstKey((k) => k + 1);
        setShowLabel(true);
        hasShownRef.current = true;

        // Phase 3: Gradually scale down (snappy but smooth)
        await animate(
          scope.current,
          { scale: 1 },
          { duration: 0.5, ease: 'easeOut' }
        );
      } else if (!active) {
        // Reset animation - smooth rotation back
        setShowLabel(false);
        hasShownRef.current = false;
        
        await animate(
          scope.current,
          { 
            rotateY: 0,
            scale: 1,
          },
          { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
        );
      }
    };
    
    runAnimation();
  }, [active, animate, scope]);

  return (
    <div
      data-card
      data-card-index={index}
      className="absolute cursor-pointer rounded-lg bg-transparent"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `calc(50% + ${left})`,
        bottom: bottom,
        transform: 'translateX(-50%)',
        perspective: '1000px',
      }}
    >
      <motion.div
        ref={scope}
        className="relative w-full h-full"
        style={{ transformStyle: 'preserve-3d', willChange: 'transform', transformOrigin: '50% 50%', transform: 'translateZ(0)', zIndex: 10 }}
        initial={{ rotateY: 0, scale: 1 }}
      >
        {/* Back face (card back) */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}
        >
          <Image
            src={bg}
            alt={`Card ${index + 1}`}
            fill
            className="object-fill"
            draggable={false}
            priority={false}
          />
          {/* Dimmer overlay */}
          <div
            className="absolute inset-0 z-10 rounded-lg pointer-events-none transition-opacity duration-200 ease-out mix-blend-multiply bg-gradient-to-b from-[rgba(41,0,118,0.71)] to-[rgba(0,0,0,0.95)]"
            style={{ opacity: active ? 0 : 1 }}
          />
        </div>

        {/* Front face (card front) */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <Image
            src={frontBg ?? bg}
            alt={`Card ${index + 1}`}
            fill
            className="object-fill"
            draggable={false}
            priority={false}
          />

          {/* Silver text with center burst sparkles */}
          {label && showLabel && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {/* sparkle burst behind text */}
              <SparkleBurst key={burstKey} width={width} height={height} />

              {/* text reveal */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="relative z-10"
                >
                  <TextAnimate
                    as="h3"
                    by="word"
                    animation="fadeIn"
                    startOnView={false}
                    duration={0.25}
                    delay={0}
                    initial={false}
                    className={`${kaushan.className} inline-block brightness-110 text-center select-none font-normal tracking-wide`}
                    segmentClassName="px-1 text-transparent bg-clip-text bg-gradient-to-br from-gray-300 via-white to-gray-400"
                    style={{
                      fontSize: `${fontPx}px`,
                      lineHeight: 1.05,
                      textShadow:
                        '0 1px 0 rgba(255,255,255,0.8), 0 2px 4px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.3), 0 0 12px rgba(255,255,255,0.3)',
                      filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))',
                    }}
                  >
                    {label}
                  </TextAnimate>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SpotLightCard;