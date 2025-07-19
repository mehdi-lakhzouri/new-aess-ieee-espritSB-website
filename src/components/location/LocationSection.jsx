'use client';

import React, { useEffect, useRef } from 'react';
import './LocationSection.css';

const LocationSection = () => {
  const mapContainerRef = useRef(null);
  
  // ESPRIT School Coordinates
  const espritLocation = "36.8981,10.1895";
  
  // Animation for the pin drop effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.3 }
    );

    const locationElements = document.querySelectorAll('.location-container, .location-title, .location-subtitle, .map-container');
    locationElements.forEach(el => observer.observe(el));

    return () => {
      locationElements.forEach(el => observer.unobserve(el));
    };
  }, []);
  return (
    <section className="location-section">
      <div className="location-container">
        <div className="location-header">
          <div className="location-pin">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#7f00ff"/>
            </svg>
          </div>
          <h2 className="location-title font-playfair" style={{
            fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
            color: '#ffffff',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: '1.1',
            textAlign: 'center',
            marginBottom: '0.5rem',
            padding: '0 1rem',
            wordBreak: 'break-word',
            hyphens: 'auto',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f0ff 50%, #ffffff 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 20px rgba(255, 255, 255, 0.3)',
            filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
          }}>We&apos;re located in ESPRIT, Obviously!</h2>
          <p className="location-subtitle font-playfair" style={{
            fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            color: '#e6e6ff',
            fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
            fontWeight: 500,
            textAlign: 'center',
            marginBottom: '2.5em',
            letterSpacing: '0.06em',
            textShadow: '0 2px 12px rgba(230, 230, 255, 0.4)',
            opacity: 0.9
          }}>Check if we&apos;re neighbours!</p>
        </div>
        
        <div className="map-container" ref={mapContainerRef}>
          <iframe 
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3193.1337376168134!2d10.187278415255073!3d36.898311779927794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12e2cb7454c6ed51%3A0x683b3ab5565cd357!2sESPRIT%20School%20of%20Engineering!5e0!3m2!1sen!2stn!4v1674669321150!5m2!1sen!2stn`}
            width="100%" 
            height="100%" 
            style={{ border: 0, borderRadius: '15px' }}
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="ESPRIT School of Engineering"
            className="google-map-iframe"
          />

          
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
