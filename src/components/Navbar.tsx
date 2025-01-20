import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Spray, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Spray className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-primary">CleanerNow</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/search" className="text-gray-600 hover:text-primary px-3 py-2">
              Find Cleaners
            </Link>
            <Link to="/services" className="text-gray-600 hover:text-primary px-3 py-2">
              Services
            </Link>
            {user ? (
              <>
                <Link to="/bookings" className="text-gray-600 hover:text-primary px-3 py-2">
                  My Bookings
                </Link>
                <div className="relative ml-3">
                  <button
                    onClick={() => signOut()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-700"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:text-primary-700 hover:bg-primary-50"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/search"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-primary-50"
            >
              Find Cleaners
            </Link>
            <Link
              to="/services"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-primary-50"
            >
              Services
            </Link>
            {user ? (
              <>
                <Link
                  to="/bookings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-primary-50"
                >
                  My Bookings
                </Link>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-primary-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-primary hover:bg-primary-50"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}