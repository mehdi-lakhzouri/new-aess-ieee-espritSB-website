import React, { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import styles from './ExBoardItem.module.scss';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import { motion, useInView } from 'framer-motion';

const ExBoardItem = ({ name, poste, img, fb, insta, linkedin }) => {
  const imagePath = `/assets/ExBoard/${img}`;
  const [showPopup, setShowPopup] = useState(false);
  const timeoutRef = useRef(null);
  const avatarButtonRef = useRef(null);
  const closeBtnRef = useRef(null);
  const modalRef = useRef(null);
  const [ariaMessage, setAriaMessage] = useState('');
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-40px' });

  useEffect(() => { setMounted(true); }, []);

  const handleImageClick = useCallback((e) => {
    e.stopPropagation();
    setShowPopup(true);
    setAriaMessage(`Photo de ${name} agrandie. Appuyez sur Échap pour fermer.`);
    timeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 2250);
    document.body.style.overflow = 'hidden';
  }, [name]);

  const handleClose = useCallback(() => {
    setShowPopup(false);
    setAriaMessage('Agrandissement fermé.');
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    document.body.style.overflow = '';
    if (avatarButtonRef.current) avatarButtonRef.current.focus();
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      handleClose();
    }
    // Focus trap
    if (showPopup && modalRef.current) {
      const focusableEls = modalRef.current.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    }
  }, [handleClose, showPopup]);

  useEffect(() => {
    if (showPopup) {
      document.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        if (closeBtnRef.current) closeBtnRef.current.focus();
      }, 0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [showPopup, handleKeyDown]);

  const avatarSize = 132;
  const popupSize = 400;

  // Popup rendu via Portal
  const popup = showPopup && mounted ? createPortal(
    <div
      className={styles.popupOverlay}
      style={{ zIndex: 2147483647 }}
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
      aria-label={`Agrandissement de la photo de ${name}`}
      ref={modalRef}
    >
      <div className={styles.popupContent} onClick={e => e.stopPropagation()}>
        <Image
          src={imagePath}
          alt={name}
          className={styles.popupImage}
          width={popupSize}
          height={popupSize}
          style={{ objectFit: 'cover' }}
          loading="eager"
          priority
        />
        <button
          className={styles.closeBtn}
          onClick={handleClose}
          ref={closeBtnRef}
          autoFocus
          aria-label="Fermer l'agrandissement"
        >
          Fermer
        </button>
      </div>
    </div>,
    typeof window !== 'undefined' ? document.body : null
  ) : null;

  return (
    <>
      <div aria-live="polite" style={{position: 'absolute', left: '-9999px', height: 0, width: 0, overflow: 'hidden'}}>{ariaMessage}</div>
      {popup}
      <motion.div
        ref={cardRef}
        className={styles.card}
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      >
        <div
          className={`${styles.avatarWrapper} ${styles.clickableAvatar}`}
          onClick={handleImageClick}
          tabIndex={0}
          role="button"
          aria-label={`Voir la photo de ${name}`}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleImageClick(e)}
          ref={avatarButtonRef}
        >
          <Image
            src={imagePath}
            alt={name}
            className={styles.avatar}
            width={avatarSize}
            height={avatarSize}
            style={{ objectFit: 'cover' }}
            loading="lazy"
          />
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{name}</h3>
          {poste && (
            <div className={styles.roleContainer}>
              <p className={styles.role}>
                <span className={styles.roleText}>{poste}</span>
              </p>
            </div>
          )}
          <div className={styles.socials}>
            {fb && (
              <a href={fb} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF />
              </a>
            )}
            {insta && (
              <a href={insta} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

ExBoardItem.propTypes = {
  name: PropTypes.string.isRequired,
  poste: PropTypes.string,
  img: PropTypes.string.isRequired,
  fb: PropTypes.string,
  insta: PropTypes.string,
  linkedin: PropTypes.string,
};

export default ExBoardItem;
