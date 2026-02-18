import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Page } from './pages/Page/Page';
import type { Locale } from './context/LocaleContext';
import { useLocale } from './hooks/useLocale';

const ROUTES: Array<{ path: string; slug: string; title: Record<Locale, string> }> = [
  { path: '/', slug: 'home', title: { sv: 'Hem', en: 'Home' } },
  { path: '/om-mig', slug: 'about', title: { sv: 'Om mig', en: 'About' } },
  { path: '/vad-ar-act', slug: 'act', title: { sv: 'Vad är ACT', en: 'What is ACT' } },
  { path: '/toxism-vs-narcissism', slug: 'toxism-vs-narcissism', title: { sv: 'Toxism vs Narcissism', en: 'Toxism vs Narcissism' } },
  { path: '/tjanster', slug: 'services', title: { sv: 'Tjänster', en: 'Services' } },
  { path: '/kontakt', slug: 'contact', title: { sv: 'Kontakt', en: 'Contact' } },
];

function App() {
  const { locale } = useLocale();
  return (
    <Routes>
      <Route element={<Layout />}>
        {ROUTES.map((r) => (
          <Route key={r.path} path={r.path} element={<Page slug={r.slug} titleFallback={r.title[locale]} />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
