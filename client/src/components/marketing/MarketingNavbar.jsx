import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { FurnishLogo } from "./FurnishLogo";

const navItems = [
  { label: "Home", href: "#top" },
  { label: "Collections", href: "#gallery" },
  { label: "About", href: "#features" },
  { label: "Contact", href: "#cta" },
];

export function MarketingNavbar() {
  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          <FurnishLogo />

          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart className="size-5 text-gray-600" />
            </button>
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors rounded-lg hover:bg-orange-50"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors rounded-lg"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
