import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLocale } from '../../hooks/useLocale';
import styles from './Header.module.css';

const NAV_ITEMS: Array<{ to: string; label: { sv: string; en: string } }> = [
  { to: '/', label: { sv: 'Hem', en: 'Home' } },
  { to: '/om-mig', label: { sv: 'Om mig', en: 'About' } },
  { to: '/vad-ar-act', label: { sv: 'Vad är ACT', en: 'What is ACT' } },
  { to: '/toxism-vs-narcissism', label: { sv: 'Toxism vs Narcissism', en: 'Toxism vs Narcissism' } },
  { to: '/tjanster', label: { sv: 'Tjänster', en: 'Services' } },
  { to: '/kontakt', label: { sv: 'Kontakt', en: 'Contact' } },
];

export function Header() {
  const { locale, toggleLocale } = useLocale();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === '/';
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    const focusable = Array.from(overlay.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
    focusable[0]?.focus();
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header className={`${styles.header} ${isHome && !scrolled ? styles.transparent : ''}`}>
        <a className={styles.skipLink} href="#main">
          {locale === 'sv' ? 'Hoppa till innehåll' : 'Skip to content'}
        </a>
        <div className={styles.inner}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setIsOpen((o) => !o)}
            aria-expanded={isOpen}
            aria-controls="nav-overlay"
            aria-label={isOpen
              ? (locale === 'sv' ? 'Stäng meny' : 'Close menu')
              : (locale === 'sv' ? 'Öppna meny' : 'Open menu')}
          >
            <span className={styles.menuDots} aria-hidden="true">···</span>
            {locale === 'sv' ? 'MENY' : 'MENU'}
          </button>

          <NavLink to="/" className={styles.brand} onClick={closeMenu}>
            Good As You Are
          </NavLink>

          <NavLink to="/kontakt" className={styles.ctaLink} onClick={closeMenu}>
            {locale === 'sv' ? 'KONTAKT' : 'CONTACT'}
          </NavLink>
        </div>
      </header>

      {isOpen && (
        <div className={styles.backdrop} onClick={closeMenu} aria-hidden="true" />
      )}

      <div
        id="nav-overlay"
        ref={overlayRef}
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
        aria-hidden={!isOpen}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={closeMenu}
          aria-label={locale === 'sv' ? 'Stäng meny' : 'Close menu'}
          tabIndex={isOpen ? 0 : -1}
        >
          <span aria-hidden="true">✕</span>
          {locale === 'sv' ? 'STÄNG' : 'CLOSE'}
        </button>

        <nav aria-label={locale === 'sv' ? 'Huvudmeny' : 'Main menu'}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [styles.overlayLink, isActive ? styles.overlayLinkActive : ''].filter(Boolean).join(' ')
              }
              end={item.to === '/'}
              onClick={closeMenu}
              tabIndex={isOpen ? 0 : -1}
            >
              {item.label[locale]}
            </NavLink>
          ))}
        </nav>

        <div className={styles.overlayFooter}>
          <button
            type="button"
            className={styles.langButton}
            onClick={toggleLocale}
            tabIndex={isOpen ? 0 : -1}
          >
            {locale === 'sv' ? 'ENGLISH' : 'SVENSKA'}
          </button>
        </div>
      </div>
    </>
  );
}
