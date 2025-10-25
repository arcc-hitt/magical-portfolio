'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';

const CurtainContainer: React.FC = () => {
  // Drive curtain opening with a manual motion value updated from wheel direction
  const progress = useMotionValue(0); // 0 closed -> 1 fully open
  const smoothProgress = useSpring(progress, {
    stiffness: 20,
    damping: 8,
    mass: 2,
  });

  // Reduced ranges: the curtains now translate less and rotate less for the same scroll progress.
  const leftTranslateX = useTransform(smoothProgress, [0, 1], ['0%', '-70%']);
  const leftRotateY = useTransform(smoothProgress, [0, 1], [0, -70]);

  const rightTranslateX = useTransform(smoothProgress, [0, 1], ['0%', '70%']);
  const rightRotateY = useTransform(smoothProgress, [0, 1], [0, 70]);

  // State to know when the curtains are (almost) fully open
  const [curtainsOpen, setCurtainsOpen] = React.useState(false);
  // Update curtainsOpen threshold based on smoothed progress
  React.useEffect(() => {
    const unsub = smoothProgress.on("change", (val) => {
      if (val > 0.95) setCurtainsOpen(true);
      else setCurtainsOpen(false);
    });
    return () => unsub();
  }, [smoothProgress]);

  // Wheel listener to adjust progress by scroll direction regardless of overlay pointer events
  React.useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      const delta = e.deltaY; // >0 scroll down, <0 scroll up
      const step = Math.min(0.12, Math.max(0.04, Math.abs(delta) * 0.001));
      const next = progress.get() + (delta > 0 ? step : -step);
      progress.set(Math.max(0, Math.min(1, next)));
    };
    window.addEventListener('wheel', onWheel, { passive: true });
    return () => window.removeEventListener('wheel', onWheel as EventListener);
  }, [progress]);

  return (
    // Outer container remains scrollable at all times.
    <div
      className="fixed top-0 left-0 w-screen h-screen z-10"
      style={{ pointerEvents: curtainsOpen ? 'none' : 'auto' }}
    >
      {/* Inner container holds the curtain visuals.
          Disable pointer events when open so the page beneath is interactive,
          but we still listen to global wheel events to allow closing on scroll up. */}
      <div
        className="w-full h-screen fixed top-0 left-0 overflow-hidden flex"
        style={{
          pointerEvents: curtainsOpen ? 'none' : 'auto',
          zIndex: curtainsOpen ? 0 : 10,
        }}
      >
          {/* Left Curtain */}
          <motion.div
            className="w-1/2 h-full bg-transparent flex"
            style={{
              x: leftTranslateX,
              rotateY: leftRotateY,
            }}
          >
            <Image
              src="/curtain.jpg"
              alt="curtain"
              className="w-full h-full object-cover"
              width={626}
              height={626}
              priority
            />
          </motion.div>
          {/* Right Curtain */}
          <motion.div
            className="w-1/2 h-full bg-transparent flex"
            style={{
              x: rightTranslateX,
              rotateY: rightRotateY,
            }}
          >
            <Image
              src="/curtain.jpg"
              alt="curtain"
              className="w-full h-full object-cover"
              width={626}
              height={626}
              priority
            />
          </motion.div>
      </div>
    </div>
  );
};

export default CurtainContainer;
