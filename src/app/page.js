'use client';
import { useEffect, useState, useRef } from 'react';
import Typewriter from 'typewriter-effect';
import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
const Preloader = dynamic(() => import('../components/Preloader'), { ssr: false });
const NightSkyBackground = dynamic(() => import('../components/background/NightSkyBackground'), { ssr: false });
import Navbar from '../components/navbar/Navbar';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';




export default function Home() {
  const [preloading, setPreloading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const splineRef = useRef();

  useEffect(() => {
    const preloadTimer = setTimeout(() => {
      setPreloading(false);
      const completeTimer = setTimeout(() => setLoadingComplete(true), 500);
      return () => clearTimeout(completeTimer);
    }, 500);
    return () => clearTimeout(preloadTimer);
  }, []);

  function handleMouseMove(e) {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -((e.clientY / window.innerHeight) * 2 - 1);
    if (splineRef.current) {
      splineRef.current.emitEvent('setPosition', 'LookTarget', { x: x * 5, y: y * 2, z: 0 });
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {preloading && <Preloader />}
      </AnimatePresence>
      {!preloading && <NightSkyBackground />}
      <main className="content-container" style={{ opacity: loadingComplete ? 1 : 0, transition: 'opacity 0.5s ease-in-out 0.3s' }} onMouseMove={handleMouseMove}>
        <Navbar active="home" />

        

        
        
      </main>
    </>
  );
}
