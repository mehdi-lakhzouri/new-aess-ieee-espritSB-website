'use client';
import { useEffect, useState, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Navbar from '../../components/navbar/Navbar';
import eventsData from '../../assets/events.json';
import './events.css';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Pagination from '../../components/events/Pagination';

// Import sophisticated icon components
import { 
  SearchIcon, 
  CalendarIcon, 
  LocationIcon, 
  SparklesIcon,
  AcademicCapIcon,
  TrophyIcon,
  UserGroupIcon,
  ArrowRightIcon,
  FilterIcon,
  EventIcon
} from '../../components/EventIcons';

// Import dynamique de react-select pour réduire le JS runtime côté client
const Select = dynamic(() => import('react-select'), { ssr: false });
const Preloader = dynamic(() => import('../../components/Preloader'), { ssr: false });
const NightSkyBackground = dynamic(() => import('../../components/background/NightSkyBackground'), { ssr: false });

export default function EventsPage() {
  const [preloading, setPreloading] = useState(true);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [events, setEvents] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [_windowWidth, setWindowWidth] = useState(1200);
  const splineRef = useRef();

  // Debounced search state
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  // Pagination state
  const pageSizeOptions = [
    { value: 6, label: '6 per page' },
    { value: 12, label: '12 per page' },
    { value: 24, label: '24 per page' },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0].value);

  // Reset page to 1 when filter/search/pageSize changes
  useEffect(() => { setCurrentPage(1); }, [activeFilter, debouncedSearch, pageSize]);

  useEffect(() => {
    const preloadTimer = setTimeout(() => {
      setPreloading(false);

      const completeTimer = setTimeout(() => {
        setLoadingComplete(true);
      }, 500);

      // Clear second timer if component unmounts before it fires
      return () => clearTimeout(completeTimer);
    }, 500);

    // Clear first timer if component unmounts before it fires
    return () => clearTimeout(preloadTimer);
  }, []);

  // Load events data
  useEffect(() => {
    setEvents(eventsData);
  }, []);

  // Debounce effect for search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Memoized filtered events for performance
  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (debouncedSearch) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        event.description.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        event.location.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }
    if (activeFilter !== 'all') {
      filtered = filtered.filter(event => {
        switch(activeFilter) {
          case 'workshops':
            return event.title.toLowerCase().includes('workshop') || event.description.toLowerCase().includes('workshop');
          case 'competitions':
            return event.title.toLowerCase().includes('hack') || event.title.toLowerCase().includes('competition') || event.description.toLowerCase().includes('hackathon');
          case 'social':
            return event.title.toLowerCase().includes('iftar') || event.title.toLowerCase().includes('team') || event.title.toLowerCase().includes('social');
          default:
            return true;
        }
      });
    }
    return filtered;
  }, [events, activeFilter, debouncedSearch]);

  // Pagination logic
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEvents.slice(start, start + pageSize);
  }, [filteredEvents, currentPage, pageSize]);
  const pageCount = Math.ceil(filteredEvents.length / pageSize);

  function handleMouseMove(e) {
    // Get normalized mouse coordinates (-1 to 1)
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -((e.clientY / window.innerHeight) * 2 - 1);

    // Adjust these values to fit your scene's scale and camera
    const lookTargetPosition = { x: x * 5, y: y * 2, z: 0 };

    // Move the null object in Spline
    if (splineRef.current) {
      splineRef.current.emitEvent('setPosition', 'LookTarget', lookTargetPosition);
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Events - Page {currentPage} | IEEE ESPRIT SB</title>
        <meta name="description" content={`Découvrez nos événements - Page ${currentPage}`} />
        {/* SEO: Open Graph & Twitter */}
        <meta property="og:title" content="Events | IEEE ESPRIT SB" />
        <meta property="og:description" content="Découvrez nos événements, workshops et compétitions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ieee-esprit.tn/events" />
        <meta property="og:image" content="https://ieee-esprit.tn/og-events.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Events | IEEE ESPRIT SB" />
        <meta name="twitter:description" content="Découvrez nos événements, workshops et compétitions." />
        <meta name="twitter:image" content="https://ieee-esprit.tn/og-events.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://ieee-esprit.tn/events" />
        {/* JSON-LD Event Schema */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": "IEEE ESPRIT Events",
            "startDate": events[0]?.date,
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
            "location": {
              "@type": "Place",
              "name": events[0]?.location,
              "address": "ESPRIT, Tunis"
            },
            "image": [
              "https://ieee-esprit.tn/og-events.jpg"
            ],
            "description": "Découvrez nos événements, workshops et compétitions.",
            "organizer": {
              "@type": "Organization",
              "name": "IEEE ESPRIT SB",
              "url": "https://ieee-esprit.tn"
            }
          })
        }} />
      </Head>
      <AnimatePresence mode="wait">
        {preloading && <Preloader />}
      </AnimatePresence>
      
      <NightSkyBackground />

      {/* Main content container */}
      <main className="content-container" style={{ opacity: loadingComplete ? 1 : 0, transition: 'opacity 0.5s ease-in-out 0.3s' }} onMouseMove={handleMouseMove}>
        {/* Navigation */}
        <Navbar active="events" />

        {/* Events content */}
        <section style={{ padding: '2rem', minHeight: '100vh', marginTop: '100px' }}>
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: loadingComplete ? 1 : 0, y: loadingComplete ? 0 : 50 }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ textAlign: 'center', marginBottom: '5rem' }}
          >
            {/* Elegant Overline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: loadingComplete ? 1 : 0, y: loadingComplete ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                fontWeight: '500',
                letterSpacing: 'var(--letter-widest)',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <SparklesIcon size={16} className="icon-pulse" />
              IEEE ESPRIT Student Branch
              <SparklesIcon size={16} className="icon-pulse" />
            </motion.div>

            {/* Main Title with Sophisticated Typography */}
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
            }}>
              Extraordinary Events
            </h1>

            {/* Refined Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: loadingComplete ? 1 : 0, y: loadingComplete ? 0 : 30 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="text-body-large"
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
              Discover the remarkable journey of innovation, collaboration, and excellence through our 
              carefully curated collection of events, workshops, and community gatherings.
            </motion.p>

            {/* Call-to-Action Metrics */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: loadingComplete ? 1 : 0, scale: loadingComplete ? 1 : 0.9 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              style={{
                display: 'flex',
                gap: '2rem',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: '2rem'
              }}
            >
              {[
                { icon: EventIcon, number: '50+', label: 'Events' },
                { icon: UserGroupIcon, number: '500+', label: 'Participants' },
                { icon: TrophyIcon, number: '25+', label: 'Awards' }
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.25rem',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '2rem',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <metric.icon size={18} className="icon-hover-glow" />
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-lg)',
                    fontWeight: '700',
                    color: 'var(--text-primary)'
                  }}>
                    {metric.number}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '500',
                    color: 'var(--text-tertiary)',
                    letterSpacing: 'var(--letter-wide)'
                  }}>
                    {metric.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Search and Filter Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: loadingComplete ? 1 : 0, y: loadingComplete ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '2.5rem', 
              marginBottom: '4rem' 
            }}
          >
            {/* Premium Search Bar */}
            <motion.div 
              style={{ position: 'relative', width: '100%', maxWidth: '600px' }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="text"
                placeholder="Search events by title, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1.25rem 4rem 1.25rem 1.5rem',
                  borderRadius: '2rem',
                  border: '2px solid rgba(255, 255, 255, 0.12)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  fontWeight: '400',
                  letterSpacing: 'var(--letter-normal)',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  outline: 'none',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(63, 81, 181, 0.1), 0 8px 30px rgba(63, 81, 181, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
              />
              <motion.div 
                style={{
                  position: 'absolute',
                  right: '1.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <SearchIcon size={22} className="icon-hover-glow" />
              </motion.div>
            </motion.div>

            {/* Sophisticated Filter Buttons */}
            <motion.div 
              style={{ 
                display: 'flex', 
                gap: '1rem', 
                flexWrap: 'wrap', 
                justifyContent: 'center',
                alignItems: 'center'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: loadingComplete ? 1 : 0, y: loadingComplete ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              {/* Filter Label */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginRight: '1rem'
              }}>
                <FilterIcon size={18} className="icon-hover-lift" />
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500',
                  color: 'var(--text-tertiary)',
                  letterSpacing: 'var(--letter-wide)',
                  textTransform: 'uppercase'
                }}>
                  Filter by
                </span>
              </div>

              {/* Filter Options */}
              {[
                { key: 'all', label: 'All Events', icon: SparklesIcon },
                { key: 'workshops', label: 'Workshops', icon: AcademicCapIcon },
                { key: 'competitions', label: 'Competitions', icon: TrophyIcon },
                { key: 'social', label: 'Social', icon: UserGroupIcon }
              ].map((filter) => (
                <motion.button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '0.875rem 1.5rem',
                    borderRadius: '2rem',
                    border: '2px solid transparent',
                    background: activeFilter === filter.key 
                      ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' 
                      : 'rgba(255, 255, 255, 0.08)',
                    color: activeFilter === filter.key ? '#ffffff' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '600',
                    letterSpacing: 'var(--letter-normal)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backdropFilter: 'blur(20px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: activeFilter === filter.key 
                      ? '0 8px 25px rgba(63, 81, 181, 0.3)' 
                      : '0 4px 15px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (activeFilter !== filter.key) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeFilter !== filter.key) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  <filter.icon size={16} className="icon-container" />
                  {filter.label}
                  
                  {/* Active indicator */}
                  {activeFilter === filter.key && (
                    <motion.div
                      layoutId="activeFilter"
                      style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        right: '0',
                        bottom: '0',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        borderRadius: '2rem',
                        zIndex: -1
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Sélecteur du nombre de cards par page */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '2rem 0 1.5rem 0', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ minWidth: 200, flex: '0 0 auto' }}>
              <Select
                options={pageSizeOptions}
                value={pageSizeOptions.find(opt => opt.value === pageSize)}
                onChange={opt => setPageSize(opt.value)}
                instanceId="event-page-size-select"
                aria-label="Number of events per page"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    background: 'rgba(30, 28, 124, 0.45)',
                    borderRadius: '1.5rem',
                    border: state.isFocused ? '2.5px solid var(--accent-primary, #3f51b5)' : '2px solid rgba(255,255,255,0.18)',
                    color: 'var(--text-primary, #fff)',
                    minWidth: 180,
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '1.08rem',
                    boxShadow: state.isFocused ? '0 0 0 4px rgba(63,81,181,0.18)' : '0 2px 12px 0 rgba(63,81,181,0.10)',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.25s',
                  }),
                  valueContainer: (base) => ({
                    ...base,
                    color: 'var(--text-primary, #fff)',
                    paddingLeft: '1.1rem',
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: 'var(--text-primary, #fff)',
                    fontWeight: 700,
                  }),
                  input: (base) => ({
                    ...base,
                    color: 'var(--text-primary, #fff)',
                  }),
                  dropdownIndicator: (base, state) => ({
                    ...base,
                    color: state.isFocused ? 'var(--accent-primary, #3f51b5)' : '#b8beea',
                    transition: 'color 0.2s',
                  }),
                  indicatorSeparator: (base) => ({
                    ...base,
                    background: 'rgba(255,255,255,0.12)',
                  }),
                  menu: (base) => ({
                    ...base,
                    background: 'rgba(30, 28, 124, 0.98)',
                    borderRadius: 18,
                    color: '#fff',
                    marginTop: 6,
                    boxShadow: '0 8px 32px 0 rgba(63,81,181,0.18)',
                    padding: '0.25rem 0',
                    minWidth: 180,
                  }),
                  option: (base, state) => ({
                    ...base,
                    background: state.isSelected
                      ? 'linear-gradient(135deg, var(--accent-primary, #3f51b5) 60%, var(--accent-secondary, #9c27b0) 100%)'
                      : state.isFocused
                        ? 'rgba(63,81,181,0.18)'
                        : 'transparent',
                    color: state.isSelected ? '#fff' : state.isFocused ? '#fff' : '#e2e8f0',
                    fontWeight: state.isSelected ? 700 : 500,
                    borderRadius: 14,
                    fontFamily: 'var(--font-body)',
                    fontSize: '1.08rem',
                    padding: '0.75rem 1.5rem',
                    transition: 'background 0.18s, color 0.18s',
                    cursor: 'pointer',
                  }),
                  menuList: (base) => ({
                    ...base,
                    padding: 0,
                  }),
                }}
                theme={theme => ({
                  ...theme,
                  borderRadius: 18,
                  colors: {
                    ...theme.colors,
                    primary: 'var(--accent-primary)',
                    primary25: 'rgba(63,81,181,0.18)',
                    neutral0: 'rgba(30, 28, 124, 0.98)',
                    neutral80: '#fff',
                  },
                })}
                isSearchable={false}
              />
            </div>
          </div>

          {/* Affichage des événements paginés */}
          <motion.div
            id="events-cards-section"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem',
              marginBottom: '4rem'
            }}
          >
            {paginatedEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: loadingComplete ? 1 : 0, y: loadingComplete ? 0 : 50, scale: loadingComplete ? 1 : 0.9 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  borderRadius: '20px',
                  padding: '2rem',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.4s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '480px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(63, 81, 181, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                }}
              >
                {/* Event Image - Optimized */}
                <div style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  background: 'linear-gradient(135deg, #e3e8f0 0%, #f8fafc 100%)',
                  borderRadius: '16px',
                  marginBottom: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(63,81,181,0.10)',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)'
                }}>
                  <Image
                    src={`/assets/events/${event.img || event.image || 'default.jpg'}`}
                    alt={event.title}
                    fill
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      borderRadius: '16px',
                      transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1), filter 0.3s',
                      boxShadow: '0 2px 8px rgba(63,81,181,0.08)'
                    }}
                    sizes="(max-width: 600px) 100vw, 600px"
                    priority={index < 2}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    onError={(e) => { e.target.style.opacity = 0.5; e.target.onerror = null; }}
                  />
                  {/* Optional overlay for premium look */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg,rgba(0,0,0,0.04) 60%,rgba(63,81,181,0.08) 100%)',
                    borderRadius: '16px',
                    pointerEvents: 'none',
                  }} />
                </div>

                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: 'linear-gradient(90deg, #00bcd4, #3f51b5, #9c27b0)',
                  borderRadius: '20px 20px 0 0',
                  zIndex: 2
                }} />

                {/* Event Content */}
                <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Event Title with Sophisticated Typography */}
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-2xl)',
                    fontWeight: '700',
                    letterSpacing: 'var(--letter-tight)',
                    lineHeight: 'var(--leading-snug)',
                    color: 'var(--text-primary)',
                    marginBottom: '1.25rem'
                  }}>
                    {event.title}
                  </h3>

                  {/* Event Meta Information */}
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <motion.span 
                      style={{
                        background: 'rgba(63, 81, 181, 0.15)',
                        color: '#8bb6ff',
                        padding: '0.5rem 1rem',
                        borderRadius: '1.5rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: '500',
                        letterSpacing: 'var(--letter-normal)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        border: '1px solid rgba(139, 182, 255, 0.2)',
                        backdropFilter: 'blur(10px)'
                      }}
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(63, 81, 181, 0.2)' }}
                    >
                      <CalendarIcon size={14} className="icon-hover-lift" />
                      {event.date}
                    </motion.span>
                    
                    <motion.span 
                      style={{
                        background: 'rgba(156, 39, 176, 0.15)',
                        color: '#d1a3ff',
                        padding: '0.5rem 1rem',
                        borderRadius: '1.5rem',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-sm)',
                        fontWeight: '500',
                        letterSpacing: 'var(--letter-normal)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        border: '1px solid rgba(209, 163, 255, 0.2)',
                        backdropFilter: 'blur(10px)'
                      }}
                      whileHover={{ scale: 1.05, backgroundColor: 'rgba(156, 39, 176, 0.2)' }}
                    >
                      <LocationIcon size={14} className="icon-hover-lift" />
                      {event.location}
                    </motion.span>
                  </div>

                  {/* Event Description */}
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--text-secondary)',
                    lineHeight: 'var(--leading-relaxed)',
                    fontSize: 'var(--text-base)',
                    fontWeight: '400',
                    letterSpacing: 'var(--letter-normal)',
                    display: '-webkit-box',
                    WebkitLineClamp: '4',
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    marginBottom: '2rem'
                  }}>
                    {event.description}
                  </p>

                  {/* Premium Call-to-Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                      color: '#ffffff',
                      border: 'none',
                      padding: '1rem 2rem',
                      borderRadius: '2rem',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--text-base)',
                      fontWeight: '600',
                      letterSpacing: 'var(--letter-normal)',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      boxShadow: '0 8px 25px rgba(63, 81, 181, 0.3)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(63, 81, 181, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(63, 81, 181, 0.3)';
                    }}
                  >
                    <span>Learn More</span>
                    <ArrowRightIcon size={16} className="icon-hover-lift" />
                    
                    {/* Button Shimmer Effect */}
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: '0',
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        zIndex: 1
                      }}
                      animate={{
                        left: ['-100%', '100%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: 'easeInOut'
                      }}
                    />
                  </motion.button>
                </div>

                {/* Floating Elements */}
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '100px',
                  height: '100px',
                  background: 'linear-gradient(135deg, rgba(63, 81, 181, 0.1), rgba(156, 39, 176, 0.1))',
                  borderRadius: '50%',
                  filter: 'blur(20px)',
                  zIndex: 1
                }} />
              </motion.div>
            ))}
          </motion.div>
          {/* Pagination en bas si besoin */}
          {pageCount > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
              <Pagination
                pageCount={pageCount}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </div>
          )}

          {/* Refined No Results Message */}
          {paginatedEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{
                textAlign: 'center',
                padding: '5rem 2rem',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02))',
                borderRadius: '2rem',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Icon Container */}
              <motion.div 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '5rem',
                  height: '5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '2rem',
                  marginBottom: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <SearchIcon size={32} style={{ color: 'var(--text-tertiary)' }} />
              </motion.div>

              {/* Title */}
              <h3 style={{ 
                fontFamily: 'var(--font-display)',
                fontSize: 'var(--text-3xl)', 
                fontWeight: '700',
                letterSpacing: 'var(--letter-tight)',
                marginBottom: '1rem', 
                color: 'var(--text-primary)'
              }}>
                No Events Found
              </h3>

              {/* Description */}
              <p style={{ 
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-lg)',
                fontWeight: '400',
                color: 'var(--text-secondary)',
                letterSpacing: 'var(--letter-normal)',
                lineHeight: 'var(--leading-relaxed)',
                maxWidth: '400px',
                margin: '0 auto'
              }}>
                Try adjusting your search terms or filters to discover the events you&apos;re looking for.
              </p>

              {/* Background Decoration */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200px',
                height: '200px',
                background: 'radial-gradient(circle, rgba(63, 81, 181, 0.05) 0%, transparent 70%)',
                borderRadius: '50%',
                zIndex: -1
              }} />
            </motion.div>
          )}

          {/* Refined Stats Section */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: loadingComplete ? 1 : 0, y: loadingComplete ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '2rem',
              marginTop: '5rem',
              padding: '3rem',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))',
              borderRadius: '2rem',
              backdropFilter: 'blur(30px)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background Decoration */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              right: '-50%',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle, rgba(63, 81, 181, 0.1) 0%, transparent 50%)',
              borderRadius: '50%',
              zIndex: 0
            }} />

            {[
              { number: events.length, label: 'Total Events', icon: EventIcon, color: '#3f51b5' },
              { number: '500+', label: 'Participants', icon: UserGroupIcon, color: '#9c27b0' },
              { number: '50+', label: 'Workshops', icon: AcademicCapIcon, color: '#00bcd4' },
              { number: '25+', label: 'Awards', icon: TrophyIcon, color: '#ff9800' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.7 + index * 0.1 }}
                style={{ 
                  textAlign: 'center',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {/* Icon Container */}
                <motion.div 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '4rem',
                    height: '4rem',
                    background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                    borderRadius: '1.5rem',
                    marginBottom: '1.5rem',
                    border: `1px solid ${stat.color}30`
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <stat.icon size={24} style={{ color: stat.color }} className="icon-hover-glow" />
                </motion.div>

                {/* Number Display */}
                <div style={{ 
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-4xl)', 
                  fontWeight: '800',
                  letterSpacing: 'var(--letter-tight)',
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem',
                  lineHeight: 'var(--leading-tight)'
                }}>
                  {stat.number}
                </div>

                {/* Label */}
                <div style={{ 
                  fontFamily: 'var(--font-body)',
                  color: 'var(--text-tertiary)', 
                  fontSize: 'var(--text-base)',
                  fontWeight: '500',
                  letterSpacing: 'var(--letter-wide)',
                  textTransform: 'uppercase'
                }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.section>
        </section>
      </main>
    </>
  );
}