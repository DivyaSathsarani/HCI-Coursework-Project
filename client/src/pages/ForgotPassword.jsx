// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Footer from "../components/layout/Footer";
import { ArrowRight } from "lucide-react";

const sideImage =
  "https://images.unsplash.com/photo-1687180497278-ca4d736ecc99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    const savedEmail =
      localStorage.getItem("userEmail") || "admin@example.com";

    if (email !== savedEmail) {
      alert("Email not found");
      return;
    }

    localStorage.setItem("userPassword", newPassword);
    alert("Password reset successful!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen lg:h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <ImageWithFallback
          src={sideImage}
          alt="Furnish interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <Link to="/home" className="flex items-center gap-2">
            <div className="bg-orange-500 rounded-lg w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold text-sm leading-none">F</span>
            </div>
            <span className="text-white text-xl font-semibold">Furnish</span>
          </Link>
          <div>
            <p className="text-orange-400 text-xs font-semibold tracking-widest uppercase mb-3">
              Premium Furniture Design
            </p>
            <h2 className="text-white text-4xl font-bold leading-tight mb-4">
              Reset Your{" "}
              <span className="text-orange-500">Password</span>
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Enter your email and we'll help you get back into your account.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 sm:px-14 lg:px-20 py-12 bg-white overflow-y-auto lg:overflow-hidden">
        <Link to="/home" className="flex items-center gap-2 mb-10 lg:absolute lg:top-8 lg:left-8 lg:mb-0">
          <div className="bg-orange-500 rounded-lg w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold text-sm leading-none">F</span>
          </div>
          <span className="text-gray-900 text-xl font-semibold">Furnish</span>
        </Link>

        <div className="max-w-sm w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reset password
            </h1>
            <p className="text-gray-500 text-sm">
              Enter your email and new password below
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-5">
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
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Reset password
              <ArrowRight className="size-4" />
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-orange-500 hover:text-orange-600 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
