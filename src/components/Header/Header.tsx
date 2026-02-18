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
  return (
    <header className={styles.header}>
      <a className={styles.skipLink} href="#main">
        {locale === 'sv' ? 'Hoppa till innehåll' : 'Skip to content'}
      </a>

      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand}>
          Good As You Are
        </NavLink>

        <nav className={styles.nav} aria-label="Huvudmeny">
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

          <button
            type="button"
            className={styles.langButton}
            onClick={toggleLocale}
            aria-label={locale === 'sv' ? 'Byt språk till engelska' : 'Switch language to Swedish'}
          >
            {locale === 'sv' ? 'EN' : 'SV'}
          </button>
        </nav>
      </div>
    </header>
  );
}

