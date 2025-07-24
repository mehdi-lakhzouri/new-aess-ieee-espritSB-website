'use client';
import { useCallback, useEffect, useState } from 'react';
import { Particles } from '@tsparticles/react';
import { loadAll } from '@tsparticles/all';
import { FaRocket, FaSatellite, FaUserAstronaut } from 'react-icons/fa';
import { GiPlanetCore, GiObservatory, GiUfo } from 'react-icons/gi';
import { SiJupyter } from 'react-icons/si';

function randomBetween(a, b) {
  return Math.random() * (b - a) + a;
}

export default function NightSkyBackground() {
  // Responsive: détecter la largeur de l'écran
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Paramètres responsive
  const isMobile = windowWidth < 600;

  // Cercles colorés pour le gradient
  const [coloredCircles, setColoredCircles] = useState([]);
  useEffect(() => {
    const base = isMobile ? 0.45 : 1;
    const colors = [
      { color: '#013A63', opacity: 0.7, size: 900 * base, x: 10, y: 60 },
      { color: '#0288D1', opacity: 0.5, size: 700 * base, x: 80, y: 30 },
      { color: '#FFC107', opacity: 0.15, size: 600 * base, x: 50, y: 10 },
      { color: '#025C99', opacity: 0.45, size: 900 * base, x: 55, y: 65 },
       // Cercle plus visible pour clarté
      { color: '#025C99', opacity: 0.3, size: 800 * base, x: 60, y: 80 },
      { color: '#FFFFFF', opacity: 0.08, size: 1000 * base, x: 50, y: 50 },
    ];
    setColoredCircles(colors.map((c, i) => ({ ...c, id: `circle-${i}` })));
  }, [isMobile]);

  // Étoiles marquantes, brillantes, peu nombreuses, tailles variées et animées
  const [stars, setStars] = useState([]);
  useEffect(() => {
    const starCount = isMobile ? 10 : 22;
    const newStars = [];
    const starColors = ['#fff', '#b8beea', '#eaf6ff', '#fffbe7', '#FFC107', '#FF69B4'];
    const sizes = isMobile ? [2, 4, 7] : [2, 4, 7, 12, 18];
    for (let i = 0; i < starCount; i++) {
      const x = randomBetween(5, 95);
      const y = randomBetween(5, 95);
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      const opacity = randomBetween(0.85, 1);
      const isGlowing = true;
      const moveX = randomBetween(-2, 2);
      const moveY = randomBetween(-2, 2);
      const duration = randomBetween(6, 16);
      newStars.push({
        id: `star-${i}`,
        x,
        y,
        size,
        color,
        opacity,
        isGlowing,
        moveX,
        moveY,
        duration
      });
    }
    setStars(newStars);
    const handleResize = () => setStars([]);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Particles satellites stylisés
  const particlesInit = useCallback(async (engine) => {
    await loadAll(engine);
  }, []);

  // Génération d'étoiles filantes
  const [shootingStars, setShootingStars] = useState([]);
  useEffect(() => {
    let interval;
    function createShootingStar() {
      const id = `shooting-star-${Date.now()}-${Math.random()}`;
      setShootingStars(prev => [
        ...prev,
        {
          id,
          x: randomBetween(10, 90),
          y: randomBetween(5, 30),
          duration: randomBetween(1.2, 2.2)
        }
      ]);
      setTimeout(() => {
        setShootingStars(prev => prev.filter(star => star.id !== id));
      }, 2200);
    }
    interval = setInterval(createShootingStar, randomBetween(isMobile ? 3500 : 2500, isMobile ? 7000 : 5000));
    return () => clearInterval(interval);
  }, [isMobile]);

  // Fusée direction alternée
  const [rocketDirection, setRocketDirection] = useState('right');
  useEffect(() => {
    let timeout;
    function toggleDirection() {
      setRocketDirection(dir => (dir === 'right' ? 'left' : 'right'));
      timeout = setTimeout(toggleDirection, 14000);
    }
    toggleDirection();
    return () => clearTimeout(timeout);
  }, []);

  // Ajout d'astronautes flottants
  const [floatingAstronauts, setFloatingAstronauts] = useState([
    {
      id: 'astro-2',
      x: 82, // coin bas droit
      y: 78,
      duration: 11
    }
  ]);

  // Responsive: tailles des planètes/icônes
  const planetSize = isMobile ? 120 : 340;
  const planet2Size = isMobile ? 70 : 180;
  const neptuneSize = isMobile ? 60 : 170;
  const saturnSize = isMobile ? 40 : 110;
  const jupiterSize = isMobile ? 36 : 80;
  const marsSize = isMobile ? 28 : 70;
  const ufo1Size = isMobile ? 28 : 54;
  const ufo2Size = isMobile ? 18 : 36;
  const astronautSize = isMobile ? 28 : 54;
  const satelliteSize = isMobile ? 24 : 48;
  const rocketSize = isMobile ? 16 : 28;

  return (
    <div className="night-sky fixed inset-0 -z-10" style={{ opacity: 1, transition: 'opacity 0.5s' }}>
      {/* Cercles colorés pour le gradient */}
      {coloredCircles.map(circle => (
        <div
          key={circle.id}
          style={{
            left: `${circle.x}%`,
            top: `${circle.y}%`,
            width: `${circle.size}px`,
            height: `${circle.size}px`,
            background: circle.color,
            opacity: circle.opacity,
            borderRadius: '50%',
            position: 'absolute',
            filter: 'blur(80px)',
            zIndex: 1,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        />
      ))}
      {/* Planète géante semi-transparente + anneau */}
      <div style={{
        position: 'absolute',
        left: isMobile ? '-40px' : '-120px',
        bottom: isMobile ? '-40px' : '-120px',
        zIndex: 2,
        opacity: 0.18,
        pointerEvents: 'none',
        filter: 'blur(0.5px) drop-shadow(0 0 60px #0288D1cc)'
      }}>
        <GiPlanetCore size={planetSize} color="#0288D1" />
        {/* Anneau SVG */}
        <svg width={planetSize} height={planetSize} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none' }}>
          <ellipse cx={planetSize/2} cy={planetSize*0.62} rx={planetSize*0.35} ry={planetSize*0.08} fill="none" stroke="#b8beea" strokeWidth={isMobile ? 2 : 6} opacity="0.18" />
        </svg>
      </div>
      {/* Planète violette coin haut droit */}
      <div style={{
        position: 'absolute',
        right: isMobile ? '-30px' : '-80px',
        top: isMobile ? '-30px' : '-80px',
        zIndex: 2,
        opacity: 0.13,
        pointerEvents: 'none',
        filter: 'blur(0.5px) drop-shadow(0 0 40px #6c2eb9cc)'
      }}>
        <GiPlanetCore size={planet2Size} color="#6c2eb9" />
      </div>
      {/* Télescope (remplacé par observatoire) en bas à droite */}
      <div style={{
        position: 'absolute',
        right: isMobile ? '2%' : '2%',
        bottom: isMobile ? '2%' : '2%',
        zIndex: 2,
        opacity: 0.18,
        pointerEvents: 'none',
      }}>
        <GiObservatory size={isMobile ? 32 : 64} color="#fff" />
      </div>
      {/* Orbite SVG (courbe blanche) */}
      <svg width={isMobile ? 180 : 400} height={isMobile ? 60 : 120} style={{ position: 'absolute', left: isMobile ? '10%' : '20%', top: isMobile ? '6%' : '10%', zIndex: 2, pointerEvents: 'none' }}>
        <path d={`M0,${isMobile ? 30 : 60} Q${isMobile ? 90 : 200},0 ${isMobile ? 180 : 400},${isMobile ? 30 : 60}`} stroke="#fff" strokeWidth={isMobile ? 1 : 2} fill="none" opacity="0.10" />
      </svg>
      {/* Satellite en orbite (rotation lente) */}
      <div style={{
        position: 'absolute',
        right: isMobile ? '8%' : '8%',
        top: isMobile ? '18%' : '18%',
        zIndex: 2,
        pointerEvents: 'none',
        animation: 'satellite-orbit 18s linear infinite',
        transformOrigin: `${satelliteSize+12}px ${satelliteSize+12}px`,
      }}>
        <FaSatellite size={satelliteSize} color="#fff" style={{ filter: 'drop-shadow(0 0 8px #fff8)' }} />
      </div>
      {/* Petite fusée discrète, direction alternée */}
      {rocketDirection === 'right' ? (
        <div style={{
          position: 'absolute',
          left: '0%',
          top: isMobile ? '80%' : '70%',
          zIndex: 2,
          pointerEvents: 'none',
          animation: 'rocket-move-right 14s linear infinite',
          opacity: 0.18,
        }}>
          <FaRocket size={rocketSize} color="#FFC107" style={{ filter: 'drop-shadow(0 0 8px #FFC10788)' }} />
        </div>
      ) : (
        <div style={{
          position: 'absolute',
          right: '0%',
          top: isMobile ? '50%' : '40%',
          zIndex: 2,
          pointerEvents: 'none',
          animation: 'rocket-move-left 14s linear infinite',
          opacity: 0.18,
          transform: 'scaleX(-1)',
        }}>
          <FaRocket size={rocketSize} color="#FFC107" style={{ filter: 'drop-shadow(0 0 8px #FFC10788)' }} />
        </div>
      )}
      {/* Plusieurs halos nébuleux/nuages cosmiques */}
      <div style={{
        position: 'absolute',
        left: isMobile ? '20%' : '30%',
        top: isMobile ? '12%' : '20%',
        width: isMobile ? '90px' : '180px',
        height: isMobile ? '45px' : '90px',
        zIndex: 1,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 60% 60%, #fff 0%, #6c2eb9 40%, transparent 100%)',
        opacity: 0.10,
        filter: 'blur(32px)',
      }} />
      <div style={{
        position: 'absolute',
        left: isMobile ? '40%' : '60%',
        bottom: isMobile ? '6%' : '10%',
        width: isMobile ? '110px' : '220px',
        height: isMobile ? '60px' : '120px',
        zIndex: 1,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 60% 60%, #fff 0%, #FFC107 40%, transparent 100%)',
        opacity: 0.09,
        filter: 'blur(32px)',
      }} />
      {/* Étoiles marquantes, brillantes, animées */}
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: `radial-gradient(circle, ${star.color} 60%, #fff0 100%)`,
            opacity: star.opacity,
            position: 'absolute',
            borderRadius: '50%',
            boxShadow: `0 0 ${star.size * 2.5}px ${star.size * 0.7}px ${star.color}, 0 0 12px 2px #fff8`,
            filter: 'blur(0.5px)',
            zIndex: 2,
            pointerEvents: 'none',
            animation: `star-move-${star.id} ${star.duration}s ease-in-out infinite alternate, twinkle-glow 7s infinite ease-in-out`,
          }}
        />
      ))}
      {/* Étoiles filantes animées */}
      {shootingStars.map(star => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: isMobile ? '60px' : '120px',
            height: '2px',
            background: 'linear-gradient(90deg, #fff, transparent)',
            opacity: 0.7,
            borderRadius: '2px',
            zIndex: 3,
            pointerEvents: 'none',
            animation: `shooting-star-move ${star.duration}s linear forwards`,
            filter: 'drop-shadow(0 0 8px #fff8)',
          }}
        />
      ))}
      {/* Particules satellites stylisés (polygones/étoiles) */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false },
          background: { color: { value: 'transparent' } },
          fpsLimit: 60,
          particles: {
            number: {
              value: isMobile ? 4 : 10,
              density: { enable: true, area: 800 },
            },
            color: { value: ['#fff', '#e0e0e0', '#FFC107', '#b8beea'] },
            shape: {
              type: ['star', 'polygon'],
              options: {
                star: {
                  sides: 5,
                },
                polygon: {
                  sides: 4,
                },
              },
            },
            opacity: {
              value: 0.95,
              random: false,
            },
            size: {
              value: { min: isMobile ? 8 : 18, max: isMobile ? 18 : 32 },
              random: true,
            },
            move: {
              enable: true,
              speed: 0.25,
              direction: 'none',
              random: true,
              straight: false,
              outModes: { default: 'out' },
            },
            stroke: {
              width: 2,
              color: '#fff',
            },
            shadow: {
              enable: true,
              color: '#fff',
              blur: 10,
            },
          },
          detectRetina: true,
        }}
      />
      {/* Ajout d'astronautes flottants */}
      {floatingAstronauts.map(astro => (
        <div
          key={astro.id}
          style={{
            position: 'absolute',
            left: `${astro.x}%`,
            top: `${astro.y}%`,
            zIndex: 3,
            pointerEvents: 'none',
            animation: `astro-float ${astro.duration}s ease-in-out infinite`,
          }}
        >
          <FaUserAstronaut size={astronautSize} color="#fff" style={{ filter: 'drop-shadow(0 0 16px #fff)' }} />
        </div>
      ))}
      {/* Neptune (bleu, coin bas droit) */}
      <div
        aria-hidden="true"
        role="presentation"
        style={{
          position: 'absolute',
          right: isMobile ? '-30px' : '-90px',
          bottom: isMobile ? '-30px' : '-80px',
          zIndex: 2,
          opacity: 0.16,
          pointerEvents: 'none',
          filter: 'blur(0.5px) drop-shadow(0 0 40px #3a7bd5cc)',
        }}
      >
        <GiPlanetCore size={neptuneSize} color="#3a7bd5" />
      </div>
      {/* Saturne (anneaux, coin haut gauche) */}
      <div
        aria-hidden="true"
        role="presentation"
        style={{
          position: 'absolute',
          left: isMobile ? '-20px' : '-60px',
          top: isMobile ? '4%' : '10%',
          zIndex: 2,
          opacity: 0.13,
          pointerEvents: 'none',
          filter: 'blur(0.5px) drop-shadow(0 0 30px #e6c97bcc)',
        }}
      >
        <GiPlanetCore size={saturnSize} color="#e6c97b" />
        <svg width={saturnSize} height={saturnSize} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden="true" role="presentation">
          <ellipse cx={saturnSize/2} cy={saturnSize*0.64} rx={saturnSize*0.44} ry={saturnSize*0.09} fill="none" stroke="#b8beea" strokeWidth={isMobile ? 1.5 : 4} opacity="0.18" />
        </svg>
      </div>
      {/* Jupiter (milieu gauche) */}
      <div
        aria-hidden="true"
        role="presentation"
        style={{
          position: 'absolute',
          left: isMobile ? '8%' : '8%',
          top: isMobile ? '60%' : '38%',
          zIndex: 2,
          opacity: 0.13,
          pointerEvents: 'none',
          filter: 'blur(0.5px) drop-shadow(0 0 30px #e07a5fcc)',
        }}
      >
        <SiJupyter size={jupiterSize} color="#e07a5f" />
      </div>
      {/* Mars (rouge, coin haut droit) */}
      <div
        aria-hidden="true"
        role="presentation"
        style={{
          position: 'absolute',
          right: isMobile ? '-18px' : '-50px',
          top: isMobile ? '12%' : '8%',
          zIndex: 2,
          opacity: 0.13,
          pointerEvents: 'none',
          filter: 'blur(0.5px) drop-shadow(0 0 30px #ff4c4ccc)',
        }}
      >
        <GiPlanetCore size={marsSize} color="#ff4c4c" />
      </div>
      {/* OVNI 1 animé (gauche vers droite) */}
      <div
        aria-hidden="true"
        role="presentation"
        style={{
          position: 'absolute',
          left: isMobile ? '-30px' : '-80px',
          top: isMobile ? '20%' : '30%',
          zIndex: 4,
          opacity: 0.22,
          pointerEvents: 'none',
          animation: 'ufo-move-right 18s linear infinite',
        }}
      >
        <GiUfo size={ufo1Size} color="#fff" style={{ filter: 'drop-shadow(0 0 12px #fff8)' }} />
      </div>
      {/* OVNI 2 animé (droite vers gauche, plus petit) */}
      <div
        aria-hidden="true"
        role="presentation"
        style={{
          position: 'absolute',
          right: isMobile ? '-20px' : '-60px',
          top: isMobile ? '70%' : '60%',
          zIndex: 4,
          opacity: 0.18,
          pointerEvents: 'none',
          animation: 'ufo-move-left 22s linear infinite',
        }}
      >
        <GiUfo size={ufo2Size} color="#b8beea" style={{ filter: 'drop-shadow(0 0 8px #b8beea88)' }} />
      </div>
      {/* Animations keyframes pour le mouvement des étoiles, satellite, fusée, étoiles filantes */}
      <style jsx global>{`
        ${stars.map(star => `
          @keyframes star-move-${star.id} {
            0% { transform: translate(-50%, -50%) translate(0px, 0px); }
            100% { transform: translate(-50%, -50%) translate(${star.moveX}px, ${star.moveY}px); }
          }
        `).join('')}
        @keyframes satellite-orbit {
          0% { transform: rotate(0deg) translateY(0); }
          100% { transform: rotate(360deg) translateY(0); }
        }
        @keyframes rocket-move-right {
          0% { left: 0%; top: ${isMobile ? '80%' : '70%'}; opacity: 0.18; }
          10% { opacity: 0.25; }
          90% { opacity: 0.25; }
          100% { left: 100vw; top: ${isMobile ? '50%' : '40%'}; opacity: 0.05; }
        }
        @keyframes rocket-move-left {
          0% { right: 0%; top: ${isMobile ? '50%' : '40%'}; opacity: 0.18; }
          10% { opacity: 0.25; }
          90% { opacity: 0.25; }
          100% { right: 100vw; top: ${isMobile ? '80%' : '70%'}; opacity: 0.05; }
        }
        @keyframes shooting-star-move {
          0% { opacity: 0; transform: translateX(0); }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; transform: translateX(${isMobile ? 90 : 180}px); }
        }
        @keyframes astro-float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-${isMobile ? 12 : 24}px); }
          100% { transform: translateY(0); }
        }
        @keyframes astro-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes ufo-move-right {
          0% { left: ${isMobile ? '-30px' : '-80px'}; top: ${isMobile ? '20%' : '30%'}; opacity: 0.22; }
          10% { opacity: 0.32; }
          90% { opacity: 0.32; }
          100% { left: 110vw; top: ${isMobile ? '30%' : '38%'}; opacity: 0.05; }
        }
        @keyframes ufo-move-left {
          0% { right: ${isMobile ? '-20px' : '-60px'}; top: ${isMobile ? '70%' : '60%'}; opacity: 0.18; }
          10% { opacity: 0.28; }
          90% { opacity: 0.28; }
          100% { right: 110vw; top: ${isMobile ? '50%' : '48%'}; opacity: 0.05; }
        }
      `}</style>
    </div>
  );
}
