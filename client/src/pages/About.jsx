import { Link } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import {
  ArrowRight,
  Sparkles,
  Layout,
  Save,
  Palette,
  Zap,
  Target,
  Eye,
} from "lucide-react";

const heroImage =
  "https://images.unsplash.com/photo-1687180497278-ca4d736ecc99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080";

const features = [
  {
    icon: Zap,
    title: "Real-time Room Customization",
    desc: "See changes instantly as you add furniture, adjust layouts, and experiment with different arrangements.",
  },
  {
    icon: Palette,
    title: "Style Collections",
    desc: "Choose from curated style collections—Scandinavian, Modern, Luxury—and apply them to your space.",
  },
  {
    icon: Save,
    title: "Save & Reuse Designs",
    desc: "Save your designs to the cloud and revisit them anytime. Share with family or professionals.",
  },
  {
    icon: Layout,
    title: "Easy-to-Use Editor",
    desc: "Intuitive 2D and 3D views let you design rooms without any technical skills. Drag, drop, and customize.",
  },
  {
    icon: Sparkles,
    title: "Custom Walls & Tiles",
    desc: "Customize walls, floor textures, and tiles to match your vision. Mix materials and finishes.",
  },
  {
    icon: Target,
    title: "Furniture Library",
    desc: "Access a growing library of furniture pieces. Add sofas, beds, desks, and more with one click.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <ImageWithFallback src={heroImage} alt="Furnish interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          <p className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-4">About the Platform</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-5">Web-Based Interactive Room Visualization System</h1>
          <p className="text-lg text-gray-200 max-w-2xl leading-relaxed">
            Furnish is a Web-Based Interactive Room Visualization System that empowers you to design and visualize your rooms in real-time—before you buy a single piece of furniture.
          </p>
        </div>
      </section>

      {/* ── Company Overview ── */}
      <section className="py-24 bg-gray-50 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Do</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our system lets you design and visualize rooms in both 2D and 3D. Draw walls, place furniture from the library, and apply different floor and wall textures while seeing the impact instantly.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Whether you're planning a bedroom, living room, or home office, the interactive editor helps you experiment with layouts and styles. Apply style collections, customize walls, tiles, and furniture, and save your designs for later.
              </p>
              <p className="text-gray-600 leading-relaxed">
                No technical skills required—just drag, drop, and design. Your Web-Based Interactive Room Visualization System keeps everything in the browser.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Highlights</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  Design rooms with 2D layout and 3D visualization
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  Apply style collections and customize walls & tiles
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  Add furniture from our growing library
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  Save and reuse designs in the cloud
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-24 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Furnish</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Web-based room visualization and interior design customization tools tailored to your needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="size-6 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-24 bg-gray-50 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Target className="size-8 text-orange-500" />
                <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To make interactive room visualization accessible to everyone. We believe everyone deserves to design and customize their own spaces in real-time—without expensive software or design expertise.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="size-8 text-orange-500" />
                <h3 className="text-xl font-semibold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To become the go-to Web-Based Interactive Room Visualization System for exploring layouts, finishes, and furniture. We aim to connect designers, homeowners, and furniture brands in one seamless experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 px-6 lg:px-10 bg-orange-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Design Your Space?</h2>
          <p className="text-orange-100 mb-10">
            Join thousands of users who have already created their perfect rooms. Start designing today.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-orange-500 text-sm font-semibold rounded-lg hover:bg-orange-50 transition-colors"
          >
            Start Designing
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
