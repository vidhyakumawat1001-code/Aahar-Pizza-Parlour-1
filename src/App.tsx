import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Pizza, Menu as MenuIcon, Image as ImageIcon, MessageSquare, Shield, LogOut, X, Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---
import Home from './pages/Home';
import MenuPage from './pages/MenuPage';
import GalleryPage from './pages/GalleryPage';
import ReviewPage from './pages/ReviewPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminLogin from './pages/Admin/AdminLogin';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for admin token
    const token = localStorage.getItem('adminToken');
    setIsAdmin(token === 'pizza-admin-secret-token');
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdmin(false);
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Pizza className="w-12 h-12 text-brand-red" />
        </motion.div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-brand-cream font-sans text-stone-900">
        <Navbar isAdmin={isAdmin} onLogout={handleLogout} />
        <main className="pt-20 pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/*" 
              element={
                isAdmin ? (
                  <AdminDashboard />
                ) : (
                  <AdminLogin />
                )
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function Navbar({ isAdmin, onLogout }: { isAdmin: boolean; onLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Pizza },
    { name: 'Menu', path: '/menu', icon: MenuIcon },
    { name: 'Gallery', path: '/gallery', icon: ImageIcon },
    { name: 'Review', path: '/review', icon: MessageSquare },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin', icon: Shield });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-brand-red p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-brand-red/20">
              <Pizza className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-stone-900">
              Aahar<span className="text-brand-red">Pizza</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-red flex items-center gap-1.5",
                  location.pathname === link.path ? "text-brand-red" : "text-stone-600"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <button
                onClick={onLogout}
                className="text-sm font-medium text-stone-500 hover:text-red-600 flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-stone-200 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 text-lg font-medium p-2 rounded-lg",
                    location.pathname === link.path ? "bg-brand-red/10 text-brand-red" : "text-stone-600"
                  )}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 text-lg font-medium p-2 rounded-lg text-red-600 w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Pizza className="w-6 h-6 text-brand-yellow" />
              <span className="text-xl font-bold text-white">Aahar Pizza</span>
            </div>
            <p className="text-sm leading-relaxed">
              Crafting the finest pizzas with passion and the freshest ingredients. 
              Join us for a slice of heaven.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/menu" className="hover:text-brand-yellow transition-colors">Our Menu</Link></li>
              <li><Link to="/gallery" className="hover:text-brand-yellow transition-colors">Gallery</Link></li>
              <li><Link to="/review" className="hover:text-brand-yellow transition-colors">Leave a Review</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li>123 Pizza Lane, Foodie City</li>
              <li>Phone: (555) 123-4567</li>
              <li>Email: hello@aaharpizza.com</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-800 mt-12 pt-8 text-center text-xs">
          © {new Date().getFullYear()} Aahar Pizza Parlour. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
