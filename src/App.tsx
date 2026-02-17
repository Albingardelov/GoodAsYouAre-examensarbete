import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { Page } from './pages/Page/Page';

const ROUTES: Array<{ path: string; slug: string; title: string }> = [
  { path: '/', slug: 'home', title: 'Hem' },
  { path: '/om-mig', slug: 'about', title: 'Om mig' },
  { path: '/vad-ar-act', slug: 'act', title: 'Vad är ACT' },
  { path: '/toxism-vs-narcissism', slug: 'toxism-vs-narcissism', title: 'Toxism vs Narcissism' },
  { path: '/tjanster', slug: 'services', title: 'Tjänster' },
  { path: '/kontakt', slug: 'contact', title: 'Kontakt' },
];

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {ROUTES.map((r) => (
          <Route key={r.path} path={r.path} element={<Page slug={r.slug} titleFallback={r.title} />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
