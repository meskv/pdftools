import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:id" element={<ToolPage />} />
        </Routes>
      </main>
      <footer>Everything runs in your browser. Your files are never uploaded.</footer>
    </>
  );
}
