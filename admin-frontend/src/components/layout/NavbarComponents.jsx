import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiBell,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMoon,
  FiSun,
  FiCheckCircle,
  FiAlertCircle,
  FiClock
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { Avatar, Badge } from '../common/UIComponents';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xs md:max-w-sm hidden sm:block">
      <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Global Search (Press '/')..."
        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all"
      />
    </form>
  );
};

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const notifications = [
    { id: 1, title: 'New Correction Request', desc: 'Elena Rostova updated current position', time: '10 min ago', icon: FiClock, color: 'text-amber-500 bg-amber-50' },
    { id: 2, title: 'Employer Verified', desc: 'Catch Steak NYC completed onboarding audit', time: '1 hour ago', icon: FiCheckCircle, color: 'text-emerald-500 bg-emerald-50' },
    { id: 3, title: 'Disputed Reference', desc: 'Work history WH-5009 flagged by employer', time: '3 hours ago', icon: FiAlertCircle, color: 'text-red-500 bg-red-50' },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
      >
        <FiBell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-600 ring-2 ring-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">Notifications</span>
              <Badge variant="teal">3 New</Badge>
            </div>

            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
              {notifications.map((n) => {
                const Icon = n.icon;
                return (
                  <div key={n.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer">
                    <div className={`p-2 rounded-xl shrink-0 ${n.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900">{n.title}</p>
                      <p className="text-xs text-slate-500 truncate">{n.desc}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors"
      >
        <Avatar src={user.avatar} name={user.name} size="sm" />
        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-bold text-slate-900 leading-tight">{user.name}</span>
          <span className="text-[10px] text-slate-500 font-medium">{user.role}</span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-xs font-bold text-slate-900">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>

            <div className="py-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/profile');
                }}
                className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <FiUser className="w-4 h-4 text-slate-400" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/settings');
                }}
                className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <FiSettings className="w-4 h-4 text-slate-400" />
                <span>Account Settings</span>
              </button>
            </div>

            <div className="pt-1 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ThemeSwitcher = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors"
      title="Toggle theme"
    >
      {isDark ? <FiSun className="w-5 h-5 text-amber-500" /> : <FiMoon className="w-5 h-5" />}
    </button>
  );
};
