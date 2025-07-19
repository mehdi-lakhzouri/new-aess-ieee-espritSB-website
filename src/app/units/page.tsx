'use client';
import { useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Users, Calendar, Globe, ArrowRight, Sparkles, Zap, Target } from 'lucide-react';
import dynamic from 'next/dynamic';
const Preloader = dynamic(() => import('../../components/Preloader'), { ssr: false });
const NightSkyBackground = dynamic(() => import('../../components/background/NightSkyBackground'), { ssr: false });
import Navbar from '../../components/navbar/Navbar';
import unitsData from './units.json';
import './units.scss';

interface Unit {
  name: string;
  subName: string;
  description: string;
  url: string;
  website: string;
  numberOfMembers: number;
  numberOfActivities: number;
  foundation: string;
  color: string;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
  opacity: number;
  isGlowing: boolean;
}

interface ShootingStar {
  id: number;
  x: number;
  y: number;
  duration: number;
}

interface ColoredCircle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
}

export default function UnitsPage() {
  const [preloading, setPreloading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const units = useMemo(() => Object.entries(unitsData as Record<string, Unit>), []);

  // Generate colored circles for background
  useEffect(() => {
    const generateColoredCircles = () => {
      const colors = {
        darkBlue: '#0a0b30',
        mediumBlue: '#141654',
        brightBlue: '#1e1c7c',
        purple: '#2c1a5a'
      };
      
      const newCircles = [
        { id: 0, x: -10, y: 50, size: 800, opacity: 0.8, color: colors.darkBlue },
        { id: 1, x: 110, y: 50, size: 800, opacity: 0.8, color: colors.purple },
        { id: 2, x: 50, y: 0, size: 700, opacity: 0.7, color: colors.mediumBlue },
        { id: 3, x: 50, y: 100, size: 500, opacity: 0.7, color: colors.brightBlue },
        { id: 4, x: 80, y: 25, size: 500, opacity: 0.2, color: colors.purple },
        { id: 5, x: 20, y: 75, size: 500, opacity: 0.4, color: colors.mediumBlue }
      ];
      
      // setColoredCircles(newCircles); // This state was removed
    };
    
    generateColoredCircles();
    
    setTimeout(() => {
      setPreloading(false);
      setTimeout(() => setLoadingComplete(true), 300);
    }, 2000);
  }, []);

  // Generate stars
  useEffect(() => {
    const generateStars = () => {
      const starCount = Math.min(200, Math.floor(window.innerWidth * window.innerHeight / 8000));
      const newStars = [];
      const starColors = ['#FDFDFD', '#b8beea', '#e2e8f0'];
      const glowingStarsCount = Math.floor(starCount * 0.08);
      
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2.5 + 0.8;
        const delay = Math.random() * 6;
        const color = starColors[Math.floor(Math.random() * starColors.length)];
        const opacity = Math.random() * 0.7 + 0.3;
        const isGlowing = i < glowingStarsCount;
        
        // newStars.push({ id: i, x, y, size, delay, color, opacity, isGlowing }); // This state was removed
      }
      
      // setStars(newStars); // This state was removed
    };
    
    generateStars();
    
    const handleResize = () => generateStars();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Create shooting stars
  useEffect(() => {
    let shootingStarId = 0;
    
    const createShootingStar = () => {
      const x = Math.random() * 40;
      const y = Math.random() * 25;
      const duration = Math.random() * 3 + 2.5;
      
      // const newShootingStar = { id: shootingStarId++, x, y, duration }; // This state was removed
      
      // setShootingStars(prev => [...prev, newShootingStar]); // This state was removed
      
      setTimeout(() => {
        // setShootingStars(prev => prev.filter(star => star.id !== newShootingStar.id)); // This state was removed
      }, duration * 1000);
    };
    
    createShootingStar();
    
    const interval = setInterval(() => {
      createShootingStar();
    }, Math.random() * 4000 + 4000);
    
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for card animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // _setVisibleCards(prev => new Set([...prev, entry.target.id])); // This state was removed
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const cards = document.querySelectorAll('.unit-card');
    cards.forEach(card => observer.observe(card));

    return () => observer.disconnect();
  }, [loadingComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.9,
      rotateX: 15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 10,
        delay: 0.2
      }
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {preloading && <Preloader />}
      </AnimatePresence>
      {!preloading && <NightSkyBackground />}
      {/* Main content container */}
      <main className="content-container" style={{ opacity: loadingComplete ? 1 : 0, transition: 'opacity 0.5s ease-in-out 0.3s' }}>
        <Navbar active="units" />

        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: loadingComplete ? 1 : 0, y: loadingComplete ? 0 : 50 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="hero-section"
          style={{ 
            textAlign: 'center', 
            marginBottom: '4rem',
            marginTop: '6rem',
            padding: '0 1rem'
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="hero-badge"
          >
            <Sparkles className="inline-block w-6 h-6 mr-2 text-blue-400" />
            <span className="text-blue-300 font-medium tracking-wider text-sm uppercase">
              Discover our units
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
            className="hero-title text-display"
            style={{
              fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
              color: '#ffffff',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: '1.1',
              textAlign: 'center',
              marginBottom: '1rem',
              padding: '0 1rem',
              wordBreak: 'break-word',
              hyphens: 'auto',
              background: 'linear-gradient(135deg, #ffffff 0%, #e6e6ff 50%, #ffffff 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 20px rgba(255, 255, 255, 0.3)',
              filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
            }}
          >
            Our Units
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="hero-subtitle text-body-large"
            style={{
              maxWidth: '800px',
              margin: '0 auto 1rem auto',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              lineHeight: '1.6',
              fontWeight: 400,
              color: 'var(--text-secondary)',
              textAlign: 'center',
              letterSpacing: '0.01em'
            }}
          >
            Explore our various IEEE Technical Societies, each dedicated to a specialized area of ​​engineering and technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="stats-container"
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
              marginBottom: '2rem'
            }}
          >
            <div className="stat-item">
              <div className="stat-number">{units.length}</div>
              <div className="stat-label">Units</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {units.reduce((sum, [, unit]) => sum + unit.numberOfMembers, 0)}
              </div>
              <div className="stat-label">Members</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {units.reduce((sum, [, unit]) => sum + unit.numberOfActivities, 0)}
              </div>
              <div className="stat-label">Activities</div>
            </div>
          </motion.div>
        </motion.section>

        {/* Units Grid */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate={loadingComplete ? "visible" : "hidden"}
          className="units-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
            gap: '2rem',
            padding: '0 1rem',
            marginBottom: '4rem'
          }}
        >
          {units.map(([key, unit]) => (
            <motion.div
              key={key}
              id={`unit-${key}`}
              variants={cardVariants}
              className="unit-card"
              onMouseEnter={() => setHoveredCard(key)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: `linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.12) 0%, 
                  rgba(255, 255, 255, 0.06) 50%,
                  rgba(255, 255, 255, 0.03) 100%)`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${hoveredCard === key ? unit.color + '40' : 'rgba(255, 255, 255, 0.15)'}`,
                borderRadius: '24px',
                padding: '2rem',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hoveredCard === key ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                boxShadow: hoveredCard === key 
                  ? `0 25px 50px ${unit.color}25, 0 0 0 1px ${unit.color}20, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                  : '0 8px 32px rgba(0, 0, 0, 0.12)',
                minHeight: '420px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Animated background gradient */}
              <motion.div
                className="card-bg-gradient"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at 50% 0%, ${unit.color}15 0%, transparent 70%)`,
                  opacity: hoveredCard === key ? 1 : 0,
                  transition: 'opacity 0.4s ease'
                }}
              />

              {/* Card Header */}
              <div className="card-header" style={{ position: 'relative', zIndex: 2, marginBottom: '1.5rem' }}>
                <motion.div
                  variants={iconVariants}
                  className="unit-icon"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${unit.color}20, ${unit.color}10)`,
                    border: `2px solid ${unit.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <motion.div
                    animate={hoveredCard === key ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <Zap 
                      size={28} 
                      style={{ color: unit.color }} 
                    />
                  </motion.div>
                  
                  {/* Animated shine effect */}
                  <motion.div
                    className="shine-effect"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      transform: hoveredCard === key ? 'translateX(200%)' : 'translateX(-100%)',
                      transition: 'transform 0.6s ease'
                    }}
                  />
                </motion.div>

                <div>
                  <h3 className="unit-name" style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '0.5rem',
                    fontFamily: 'var(--font-display, "Playfair Display", serif)'
                  }}>
                    {unit.name}
                  </h3>
                  <p className="unit-subname" style={{
                    fontSize: '0.95rem',
                    color: unit.color,
                    fontWeight: '500',
                    lineHeight: '1.4'
                  }}>
                    {unit.subName}
                  </p>
                </div>
              </div>

              {/* Card Content */}
              <div className="card-content" style={{ flex: 1, position: 'relative', zIndex: 2 }}>
                <p className="unit-description" style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  lineHeight: '1.6',
                  fontSize: '0.95rem',
                  marginBottom: '1.5rem'
                }}>
                  {unit.description.length > 150 
                    ? unit.description.substring(0, 150) + '...' 
                    : unit.description}
                </p>

                {/* Stats */}
                <div className="unit-stats" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div className="stat" style={{ textAlign: 'center' }}>
                    <Users size={16} style={{ color: unit.color, marginBottom: '0.25rem' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fff' }}>
                      {unit.numberOfMembers}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                      Members
                    </div>
                  </div>
                  <div className="stat" style={{ textAlign: 'center' }}>
                    <Target size={16} style={{ color: unit.color, marginBottom: '0.25rem' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fff' }}>
                      {unit.numberOfActivities}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                      Activity
                    </div>
                  </div>
                  <div className="stat" style={{ textAlign: 'center' }}>
                    <Calendar size={16} style={{ color: unit.color, marginBottom: '0.25rem' }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#fff' }}>
                      {unit.foundation}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
                      founded
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="card-footer" style={{ 
                position: 'relative', 
                zIndex: 2,
                display: 'flex',
                gap: '0.75rem',
                marginTop: 'auto'
              }}>
                <motion.a
                  href={unit.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    background: `linear-gradient(135deg, ${unit.color}, ${unit.color}dd)`,
                    color: '#ffffff',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    border: 'none'
                  }}
                >
                  <Globe size={16} />
                  Website
                </motion.a>
                
                <motion.a
                  href={unit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#ffffff',
                    border: `1px solid ${unit.color}40`,
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <ExternalLink size={16} />
                  Facebook
                </motion.a>
              </div>

              {/* Hover effect overlay */}
              <motion.div
                className="hover-overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(135deg, ${unit.color}08, transparent)`,
                  opacity: hoveredCard === key ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                  borderRadius: '24px'
                }}
              />
            </motion.div>
          ))}
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: loadingComplete ? 1 : 0, y: loadingComplete ? 0 : 50 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="cta-section"
          style={{
            textAlign: 'center',
            padding: '4rem 1rem',
            marginBottom: '2rem'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.7 }}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '24px',
              padding: '3rem 2rem',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            <h2 style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '1rem',
              fontFamily: 'var(--font-display, "Playfair Display", serif)'
            }}>
              Join us! 
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              marginBottom: '2rem'
            }}>
             Discover your passion and develop your skills within our IEEE units.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(99, 102, 241, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '16px',
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              learn more
              <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </motion.section>
      </main>
    </>
  );
}