'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface BoxRevealProps {
  children: React.ReactNode;
  className?: string;
  boxColor?: string;
  duration?: number;
  delay?: number;
  once?: boolean;
  viewportMargin?: string;
}

export const BoxReveal: React.FC<BoxRevealProps> = ({
  children,
  className = '',
  boxColor = '#0d9488',
  duration = 0.65,
  delay = 0,
  once = true,
  viewportMargin = '-80px',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Only arm animation if currently below viewport
    if (rect.top >= windowHeight) {
      setHidden(true);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setRevealed(true);
              if (once) {
                observer.unobserve(entry.target);
              }
            } else if (!once) {
              setRevealed(false);
            }
          });
        },
        { rootMargin: viewportMargin }
      );

      observer.observe(el);
      return () => observer.disconnect();
    }
  }, [once, viewportMargin]);

  const isArmed = hidden;

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Content wrapper */}
      <div
        style={
          isArmed
            ? {
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translate3d(0, 0, 0)' : 'translate3d(0, 10px, 0)',
                transition: `opacity ${duration * 0.5}s ease-out ${delay + duration * 0.4}s, transform ${duration * 0.5}s cubic-bezier(0.16, 1, 0.3, 1) ${delay + duration * 0.4}s`,
                willChange: revealed ? 'auto' : 'opacity, transform',
              }
            : undefined
        }
      >
        {children}
      </div>

      {/* Box Reveal Curtain */}
      {isArmed && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: boxColor,
            zIndex: 40,
            pointerEvents: 'none',
            borderRadius: 'inherit',
            transform: revealed ? 'scaleX(0)' : 'scaleX(0)',
            transformOrigin: revealed ? 'right' : 'left',
            animation: revealed
              ? `boxRevealCurtain ${duration}s cubic-bezier(0.77, 0, 0.175, 1) ${delay}s forwards`
              : 'none',
          }}
        />
      )}

      {isArmed && (
        <style>{`
          @keyframes boxRevealCurtain {
            0% {
              transform: scaleX(0);
              transform-origin: left;
            }
            50% {
              transform: scaleX(1);
              transform-origin: left;
            }
            50.1% {
              transform-origin: right;
            }
            100% {
              transform: scaleX(0);
              transform-origin: right;
            }
          }
        `}</style>
      )}
    </div>
  );
};

export default BoxReveal;
