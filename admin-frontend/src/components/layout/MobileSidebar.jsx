import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiCoffee, FiLogOut } from 'react-icons/fi';
import { NAV_ITEMS } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export const MobileSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 lg:hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Drawer */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-white shadow-2xl z-10 flex flex-col border-r border-slate-200"
        >
          {/* Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center font-bold">
                <FiCoffee className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 text-base">KTH Hub</span>
                <span className="text-[10px] font-bold text-teal-600 uppercase">Admin Portal</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`ml-auto px-2 py-0.5 text-[11px] font-bold rounded-full ${isActive ? 'bg-white text-teal-800' : 'bg-teal-100 text-teal-800'
                      }`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Logout */}
          <div className="p-3 border-t border-slate-100">
            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <FiLogOut className="w-5 h-5 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
