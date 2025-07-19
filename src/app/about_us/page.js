'use client';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
const Preloader = dynamic(() => import('../../components/Preloader'), { ssr: false });
const NightSkyBackground = dynamic(() => import('../../components/background/NightSkyBackground'), { ssr: false });
import Navbar from '../../components/navbar/Navbar';
import ExBoardItem from '../../components/excom/ExBoardItem';
import LocationSection from '../../components/location/LocationSection';
import StatisticsSection from '../../components/StatisticsSection';
import exboard from '../../assets/exboard.json';

export default function AboutUs() {
  const [preloading, setPreloading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    const preloadTimer = setTimeout(() => {
      setPreloading(false);

      const completeTimer = setTimeout(() => {
        setLoadingComplete(true);
      }, 500);

      return () => clearTimeout(completeTimer);
    }, 500);

    return () => clearTimeout(preloadTimer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      
      let resizeTimer;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          setWindowWidth(window.innerWidth);
        }, 150);
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        clearTimeout(resizeTimer);
      };
    }
  }, []);

return (
    <>
      <Head>
        <title>About Us | IEEE ESPRIT SB</title>
        <meta name="description" content="Découvrez l'équipe, les distinctions et l'impact d'IEEE ESPRIT Student Branch. Innovation, excellence et engagement !" />
        <meta property="og:title" content="About Us | IEEE ESPRIT SB" />
        <meta property="og:description" content="Découvrez l'équipe, les distinctions et l'impact d'IEEE ESPRIT Student Branch. Innovation, excellence et engagement !" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ieee-esprit.tn/about_us" />
        <meta property="og:image" content="https://ieee-esprit.tn/og-aboutus.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | IEEE ESPRIT SB" />
        <meta name="twitter:description" content="Découvrez l'équipe, les distinctions et l'impact d'IEEE ESPRIT Student Branch. Innovation, excellence et engagement !" />
        <meta name="twitter:image" content="https://ieee-esprit.tn/og-aboutus.jpg" />
        <link rel="canonical" href="https://ieee-esprit.tn/about_us" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "IEEE ESPRIT Student Branch",
            "url": "https://ieee-esprit.tn",
            "logo": "https://ieee-esprit.tn/ieee-logo.png",
            "sameAs": [
              "https://www.facebook.com/IEEE.ESPRIT.SB/",
              "https://www.instagram.com/ieee.esprit.sb/",
              "https://www.linkedin.com/company/ieee-esprit-sb/"
            ],
            "description": "Découvrez l'équipe, les distinctions et l'impact d'IEEE ESPRIT Student Branch. Innovation, excellence et engagement !"
          })
        }} />
      </Head>
      <AnimatePresence mode="wait">
        {preloading && <Preloader />}
      </AnimatePresence>
      {!preloading && <NightSkyBackground />}

      <main className="content-container" style={{ opacity: loadingComplete ? 1 : 0, transition: 'opacity 0.5s ease-in-out 0.3s' }}>
        <Navbar active="about" />
        
        {/* Meet the Team Section */}
        <section style={{
          padding: '2rem 0 3rem 0',
          position: 'relative',
          zIndex: 3
        }}>
          <h1 className="text-display" style={{
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
          }}>Our Executive Committee</h1>
          <h2 style={{
            fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            color: '#e6e6ff',
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
            fontWeight: 500,
            textAlign: 'center',
            marginBottom: '2.5em',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textShadow: '0 2px 12px rgba(230, 230, 255, 0.4)',
            opacity: 0.9
          }}>IEEE ESPRIT SB</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                windowWidth <= 600
                  ? '1fr'
                  : windowWidth <= 900
                  ? 'repeat(2, 1fr)'
                  : 'repeat(3, 1fr)',
              gap: '2.5rem 2rem',
              maxWidth: '1200px',
              margin: '0 auto',
              justifyItems: 'center',
              width: '100%',
            }}
          >
            {exboard.map((member, idx) => (
              <ExBoardItem
                key={member.name + idx}
                name={member.name}
                poste={member.poste}
                img={member.img}
                fb={member.fb}
                insta={member.insta}
                linkedin={member.linkedin}
              />
            ))}
          </div>
        </section>

        {/* Statistics Section */}
        <StatisticsSection />
        
        <LocationSection />
      </main>
    </>
  );
}