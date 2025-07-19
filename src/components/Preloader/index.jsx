'use client';
import styles from './style.module.scss';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { opacity, slideUp } from './anim';

export default function Index() {
  const word = "Home";
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    }
    setDimension({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curve = {
    initial: { d: initialPath, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } },
    exit: { d: targetPath, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 } }
  };

  return (
    <motion.div variants={slideUp} initial="initial" exit="exit" className={styles.introduction}>
      {dimension.width > 0 &&
        <>
          <motion.div
            className={styles.preloaderText}
            variants={opacity}
            initial="initial"
            animate="enter"
          >
            <span className={styles.white}>Welcome</span>
            <span className={styles.red}> To IEEE ESPRIT SB</span>
          </motion.div>
          <div className={styles.legend}>
            One Name, One Legend
          </div>
          <svg className={styles.svg_curve}>
            <motion.path variants={curve} initial="initial" exit="exit"></motion.path>
          </svg>
        </>
      }
    </motion.div>
  );
}
