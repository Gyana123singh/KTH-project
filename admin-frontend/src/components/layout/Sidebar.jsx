import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiGrid,
  FiUsers,
  FiBriefcase,
  FiClock,
  FiSearch,
  FiCheckSquare,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiCoffee
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/', icon: FiGrid },
  { label: 'Employees', path: '/employees', icon: FiUsers },
  { label: 'Employer Profiles', path: '/employers', icon: FiBriefcase },
  { label: 'Work History', path: '/work-history', icon: FiClock },
  { label: 'Search', path: '/search', icon: FiSearch },
  { label: 'Corrections Queue', path: '/corrections', icon: FiCheckSquare, badge: '4' },
  { label: 'Analytics', path: '/analytics', icon: FiBarChart2 },
  { label: 'Settings', path: '/settings', icon: FiSettings },
  { label: 'Profile', path: '/profile', icon: FiUser },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside
      className={`hidden lg:flex flex-col border-r border-slate-200 bg-white/95 backdrop-blur-md transition-all duration-300 z-30 relative shrink-0 ${collapsed ? 'w-20' : 'w-64'
        }`}
    >
      {/* Brand Header */}
      <div className={`h-16 flex items-center border-b border-slate-100 transition-all ${
        collapsed ? 'justify-center px-2' : 'justify-between px-4'
      }`}>
        {collapsed ? (
          <button
            onClick={() => setCollapsed(false)}
            className="w-10 h-10 rounded-xl bg-teal-700 hover:bg-teal-800 text-white flex items-center justify-center font-bold shadow-xs transition-colors cursor-pointer"
            title="Expand Sidebar"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                <FiCoffee className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg leading-tight">KTH Hub</span>
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Kitchen Talent</span>
              </div>
            </div>

            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              title="Collapse Sidebar"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Nav Menu */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group relative ${isActive
                  ? 'bg-teal-700 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }`
              }
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-700'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className={`ml-auto px-2 py-0.5 text-[11px] font-bold rounded-full ${isActive ? 'bg-white text-teal-800' : 'bg-teal-100 text-teal-800'
                  }`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <FiLogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
