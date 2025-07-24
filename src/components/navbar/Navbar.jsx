import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './Navbar.scss';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Navbar({ active }) {
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

  // Animation variants pour le menu mobile
  const mobileMenuVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const menuItemVariants = {
    hidden: { 
      opacity: 0,
      x: -30,
      transition: {
        duration: 0.2
      }
    },
    visible: { 
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        delay: 0.1
      }
    }
  };

  if (isMobile) {
    return (
      <>
        <nav className="main-nav mobile-nav" aria-label="Main navigation">
          <div className="mobile-nav-header">
            <motion.div 
              className="logo mobile-logo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Image 
                src="/assets/logos/logo_w.png" 
                alt="IEEE Logo" 
                height={40} 
                width={80} 
                style={{ height: '40px', width: 'auto', display: 'block', objectFit: 'contain' }} 
                priority
              />
            </motion.div>
            
            <motion.button
              className={`burger-menu${menuOpen ? ' open' : ''}`}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              tabIndex={0}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="burger-bar" />
              <span className="burger-bar" />
              <span className="burger-bar" />
            </motion.button>
          </div>
        </nav>

        {/* Menu Mobile Overlay */}
        <AnimatePresence mode="wait">
          {menuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="mobile-menu-backdrop"
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={() => setMenuOpen(false)}
              />
              
              {/* Menu Content */}
              <motion.div
                className="mobile-menu"
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Header avec logo et bouton fermer */}
                <motion.div 
                  className="mobile-menu-header"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
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
                  
                  <motion.button
                    className="mobile-menu-close"
                    aria-label="Fermer le menu"
                    onClick={() => setMenuOpen(false)}
                    tabIndex={0}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} strokeWidth={2} />
                  </motion.button>
                </motion.div>

                {/* Navigation Links */}
                <motion.div className="mobile-menu-content">
                  <motion.ul className="mobile-nav-links">
                    {navLinks.map((link, index) => (
                      <motion.li 
                        key={link.href}
                        variants={menuItemVariants}
                        custom={index}
                      >
                        <Link
                          href={link.href}
                          className={(active ? active === link.label.toLowerCase() : pathname === link.href) ? 'active' : ''}
                          onClick={() => setMenuOpen(false)}
                        >
                          <motion.div 
                            className="link-content"
                            whileHover={{ x: 8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="link-icon">
                              <i className={link.icon} aria-hidden="true"></i>
                            </div>
                            <span className="link-text">{link.label}</span>
                            {(active ? active === link.label.toLowerCase() : pathname === link.href) && (
                              <motion.div 
                                className="active-indicator"
                                layoutId="mobile-active-indicator"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              />
                            )}
                          </motion.div>
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                  
                  {/* Register Button */}
                  <motion.div 
                    className="mobile-menu-footer"
                    variants={menuItemVariants}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link 
                        href="#" 
                        className="register-btn mobile-register-btn" 
                        onClick={() => setMenuOpen(false)}
                      >
                        <i className="fas fa-user-plus" aria-hidden="true"></i>
                        <span>Register now</span>
                        <motion.div
                          className="btn-shimmer"
                          animate={{
                            x: ['-100%', '100%']
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                            ease: 'linear'
                          }}
                        />
                      </Link>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
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
          <Link href="/" className={(active ? active === 'home' : pathname === '/') ? 'active' : ''}>
            <i className="fas fa-home"></i>
            Home
          </Link>
        </li>
        <li>
          <Link href="/about_us" className={(active ? active === 'about us' : pathname === '/about_us') ? 'active' : ''}>
            <i className="fas fa-users"></i>
            About Us
          </Link>
        </li>
        <li>
          <Link href="/events" className={(active ? active === 'events' : pathname === '/events') ? 'active' : ''}>
            <i className="fas fa-calendar-alt"></i>
            Events
          </Link>
        </li>
        <li>
          <Link href="/units" className={(active ? active === 'units' : pathname === '/units') ? 'active' : ''}>
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
