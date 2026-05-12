import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple local password check
    if (password === 'admin123') {
      localStorage.setItem('adminToken', 'pizza-admin-secret-token');
      window.location.href = '/admin'; // Force reload to update state
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-12 rounded-[2.5rem] border border-stone-100 shadow-2xl space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-brand-red/10 rounded-3xl flex items-center justify-center mx-auto">
            <Shield className="w-10 h-10 text-brand-red" />
          </div>
          
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
            <p className="text-stone-500 text-sm">
              Enter password to manage your parlour
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full pl-12 pr-12 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-brand-red outline-none transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs font-medium text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-stone-900 border border-stone-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-xl shadow-stone-200"
          >
            Login as Admin
          </button>
        </form>

        <p className="text-[10px] text-stone-400 text-center uppercase tracking-widest font-bold">
          Protected by pizza security
        </p>
      </motion.div>
    </div>
  );
}
