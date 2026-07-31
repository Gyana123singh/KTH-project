import React from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export const Card = ({ children, className = '', hover = true, ...props }) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 transition-all duration-200 ${
        hover ? 'hover:shadow-md hover:border-slate-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const StatCard = ({
  title,
  value,
  trend,
  trendType = 'up',
  subtext,
  icon: Icon,
  color = 'teal',
}) => {
  const colors = {
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
    >
      {/* Decorative background accent circle */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-slate-50 opacity-50 pointer-events-none" />

      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${colors[color]} shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-1">
        <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
        {trend && (
          <div
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              trendType === 'up'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
          >
            {trendType === 'up' ? <FiTrendingUp className="w-3.5 h-3.5" /> : <FiTrendingDown className="w-3.5 h-3.5" />}
            <span>{trend}</span>
          </div>
        )}
      </div>

      {subtext && <p className="text-xs text-slate-500 mt-2 font-medium">{subtext}</p>}
    </motion.div>
  );
};

export const ChartCard = ({ title, subtitle, children, action, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-xs ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};
