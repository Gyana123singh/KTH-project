import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiCoffee, FiCheck, FiArrowRight, FiShield } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button, Input } from '../../components/common/UIComponents';

export const LoginPage = () => {
  const [email, setEmail] = useState('admin@kitchentalenthub.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email) newErrors.email = 'Email address is required';
    if (!password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      login(email, password);
      showToast('Welcome back, Chef Marcus! Login successful.', 'success');
      setIsLoading(false);
      navigate('/');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Background Animated Gradient Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-600/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl animate-pulse pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-slate-800/40 z-10"
      >
        {/* Left Illustration / Branding Side (Desktop: Left/Order 1, Mobile: Bottom/Order 2) */}
        <div className="order-2 lg:order-1 lg:col-span-5 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 backdrop-blur-md border border-teal-400/30 flex items-center justify-center text-teal-300">
                <FiCoffee className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-white my-0">Kitchen Talent Hub</h1>
                <p className="text-xs text-teal-300 font-semibold tracking-wide uppercase">Admin Portal v2.4</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl lg:text-3xl font-extrabold leading-tight text-white my-0">
                Enterprise Kitchen Workforce Intelligence.
              </h2>
              <p className="text-sm text-teal-100/80 leading-relaxed font-normal">
                Manage Michelin-level culinary talents, verify multi-restaurant work histories, review voice profiles, and audit employer credentials seamlessly.
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-teal-700/50 space-y-3">
            <div className="flex items-center gap-2.5 text-xs text-teal-200">
              <FiCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Real-time reference verification queue</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-teal-200">
              <FiCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Multilingual voice profile playback player</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-teal-200">
              <FiCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Bank-grade audit log & correction controls</span>
            </div>
          </div>
        </div>

        {/* Right Form Side (Desktop: Right/Order 2, Mobile: Top/Order 1) */}
        <div className="order-1 lg:order-2 lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold mb-3 border border-teal-200">
                <FiShield className="w-3.5 h-3.5" />
                <span>Authorized Admin Access Only</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight my-0">Sign in to Admin Dashboard</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Enter your administrative credentials to manage KTH platform data.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                label="Work Email Address"
                type="email"
                icon={FiMail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="admin@kitchentalenthub.com"
              />

              <Input
                label="Password"
                type="password"
                icon={FiLock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="••••••••••••"
              />

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-700 focus:ring-teal-600 border-slate-300"
                  />
                  <span>Remember this device</span>
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Password reset instructions sent to email.', 'info'); }} className="font-semibold text-teal-700 hover:text-teal-800">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                icon={FiArrowRight}
              >
                Sign In to Dashboard
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Quick Demo Preset</span>
              <button
                onClick={() => {
                  setEmail('admin@kitchentalenthub.com');
                  setPassword('password123');
                  showToast('Autofilled admin credentials', 'info');
                }}
                className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 text-left border border-slate-200 transition-colors flex items-center justify-between"
              >
                <span>Role: Super Admin (Chef Marcus)</span>
                <span className="text-teal-700 font-bold">Auto-fill</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
