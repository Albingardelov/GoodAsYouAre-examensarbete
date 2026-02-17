import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const NAV_ITEMS: Array<{ to: string; label: string }> = [
  { to: '/', label: 'Hem' },
  { to: '/om-mig', label: 'Om mig' },
  { to: '/vad-ar-act', label: 'Vad är ACT' },
  { to: '/toxism-vs-narcissism', label: 'Toxism vs Narcissism' },
  { to: '/tjanster', label: 'Tjänster' },
  { to: '/kontakt', label: 'Kontakt' },
];

export function Header() {
  return (
    <header className={styles.header}>
      <a className={styles.skipLink} href="#main">
        Hoppa till innehåll
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
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

