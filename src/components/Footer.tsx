import { Spray } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center">
              <Spray className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-primary">CleanerNow</span>
            </Link>
            <p className="mt-4 text-gray-600">
              Book trusted cleaners for your home or office. Quality cleaning services at your fingertips.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-gray-600 hover:text-primary">House Cleaning</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-primary">Office Cleaning</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-primary">Deep Cleaning</Link></li>
              <li><Link to="/services" className="text-gray-600 hover:text-primary">Move In/Out</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-primary">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-primary">Careers</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-primary">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-600 hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-primary">FAQ</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} CleanerNow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}