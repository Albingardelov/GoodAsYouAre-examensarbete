import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';
import { Footer } from '../Footer/Footer';
import { ScrollToTop } from '../ScrollToTop/ScrollToTop';
import styles from './Layout.module.css';

export function Layout() {
  return (
    <div className={styles.layout}>
      <Header />
      <main id="main" className={styles.container}>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

