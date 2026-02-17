import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';
import styles from './Layout.module.css';

export function Layout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main id="main" className={styles.container}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <small>© {new Date().getFullYear()} Good As You Are</small>
      </footer>
    </div>
  );
}

