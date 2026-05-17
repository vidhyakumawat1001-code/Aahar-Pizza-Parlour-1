import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, Eye, EyeOff, Key, HelpCircle, ArrowLeft, Check } from 'lucide-react';

type Mode = 'login' | 'change' | 'forgot';

const STORAGE_KEY = 'aahar_admin_password';
const SECRET_HINT = 'pizza123';

function getSavedPassword() {
  return localStorage.getItem(STORAGE_KEY) || 'admin123';
}

export default function AdminLogin() {
  const [mode, setMode] = useState<Mode>('login');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [changeMsg, setChangeMsg] = useState('');
  const [changeError, setChangeError] = useState('');

  const [hint, setHint] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === getSavedPassword()) {
      localStorage.setItem('adminToken', 'pizza-admin-secret-token');
      window.location.href = '/admin';
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');
    setChangeMsg('');
    if (currentPwd !== getSavedPassword()) {
      setChangeError('Current password is incorrect.');
      return;
    }
    if (newPwd.length < 6) {
      setChangeError('New password must be at least 6 characters.');
      return;
    }
    if (newPwd !== confirmPwd) {
      setChangeError('New passwords do not match.');
      return;
    }
    localStorage.setItem(STORAGE_KEY, newPwd);
    setChangeMsg('Password changed successfully!');
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
    setTimeout(() => { setMode('login'); setChangeMsg(''); }, 1500);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotMsg('');
    if (hint.toLowerCase().trim() === SECRET_HINT) {
      setForgotMsg(`Your current password is: "${getSavedPassword()}"`);
    } else {
      setForgotError('Incorrect hint. Try "pizza123" as the secret hint.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <AnimatePresence mode="wait">

        {mode === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-md w-full bg-white p-12 rounded-[2.5rem] border border-stone-100 shadow-2xl space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-brand-red/10 rounded-3xl flex items-center justify-center mx-auto">
                <Shield className="w-10 h-10 text-brand-red" />
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Admin Login</h1>
                <p className="text-stone-500 text-sm">Enter password to manage your parlour</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                  placeholder="Admin Password"
                  className="w-full pl-12 pr-12 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-brand-red outline-none transition-all"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {loginError && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-xs font-medium text-center">{loginError}</motion.p>
              )}

              <button type="submit"
                className="w-full py-4 bg-stone-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-xl shadow-stone-200">
                Login as Admin
              </button>
            </form>

            <div className="flex justify-between pt-2">
              <button onClick={() => { setMode('forgot'); setForgotMsg(''); setForgotError(''); setHint(''); }}
                className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-brand-red transition-colors font-medium">
                <HelpCircle className="w-4 h-4" /> Forgot Password
              </button>
              <button onClick={() => { setMode('change'); setChangeMsg(''); setChangeError(''); }}
                className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-brand-red transition-colors font-medium">
                <Key className="w-4 h-4" /> Change Password
              </button>
            </div>

            <p className="text-[10px] text-stone-400 text-center uppercase tracking-widest font-bold">
              Protected by pizza security
            </p>
          </motion.div>
        )}

        {mode === 'change' && (
          <motion.div
            key="change"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="max-w-md w-full bg-white p-12 rounded-[2.5rem] border border-stone-100 shadow-2xl space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-brand-red/10 rounded-3xl flex items-center justify-center mx-auto">
                <Key className="w-10 h-10 text-brand-red" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Change Password</h1>
                <p className="text-stone-500 text-sm mt-1">Set a new admin password</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {[
                { label: 'Current Password', val: currentPwd, set: setCurrentPwd },
                { label: 'New Password', val: newPwd, set: setNewPwd },
                { label: 'Confirm New Password', val: confirmPwd, set: setConfirmPwd },
              ].map(({ label, val, set }) => (
                <div key={label}>
                  <label className="text-xs font-bold text-stone-400 uppercase mb-1 block">{label}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                    <input
                      type="password"
                      value={val}
                      onChange={e => set(e.target.value)}
                      placeholder={label}
                      className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-brand-red outline-none text-sm"
                      required
                    />
                  </div>
                </div>
              ))}

              {changeError && <p className="text-red-500 text-xs text-center">{changeError}</p>}
              {changeMsg && (
                <p className="text-green-600 text-xs text-center flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> {changeMsg}
                </p>
              )}

              <button type="submit"
                className="w-full py-4 bg-brand-red hover:bg-red-900 text-white font-bold rounded-2xl transition-all">
                Update Password
              </button>
            </form>

            <button onClick={() => setMode('login')}
              className="flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700 transition-colors mx-auto">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
          </motion.div>
        )}

        {mode === 'forgot' && (
          <motion.div
            key="forgot"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="max-w-md w-full bg-white p-12 rounded-[2.5rem] border border-stone-100 shadow-2xl space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-brand-red/10 rounded-3xl flex items-center justify-center mx-auto">
                <HelpCircle className="w-10 h-10 text-brand-red" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Forgot Password</h1>
                <p className="text-stone-500 text-sm mt-1">Enter the secret hint to recover your password</p>
              </div>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-400 uppercase mb-1 block">Secret Hint</label>
                <input
                  type="text"
                  value={hint}
                  onChange={e => { setHint(e.target.value); setForgotError(''); setForgotMsg(''); }}
                  placeholder="Enter secret hint"
                  className="w-full px-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-2 focus:ring-brand-red outline-none"
                  required
                />
                <p className="text-[11px] text-stone-400 mt-1">Hint: it's your favourite food 🍕</p>
              </div>

              {forgotError && <p className="text-red-500 text-xs text-center">{forgotError}</p>}
              {forgotMsg && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
                  <p className="text-green-700 text-sm font-semibold">{forgotMsg}</p>
                </div>
              )}

              <button type="submit"
                className="w-full py-4 bg-brand-red hover:bg-red-900 text-white font-bold rounded-2xl transition-all">
                Recover Password
              </button>
            </form>

            <button onClick={() => setMode('login')}
              className="flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700 transition-colors mx-auto">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
