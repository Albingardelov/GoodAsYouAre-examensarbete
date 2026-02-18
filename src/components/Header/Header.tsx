import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
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
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Focus first item when menu opens; trap Tab focus while open
  useEffect(() => {
    if (!isOpen) return;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const focusable = Array.from(
      overlay.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    );
    focusable[0]?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const langBtn = (
    <button
      type="button"
      className={styles.langButton}
      onClick={toggleLocale}
      aria-label={locale === 'sv' ? 'Byt språk till engelska' : 'Switch language to Swedish'}
    >
      {locale === 'sv' ? 'EN' : 'SV'}
    </button>
  );

  return (
    <>
      <header className={styles.header}>
        <a className={styles.skipLink} href="#main">
          {locale === 'sv' ? 'Hoppa till innehåll' : 'Skip to content'}
        </a>

        <div className={styles.inner}>
          <NavLink to="/" className={styles.brand} onClick={closeMenu}>
            Good As You Are
          </NavLink>

          {/* Desktop nav — inside header, hidden on mobile */}
          <nav className={styles.desktopNav} aria-label="Huvudmeny">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                end={item.to === '/'}
              >
                {item.label[locale]}
              </NavLink>
            ))}
            <span className={styles.spacer} />
            {langBtn}
          </nav>

          {/* Hamburger button — mobile only */}
          <button
            type="button"
            className={`${styles.menuButton} ${isOpen ? styles.menuOpen : ''}`}
            onClick={() => setIsOpen((o) => !o)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={
              isOpen
                ? (locale === 'sv' ? 'Stäng meny' : 'Close menu')
                : (locale === 'sv' ? 'Öppna meny' : 'Open menu')
            }
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
        </div>
      </header>

      {/* Mobile nav overlay — outside header to avoid backdrop-filter stacking context */}
      <div
        id="mobile-nav"
        ref={overlayRef}
        className={`${styles.mobileOverlay} ${isOpen ? styles.overlayOpen : ''}`}
        aria-hidden={!isOpen}
      >
        <nav aria-label="Mobilmeny">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${styles.mobileLink} ${isActive ? styles.active : ''}`}
              end={item.to === '/'}
              onClick={closeMenu}
              tabIndex={isOpen ? 0 : -1}
            >
              {item.label[locale]}
            </NavLink>
          ))}
        </nav>
        <div className={styles.mobileLangWrapper}>{langBtn}</div>
      </div>
    </>
  );
}
