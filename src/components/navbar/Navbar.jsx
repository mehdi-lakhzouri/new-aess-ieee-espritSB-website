import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './Navbar.scss';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: 'fas fa-home' },
    { href: '/about_us', label: 'About Us', icon: 'fas fa-users' },
    { href: '/events', label: 'Events', icon: 'fas fa-calendar-alt' },
    { href: '/units', label: 'Units', icon: 'fas fa-sitemap' },
  ];

  if (isMobile) {
    return (
      <nav className="main-nav mobile-nav" aria-label="Main navigation">
        <div className="mobile-nav-header">
          <div className="logo mobile-logo">
            <Image 
              src="/assets/logos/logo_w.png" 
              alt="IEEE Logo" 
              height={36} 
              width={72} 
              style={{ height: '36px', width: 'auto', display: 'block', objectFit: 'contain' }} 
              priority
            />
          </div>
          <button
            className={`burger-menu${menuOpen ? ' open' : ''}`}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            tabIndex={0}
          >
            <span className="burger-bar" />
            <span className="burger-bar" />
            <span className="burger-bar" />
          </button>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="mobile-menu"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              <button
                className="mobile-menu-close"
                aria-label="Fermer le menu"
                onClick={() => setMenuOpen(false)}
                tabIndex={0}
              >
                &#10005;
              </button>
              <div className="mobile-menu-logo">
                <Image 
                  src="/assets/logos/logo_w.png" 
                  alt="IEEE Logo" 
                  height={48} 
                  width={96} 
                  style={{ height: '48px', width: 'auto', display: 'block', objectFit: 'contain' }} 
                  priority
                />
              </div>
              <ul className="mobile-nav-links">
                {navLinks.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={pathname === link.href ? 'active' : ''}
                      onClick={() => setMenuOpen(false)}
                    >
                      <i className={link.icon} aria-hidden="true"></i>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="#" className="register-btn mobile-register-btn" onClick={() => setMenuOpen(false)}>
                    <i className="fas fa-user-plus" aria-hidden="true"></i>
                    <span>Register now</span>
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    );
  }

  // Desktop version (inchangée)
  return (
    <nav className="main-nav">
      <div className="logo">
        <Image 
          src="/assets/logos/logo_w.png" 
          alt="IEEE Logo" 
          height={60} 
          width={120} 
          style={{ height: '100%', width: 'auto', display: 'block', objectFit: 'contain' }} 
        />
      </div>
      <ul className="nav-links desktop-nav">
        <li>
          <Link href="/" className={pathname === '/' ? 'active' : ''}>
            <i className="fas fa-home"></i>
            Home
          </Link>
        </li>
        <li>
          <Link href="/about_us" className={pathname === '/about_us' ? 'active' : ''}>
            <i className="fas fa-users"></i>
            About Us
          </Link>
        </li>
        <li>
          <Link href="/events" className={pathname === '/events' ? 'active' : ''}>
            <i className="fas fa-calendar-alt"></i>
            Events
          </Link>
        </li>
        <li>
          <Link href="/units" className={pathname === '/units' ? 'active' : ''}>
            <i className="fas fa-sitemap"></i>
            Units
          </Link>
        </li>
      </ul>
      <Link href="#" className="register-btn desktop-register">
        <i className="fas fa-user-plus"></i>
        Register now
      </Link>
    </nav>
  );
}
