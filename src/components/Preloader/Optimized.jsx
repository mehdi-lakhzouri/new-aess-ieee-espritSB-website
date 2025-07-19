'use client';
import { useEffect, useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';

// Optimisation des animations pour réduire TBT
const optimizedSlideUp = {
  initial: { 
    top: 0,
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
  },
  exit: { 
    top: "-100vh",
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1], delay: 0.2 }
  }
};

const optimizedOpacity = {
  initial: { opacity: 0 },
  enter: { 
    opacity: 1,
    transition: { duration: 0.3, delay: 0.1 }
  }
};

// Composant mémorisé pour éviter les re-renders
const PreloaderContent = memo(({ dimension }) => {
  const word = "Home";
  
  // Chemins SVG optimisés avec useMemo implicite
  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 200} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curve = {
    initial: { 
      d: initialPath, 
      transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } 
    },
    exit: { 
      d: targetPath, 
      transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1], delay: 0.2 } 
    }
  };

  return (
    <>
      <motion.div
        className="preloader-text"
        variants={optimizedOpacity}
        initial="initial"
        animate="enter"
      >
        <span className="text-white text-4xl md:text-6xl font-bold">Welcome</span>
        <span className="text-blue-400 text-4xl md:text-6xl font-bold"> To IEEE ESPRIT SB</span>
      </motion.div>
      
      <div className="legend text-gray-300 text-lg mt-4">
        One Name, One Legend
      </div>
      
      <svg className="svg-curve fixed inset-0 pointer-events-none">
        <motion.path 
          variants={curve} 
          initial="initial" 
          exit="exit"
          fill="rgb(15 23 42)" // slate-900
        />
      </svg>
    </>
  );
});

PreloaderContent.displayName = 'PreloaderContent';

function OptimizedPreloader() {
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  // Optimisation du resize avec useCallback et throttling
  const updateDimension = useCallback(() => {
    if (typeof window !== 'undefined') {
      setDimension({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    }
  }, []);

  useEffect(() => {
    // Initialisation immédiate
    updateDimension();
    
    // Throttled resize pour les performances
    let timeoutId;
    const throttledResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimension, 100);
    };
    
    window.addEventListener('resize', throttledResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(timeoutId);
    };
  }, [updateDimension]);

  return (
    <motion.div 
      variants={optimizedSlideUp} 
      initial="initial" 
      exit="exit" 
      className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center"
      style={{ willChange: 'transform' }} // Optimisation GPU
    >
      {dimension.width > 0 && (
        <PreloaderContent dimension={dimension} />
      )}
    </motion.div>
  );
}

export default memo(OptimizedPreloader);
