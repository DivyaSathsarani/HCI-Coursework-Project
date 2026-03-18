import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gray-950 text-gray-400">
      {/* Orange top border */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-orange-500" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Main footer content */}
        <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/home" className="inline-flex items-center gap-2 mb-4 group">
              <div className="bg-orange-500 rounded-lg w-10 h-10 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                <span className="text-white font-bold text-lg leading-none">F</span>
              </div>
              <span className="text-xl font-semibold text-white">Furnish</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              Web-based interactive room visualization system. Design and visualize your space in real-time with customizable furniture and layouts.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:support@furnish.com"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Mail className="size-4 shrink-0" />
                support@furnish.com
              </a>
              <a
                href="tel:+94112345678"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Phone className="size-4 shrink-0" />
                +94 11 234 5678
              </a>
              <p className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin className="size-4 shrink-0 mt-0.5" />
                Colombo, Sri Lanka
              </p>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/home" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Room Designer
                </Link>
              </li>
              <li>
                <Link to="/designer" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Start Design
                </Link>
              </li>
              <li>
                <Link to="/home#gallery" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/save-live" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Saved Rooms
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Account links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Account
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/login" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link to="/forgot-password" className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                  Forgot Password
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold mb-1">Stay updated</h4>
              <p className="text-sm text-gray-500">
                Get design tips and new features delivered to your inbox.
              </p>
            </div>
            <form className="flex gap-2 max-w-md w-full" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors shrink-0"
              >
                Subscribe
                <ArrowRight className="size-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} Furnish. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-gray-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-gray-400 transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
