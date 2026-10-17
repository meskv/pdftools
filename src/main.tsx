import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import './styles.css';

// Clear caches left by the earlier plain-JS version of the site.
caches?.keys().then(ks => ks.filter(k => k.startsWith('pdft-')).forEach(k => caches.delete(k)));

createRoot(document.getElementById('root')!).render(<ErrorBoundary><BrowserRouter><App /></BrowserRouter></ErrorBoundary>);
