'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';

export interface TextRevealProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  staggerDelay?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  viewportMargin?: string;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  children,
  as: Component = 'div',
  className = '',
  staggerDelay = 0.04,
  duration = 0.55,
  delay = 0,
  once = true,
  viewportMargin = '-60px',
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // Split string into words while preserving line breaks or punctuation
  const words = useMemo(() => {
    if (typeof children !== 'string') return [children];
    return children.split(/\s+/).filter(Boolean);
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Only arm animation if the text is currently below the viewport
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

  const isAnimated = hidden;
  const isVisible = !hidden || revealed;

    return React.createElement(
      Component,
      { ref: containerRef as React.Ref<HTMLElement>, className },
      words.map((word, index) => {
        const wordDelay = delay + index * staggerDelay;
        const innerStyle: React.CSSProperties | undefined = isAnimated
          ? {
              display: 'inline-block',
              transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 115%, 0)',
              opacity: isVisible ? 1 : 0,
              transitionProperty: 'transform, opacity',
              transitionDuration: `${duration}s`,
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${wordDelay}s`,
              willChange: isVisible ? 'auto' : 'transform, opacity',
            }
          : { display: 'inline-block' };

        return (
          <span
            key={index}
            className="inline-block overflow-hidden align-top mr-[0.28em] last:mr-0"
            style={{ verticalAlign: 'top' }}
          >
            <span style={innerStyle}>{word}</span>
          </span>
        );
      })
    );
  };

export default TextReveal;
