'use client';
import { useEffect, useState, useRef } from 'react';

interface StatisticItemProps {
  number: number;
  label: string;
  delay: number;
  showPlus?: boolean;
}

const StatisticItem = ({ number, label, delay, showPlus = false }: StatisticItemProps) => {
  const [displayNumber, setDisplayNumber] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.3 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      const duration = 2000; // 2 seconds
      const startTime = Date.now();
      const startValue = 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.round(startValue + (number - startValue) * easeOutQuart);
        
        setDisplayNumber(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, number, delay]);

  return (
    <div
      ref={itemRef}
      className={`statistic-item ${isVisible ? 'animate-in' : ''}`}
      style={{
        background: 'rgba(10, 11, 48, 0.4)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        border: '1px solid rgba(184, 190, 234, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 20px rgba(184, 190, 234, 0.1)',
        transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${delay}ms`,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '220px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Subtle gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(184, 190, 234, 0.05) 0%, rgba(30, 28, 124, 0.05) 100%)',
          borderRadius: '20px',
          pointerEvents: 'none'
        }}
      />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
            fontWeight: 800,
            fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            color: '#ffffff',
            marginBottom: '0.5rem',
            textShadow: '0 2px 20px rgba(255, 255, 255, 0.3)',
            lineHeight: 1
          }}
          aria-live="polite"
          aria-label={`${number} ${label}`}
        >
          {showPlus ? `+${displayNumber.toLocaleString()}` : displayNumber.toLocaleString()}
        </div>
        <div
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: '#e6e6ff',
            fontWeight: 500,
            fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            lineHeight: 1.2,
            textShadow: '0 2px 12px rgba(230, 230, 255, 0.4)'
          }}
        >
          {label}
        </div>
      </div>

      {/* Hover glow effect */}
      <style jsx>{`
        .statistic-item:hover {
          transform: translateY(-8px) scale(1.02) !important;
          border-color: rgba(184, 190, 234, 0.4);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(184, 190, 234, 0.2);
        }
      `}</style>
      
      {/* Global responsive styles */}
      <style jsx global>{`
        .statistics-grid {
          display: grid !important;
          grid-template-columns: repeat(1, 1fr) !important;
          gap: 1.5rem !important;
        }
        
        @media (min-width: 640px) {
          .statistics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 2rem !important;
          }
        }
        
        @media (min-width: 768px) {
          .statistics-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        
        @media (min-width: 1024px) {
          .statistics-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: clamp(1.5rem, 3vw, 2rem) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default function StatisticsSection() {
  const statistics = [
    { number: 50, label: 'Members', showPlus: true },
    { number: 25, label: 'Annual Activities', showPlus: true },
    { number: 1, label: 'Awards', showPlus: false },
    { number: 2022, label: 'Foundation', showPlus: false }
  ];

  return (
    <section
      style={{
        padding: '4rem 0',
        position: 'relative',
        zIndex: 3,
        maxWidth: '1200px',
        margin: '0 auto'
      }}
      aria-labelledby="statistics-heading"
    >
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2
          id="statistics-heading"
          style={{
            fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
            color: '#ffffff',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
            textAlign: 'center',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f0ff 50%, #ffffff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 20px rgba(255, 255, 255, 0.3)',
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
          }}
        >
          Our Impact in Numbers
        </h2>
        <p
          style={{
            fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            color: '#e6e6ff',
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            fontWeight: 500,
            letterSpacing: '0.06em',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto',
            textAlign: 'center',
            textShadow: '0 2px 12px rgba(230, 230, 255, 0.4)'
          }}
        >
          Driving innovation and excellence across the IEEE community
        </p>
      </header>

      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: '1.5rem',
          padding: '0 1rem'
        }}
        className="statistics-grid"
        role="list"
        aria-label="IEEE ESPRIT SB statistics"
      >
        {statistics.map((stat, index) => (
          <div key={stat.label} role="listitem">
            <StatisticItem
              number={stat.number}
              label={stat.label}
              delay={index * 150}
              showPlus={stat.showPlus}
            />
          </div>
        ))}
      </dl>
    </section>
  );
}