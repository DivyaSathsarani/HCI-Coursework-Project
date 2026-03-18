import { Link, useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Check } from "lucide-react";
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
];

const STEPS = [
  { id: 1, label: "Personal info" },
  { id: 2, label: "Security" },
];

export function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [socialError, setSocialError] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const canProceedStep1 = formData.name.trim() && formData.email.trim();
  const canProceedStep2 =
    formData.password.length >= 8 &&
    formData.password === formData.confirmPassword &&
    termsAccepted;

  const goNext = () => {
    setFormError("");
    if (step === 1 && canProceedStep1) setStep(2);
  };

  const goBack = () => {
    setFormError("");
    if (step > 1) setStep(step - 1);
  };

  const handleSocialSignup = async (provider) => {
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
          if (!res.ok) throw new Error(data.message || "Social signup failed");
          setAuth(data.token, data.user);
          navigate("/designer");
        } else {
          setSocialError("Sign-up failed. Check your Firebase config.");
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
        if (!res.ok) throw new Error(data.message || "Demo signup failed");
        setAuth(data.token, data.user);
        navigate("/designer");
      }
    } catch (err) {
      const msg = err?.message || "Sign-up failed";
      setSocialError(msg.includes("popup") ? "Sign-up was cancelled." : msg);
    } finally {
      setSocialLoading(null);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!termsAccepted) {
      setFormError("Please accept the Terms & Conditions");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }
    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }
    setFormLoading(true);
    try {
      let res;
      try {
        res = await apiFetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
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
        throw new Error(res.ok ? "Invalid response from server" : "Signup failed. Please try again.");
      }
      if (!res.ok) {
        const msg =
          res.status === 404 || res.status === 502 || res.status === 504
            ? "Backend unreachable. Start the server: cd server && node server.js (port 5001)"
            : data.message || (res.status === 503 ? "Database not connected. Please start MongoDB." : "Signup failed");
        throw new Error(msg);
      }
      setAuth(data.token, data.user);
      navigate("/designer");
    } catch (err) {
      setFormError(err.message || "Signup failed");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      {/* ── Top Navbar (matches Landing) ── */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100 shadow-sm shrink-0">
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
              <Link to="/login" className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors rounded-lg hover:bg-orange-50">Login</Link>
              <Link to="/signup" className="text-sm font-medium text-orange-500">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Content (split layout: form left, image right) ── */}
      <div className="flex flex-1 pt-16 min-h-0">
      {/* ── Left Panel – Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 sm:px-14 lg:px-20 py-16 lg:py-24 bg-white overflow-y-auto min-h-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Mobile logo */}
        <Link to="/home" className="flex items-center gap-2 mb-6 lg:mb-0 lg:hidden shrink-0">
          <div className="bg-orange-500 rounded-lg w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold text-sm leading-none">F</span>
          </div>
          <span className="text-gray-900 text-xl font-semibold">Furnish</span>
        </Link>

        <div className="max-w-sm w-full mx-auto shrink-0">
          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h1>
            <p className="text-gray-500 text-sm">
              Start designing your dream furniture today
            </p>
          </div>

          {/* Step indicators (top) */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => s.id < step && setStep(s.id)}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    step >= s.id
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  } ${s.id < step ? "cursor-pointer hover:bg-orange-400" : ""}`}
                >
                  {step > s.id ? <Check className="size-4" /> : s.id}
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-8 h-0.5 mx-0.5 ${
                      step > s.id ? "bg-orange-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500 mb-4">
            Step {step} of {STEPS.length}: {STEPS[step - 1].label}
          </p>

          {formError && (
            <p className="mb-3 text-sm text-red-600">{formError}</p>
          )}
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Personal info */}
            {step === 1 && (
              <>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
              </>
            )}

            {/* Step 2: Security */}
            {step === 2 && (
              <>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat your password"
                      className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-orange-500 shrink-0"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">
                      Terms & Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </>
            )}

            {/* Bottom navigation */}
            <div className="flex gap-3 pt-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="flex items-center justify-center gap-2 py-3 px-6 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shrink-0"
                >
                  <ArrowLeft className="size-4" />
                  Back
                </button>
              )}
              {step === 1 ? (
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canProceedStep1}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="size-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={formLoading || !canProceedStep2}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formLoading ? "Creating account…" : "Create account"}
                  <ArrowRight className="size-4" />
                </button>
              )}
            </div>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">Or sign up with</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {socialError && (
            <p className="mb-3 text-sm text-red-600">{socialError}</p>
          )}
          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialSignup("google")}
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
              {socialLoading === "google" ? "Signing up…" : "Google"}
            </button>
            <button
              type="button"
              onClick={() => handleSocialSignup("facebook")}
              disabled={socialLoading}
              className="flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <svg className="size-4" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              {socialLoading === "facebook" ? "Signing up…" : "Facebook"}
            </button>
          </div>

          {/* Step indicators (bottom) */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => s.id < step && setStep(s.id)}
                  className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium transition-colors ${
                    step >= s.id
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  } ${s.id < step ? "cursor-pointer hover:bg-orange-400" : ""}`}
                >
                  {step > s.id ? <Check className="size-3" /> : s.id}
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className={`w-6 h-0.5 mx-0.5 ${
                      step > s.id ? "bg-orange-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Sign in link */}
          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-500 hover:text-orange-600 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* ── Right Panel – Image + Copy ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden min-h-[calc(100vh-4rem)]">
        <ImageWithFallback
          src={heroImages[0]}
          alt="Furnish interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-10">
          <div className="max-w-md">
            <p className="text-orange-400 text-xs font-semibold tracking-widest uppercase mb-3">
              Join the Furnish community
            </p>
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">
              Create your{" "}
              <span className="text-orange-500">dream room</span>
            </h2>
            <p className="text-gray-200 text-sm leading-relaxed">
              Sign up to save designs, revisit your favorite layouts, and explore
              furniture combinations tailored to your style.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
