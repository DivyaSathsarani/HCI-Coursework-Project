import { Link, useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { apiFetch } from "../utils/api";
import {
  signInWithGoogle,
  signInWithFacebook,
  isConfigured,
} from "../lib/auth";

const heroImages = [
  "https://images.unsplash.com/photo-1640109229792-a26a0ee366ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBsaXZpbmclMjByb29tJTIwZnVybml0dXJlfGVufDF8fHx8MTc3MzgxMzI3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1535049752-3baf525dd015?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBtaW5pbWFsaXN0JTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MzgxMzI3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1758977403403-c51ef509e788?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGluaW5nJTIwcm9vbSUyMGZ1cm5pdHVyZSUyMHRhYmxlfGVufDF8fHx8MTc3MzgxMzI3OXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1764755932155-dabbee87df7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBob21lJTIwb2ZmaWNlJTIwZGVzayUyMHNldHVwfGVufDF8fHx8MTc3MzgxMzI4MHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1759647020668-648cd90ddce4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwdmVsdmV0JTIwc29mYSUyMGxpdmluZyUyMHNwYWNlfGVufDF8fHx8MTc3MzgxMzI4MXww&ixlib=rb-4.1.0&q=80&w=1080",
];
const DEMO_EMAIL = "admin@example.com";
const DEMO_PASSWORD = "123456";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [socialLoading, setSocialLoading] = useState(null);
  const [socialError, setSocialError] = useState("");

  const handleSocialLogin = async (provider) => {
    setSocialError("");
    setSocialLoading(provider);
    try {
      if (isConfigured) {
        const signIn = provider === "google" ? signInWithGoogle : signInWithFacebook;
        const oauthUser = await signIn();
        if (oauthUser) {
          const res = await apiFetch("/api/auth/social", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: oauthUser.email,
              name: oauthUser.displayName || "",
            }),
          });
          const text = await res.text();
          const data = text ? (() => { try { return JSON.parse(text); } catch { return {}; } })() : {};
          if (!res.ok) throw new Error(data.message || "Social login failed");
          setAuth(data.token, data.user);
          navigate("/designer");
        } else {
          setSocialError("Sign-in failed. Check your Firebase config.");
        }
      } else {
        const demoEmail =
          provider === "google" ? "google.user@example.com" : "facebook.user@example.com";
        const res = await apiFetch("/api/auth/social", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: demoEmail, name: "Demo User" }),
        });
        const text = await res.text();
        const data = text ? (() => { try { return JSON.parse(text); } catch { return {}; } })() : {};
        if (!res.ok) throw new Error(data.message || "Demo login failed");
        setAuth(data.token, data.user);
        navigate("/designer");
      }
    } catch (err) {
      const msg = err?.message || "Sign-in failed";
      setSocialError(msg.includes("popup") ? "Sign-in was cancelled." : msg);
    } finally {
      setSocialLoading(null);
    }
  };

  const doLogin = async (loginEmail, loginPassword) => {
    let res;
    try {
      res = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
    } catch (err) {
      throw new Error(
        "Cannot reach the backend. Start the server: cd server && node server.js (port 5001)",
      );
    }
    const text = await res.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(res.ok ? "Invalid response from server" : "Login failed. Please try again.");
    }
    if (!res.ok) {
      if (res.status === 502 || res.status === 504) {
        throw new Error(
          "Backend unreachable. Start the server: cd server && node server.js (port 5001)",
        );
      }
      throw new Error(
        data.message ||
          (res.status === 503 ? "Database not connected. Please start MongoDB." : "Login failed"),
      );
    }
    const token = data.token ?? data.accessToken;
    const user = data.user ?? data.userData;

    if (!token || !user) {
      const keys = Object.keys(data).join(", ") || "none";
      console.error("[Login] Invalid response:", { status: res.status, keys, data });
      if (data.type === "health" || (data.ok && !data.token)) {
        throw new Error(
          "Wrong API endpoint. Login should hit POST /api/auth/login. Check API baseURL (port 5001).",
        );
      }
      throw new Error(
        data.message || `Invalid login response: missing token or user. Got keys: ${keys}`,
      );
    }

    setAuth(token, user);
    setTimeout(() => navigate("/designer", { replace: true }), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      await doLogin(email, password);
    } catch (err) {
      setFormError(err?.message || "Invalid email or password");
      console.error("[Login error]", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setFormError("");
    setFormLoading(true);
    try {
      await doLogin(DEMO_EMAIL, DEMO_PASSWORD);
    } catch (err) {
      setFormError(err?.message || "Demo login failed");
      console.error("[Login error]", err);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ── Top Navbar (matches Landing) ── */}
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
              <Link to="/home" className="text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium">Home</Link>
              <a href="/#gallery" className="text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium">Collections</a>
              <Link to="/about" className="text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium">About</Link>
              <Link to="/contact" className="text-sm text-gray-600 hover:text-orange-500 transition-colors font-medium">Contact</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium text-orange-500">Login</Link>
              <Link to="/signup" className="inline-flex px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors rounded-lg">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Content (split layout) ── */}
      <div className="flex flex-1 pt-16">
      {/* ── Left Panel – Image + Copy ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src={heroImages[0]}
          alt="Furnish interior"
          className="w-full h-full object-cover"
        />
        {/* Dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent" />
        {/* Description copy (no logo) */}
        <div className="absolute inset-0 flex flex-col justify-end p-10">
          <div className="max-w-md">
            <p className="text-orange-400 text-xs font-semibold tracking-widest uppercase mb-3">
              Premium Furniture Design
            </p>
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">
              Design your{" "}
              <span className="text-orange-500">perfect space</span>
            </h2>
            <p className="text-gray-200 text-sm leading-relaxed">
              Visualize layouts, experiment with furniture, and refine every detail
              of your room before making real‑world changes.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right Panel – Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-14 lg:px-20 py-12 lg:py-0 bg-white">
        {/* Mobile logo */}
        <Link to="/home" className="flex items-center gap-2 mb-10 lg:hidden">
          <div className="bg-orange-500 rounded-lg w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold text-sm leading-none">F</span>
          </div>
          <span className="text-gray-900 text-xl font-semibold">Furnish</span>
        </Link>

        <div className="max-w-sm w-full mx-auto">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm">
              Sign in to continue your design journey
            </p>
          </div>

          {formError && (
            <p className="mb-3 text-sm text-red-600">{formError}</p>
          )}
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 accent-orange-500"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>

            {/* Submit */}
            <p className="mt-3 text-center">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={formLoading}
                className="text-xs text-gray-500 hover:text-orange-500 transition-colors disabled:opacity-60"
              >
                Try demo account
              </button>
            </p>
            <button
              type="submit"
              disabled={formLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {formLoading ? "Signing in…" : "Sign in"}
              <ArrowRight className="size-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">Or continue with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {socialError && (
            <p className="mb-3 text-sm text-red-600">{socialError}</p>
          )}
          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={socialLoading}
              className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="size-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {socialLoading === "google" ? "Signing in…" : "Google"}
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("facebook")}
              disabled={socialLoading}
              className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="size-4" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              {socialLoading === "facebook" ? "Signing in…" : "Facebook"}
            </button>
          </div>

          {/* Sign up link */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-orange-500 hover:text-orange-600 font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}