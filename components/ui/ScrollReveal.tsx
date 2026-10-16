'use client';

import React, { useEffect, useRef, useState } from 'react';

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  duration?: number;
  viewportMargin?: string;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 40,
  duration = 0.6,
  viewportMargin = '-100px',
  once = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Only hide elements that are currently below the viewport
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

  const getOffset = () => {
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'none':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  const isAnimated = hidden;
  const isVisible = !hidden || revealed;

  const style: React.CSSProperties | undefined = isAnimated
    ? {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate3d(0, 0, 0)' : getOffset(),
        transitionProperty: 'opacity, transform',
        transitionDuration: `${duration}s`,
        transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
        transitionDelay: `${delay}s`,
        willChange: isVisible ? 'auto' : 'opacity, transform',
      }
    : undefined;

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
};

export interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delayChildren?: number;
  viewportMargin?: string;
  once?: boolean;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 0.12,
  delayChildren = 0,
  viewportMargin = '-80px',
  once = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Only hide if the container is currently below the viewport
    if (rect.top >= windowHeight) {
      const items = Array.from(container.children).filter(
        (child): child is HTMLElement => child.getAttribute('data-stagger-item') === 'true'
      );

      // Initially hide items and set up transition delays
      items.forEach((item, index) => {
        const dist = parseFloat(item.getAttribute('data-distance') || '30');
        const dur = parseFloat(item.getAttribute('data-duration') || '0.5');
        const totalDelay = delayChildren + index * staggerDelay;

        item.style.opacity = '0';
        item.style.transform = `translate3d(0, ${dist}px, 0)`;
        item.style.transitionProperty = 'opacity, transform';
        item.style.transitionDuration = `${dur}s`;
        item.style.transitionTimingFunction = 'cubic-bezier(0, 0, 0.2, 1)';
        item.style.transitionDelay = `${totalDelay}s`;
        item.style.willChange = 'opacity, transform';
      });

      const revealItems = () => {
        items.forEach((item) => {
          item.style.opacity = '1';
          item.style.transform = 'translate3d(0, 0, 0)';
        });
      };

      const hideItems = () => {
        items.forEach((item) => {
          const dist = parseFloat(item.getAttribute('data-distance') || '30');
          item.style.opacity = '0';
          item.style.transform = `translate3d(0, ${dist}px, 0)`;
        });
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              revealItems();
              if (once) {
                observer.unobserve(entry.target);
              }
            } else if (!once) {
              hideItems();
            }
          });
        },
        { rootMargin: viewportMargin }
      );

      observer.observe(container);
      return () => observer.disconnect();
    }
  }, [staggerDelay, delayChildren, viewportMargin, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  className = '',
  distance = 30,
  duration = 0.5,
}) => {
  return (
    <div
      data-stagger-item="true"
      data-distance={distance}
      data-duration={duration}
      className={className}
    >
      {children}
    </div>
  );
};
