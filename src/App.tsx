import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Search from './pages/Search';
import BookCleaner from './pages/BookCleaner';
import CleanerProfile from './pages/CleanerProfile';
import Bookings from './pages/Bookings';
import SEO from './components/SEO';

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <div className="flex flex-col min-h-screen">
          <SEO />
          <Navbar />
          <AuthModal />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/book/:id" element={<BookCleaner />} />
              <Route path="/cleaner/:id" element={<CleanerProfile />} />
              <Route path="/bookings" element={<Bookings />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </ErrorBoundary>
    </HelmetProvider>
  );
}