import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, LayoutGrid, Save, Mail, ChevronDown } from "lucide-react";
import { useAuth } from "../../utils/AuthContext";

/**
 * Shared navbar for all pages. Conditional links based on auth.
 * - Not logged in: Home | Collections | About | Contact
 * - Logged in: Designer | Save Room | About | Contact | Messages
 */
export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate("/home");
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">
          <Link to="/home" className="flex items-center gap-2 shrink-0">
            <div className="bg-orange-500 rounded-lg w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold text-sm leading-none">F</span>
            </div>
            <span className="text-xl font-semibold text-gray-900 tracking-tight">Furnish</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/designer"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium flex items-center gap-1.5"
                >
                  <LayoutGrid className="size-4" />
                  Designer
                </Link>
                <Link
                  to="/save-live"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium flex items-center gap-1.5"
                >
                  <Save className="size-4" />
                  Save Room
                </Link>
                <Link
                  to="/about"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium"
                >
                  Contact
                </Link>
                <Link
                  to="/messages"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium flex items-center gap-1.5"
                >
                  <Mail className="size-4" />
                  Messages
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/home"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium"
                >
                  Home
                </Link>
                <a
                  href="/home#gallery"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium"
                >
                  Collections
                </a>
                <Link
                  to="/about"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium"
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium"
                >
                  Contact
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="size-4 text-orange-600" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-gray-700 truncate max-w-[120px]">
                    {user?.name || user?.email || "User"}
                  </span>
                  <ChevronDown
                    className={`size-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {user?.email || ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors rounded-lg hover:bg-orange-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors rounded-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
