import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Broom } from '@phosphor-icons/react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();

  const handleSignInClick = () => {
    window.dispatchEvent(new Event('open-auth-modal'));
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Broom className="h-8 w-8 text-primary" />
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
                <button
                  onClick={signOut}
                  className="text-gray-600 hover:text-primary px-3 py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={handleSignInClick}
                className="text-gray-600 hover:text-primary px-3 py-2"
              >
                <User className="h-5 w-5 inline-block mr-1" />
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/search"
                className="block text-gray-600 hover:text-primary px-3 py-2"
              >
                Find Cleaners
              </Link>
              <Link
                to="/services"
                className="block text-gray-600 hover:text-primary px-3 py-2"
              >
                Services
              </Link>
              {user ? (
                <>
                  <Link
                    to="/bookings"
                    className="block text-gray-600 hover:text-primary px-3 py-2"
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={signOut}
                    className="block w-full text-left text-gray-600 hover:text-primary px-3 py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSignInClick}
                  className="block text-gray-600 hover:text-primary px-3 py-2"
                >
                  <User className="h-5 w-5 inline-block mr-1" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
