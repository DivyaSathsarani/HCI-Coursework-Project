import { Link, useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAuth } from "../utils/AuthContext";
import { ArrowRight, Sparkles, Layout, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const heroImages = [
  "https://images.unsplash.com/photo-1640109229792-a26a0ee366ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsdXh1cnklMjBsaXZpbmclMjByb29tJTIwZnVybml0dXJlfGVufDF8fHx8MTc3MzgxMzI3Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1535049752-3baf525dd015?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBtaW5pbWFsaXN0JTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MzgxMzI3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1758977403403-c51ef509e788?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGluaW5nJTIwcm9vbSUyMGZ1cm5pdHVyZSUyMHRhYmxlfGVufDF8fHx8MTc3MzgxMzI3OXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1764755932155-dabbee87df7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBob21lJTIwb2ZmaWNlJTIwZGVzayUyMHNldHVwfGVufDF8fHx8MTc3MzgxMzI4MHww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1759647020668-648cd90ddce4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwdmVsdmV0JTIwc29mYSUyMGxpdmluZyUyMHNwYWNlfGVufDF8fHx8MTc3MzgxMzI4MXww&ixlib=rb-4.1.0&q=80&w=1080",
];

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1687180497278-ca4d736ecc99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmdXJuaXR1cmUlMjBzaG93cm9vbSUyMGludGVyaW9yJTIwZGVzaWdufGVufDF8fHx8MTc3MzgxMzI4M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    label: "Luxury Collection",
  },
  {
    src: "https://images.unsplash.com/photo-1535049752-3baf525dd015?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2FuZGluYXZpYW4lMjBtaW5pbWFsaXN0JTIwYmVkcm9vbSUyMGludGVyaW9yfGVufDF8fHx8MTc3MzgxMzI3N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    label: "Scandinavian Style",
  },
  {
    src: "https://images.unsplash.com/photo-1758977403403-c51ef509e788?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGluaW5nJTIwcm9vbSUyMGZ1cm5pdHVyZSUyMHRhYmxlfGVufDF8fHx8MTc3MzgxMzI3OXww&ixlib=rb-4.1.0&q=80&w=1080",
    label: "Dining Elegance",
  },
];

export default function Landing() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleStartDesign = () => {
    if (isAuthenticated) {
      navigate("/designer");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative h-screen">
        {/* Background Slider */}
        <div className="absolute inset-0 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <ImageWithFallback
                src={heroImages[currentImageIndex]}
                alt="Furniture showcase"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center pt-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
            <div className="max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-4"
              >
                Web-Based Interactive Room Visualization System
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.7 }}
                className="text-5xl lg:text-6xl font-bold text-white leading-tight mb-5"
              >
                Design and Visualize{" "}
                <span className="text-orange-500">Your Room in Real Time</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="text-lg text-gray-200 mb-8 leading-relaxed"
              >
                Design and visualize your room in real-time. Customize walls, tiles, and furniture instantly to explore different layouts before you make a single change in the real world.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.7 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <button
                  onClick={handleStartDesign}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Start Design
                  <ArrowRight className="size-4" />
                </button>
                <button className="inline-flex items-center justify-center px-6 py-3 border-2 border-white/80 text-white text-sm font-semibold rounded-lg hover:bg-white/10 transition-colors backdrop-blur-sm">
                  View Catalog
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImageIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentImageIndex
                  ? "bg-orange-500 w-7"
                  : "bg-white/50 w-2 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-24 bg-gray-50 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Use Our Room Visualization System
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Web-Based Interactive Room Visualization System for real-time interior design customization
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "Interactive Room Design",
                desc: "Design and visualize your room in real-time as you customize layouts, walls, tiles, and furniture.",
              },
              {
                icon: Layout,
                title: "2D & 3D Visualization",
                desc: "Switch between 2D layout and 3D visualization to understand how every decision affects your space.",
              },
              {
                icon: Users,
                title: "For Designers & Homeowners",
                desc: "Built for both interior designers and homeowners who want a simple, web-based way to explore room ideas.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="size-6 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery Section ── */}
      <section id="gallery" className="py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Latest Designs
            </h2>
            <p className="text-gray-500">
              Explore our portfolio of stunning furniture creations
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {galleryImages.map(({ src, label }) => (
              <div
                key={label}
                className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <ImageWithFallback
                  src={src}
                  alt={label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-5 left-5 text-white">
                    <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider mb-1">
                      Featured
                    </p>
                    <h4 className="font-semibold text-lg">{label}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 px-6 lg:px-10 bg-orange-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-orange-100 mb-10">
            Join thousands of satisfied customers who have brought their
            furniture dreams to life.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-orange-500 text-sm font-semibold rounded-lg hover:bg-orange-50 transition-colors"
          >
            Start Your Design Journey
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}