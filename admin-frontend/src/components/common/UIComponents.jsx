import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  isLoading = false,
  disabled = false,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer';

  const variants = {
    primary: 'bg-teal-700 hover:bg-teal-800 text-white shadow-sm hover:shadow focus:ring-teal-600',
    secondary: 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 focus:ring-teal-500',
    accent: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm focus:ring-amber-400',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm focus:ring-red-400',
    outline: 'border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-teal-500',
    ghost: 'hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus:ring-slate-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-semibold gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2.5',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};

export const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && <Icon className="absolute left-3.5 text-slate-400 w-4 h-4" />}
        <input
          id={inputId}
          className={`w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition-all duration-200 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 disabled:bg-slate-50 disabled:text-slate-500 ${
            Icon ? 'pl-10' : ''
          } ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
};

export const Select = ({ label, error, options = [], className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-semibold text-slate-700 tracking-wide">{label}</label>}
      <select
        className={`w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 transition-all duration-200 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
};

export const Textarea = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-xs font-semibold text-slate-700 tracking-wide">{label}</label>}
      <textarea
        rows={4}
        className={`w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/20 ${
          error ? 'border-red-500' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
};

export const Badge = ({ children, variant = 'teal', className = '' }) => {
  const badgeVariants = {
    teal: 'bg-teal-50 text-teal-800 border border-teal-200',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    red: 'bg-red-50 text-red-800 border border-red-200',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
    purple: 'bg-purple-50 text-purple-800 border border-purple-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${badgeVariants[variant] || badgeVariants.teal} ${className}`}
    >
      {children}
    </span>
  );
};

export const Avatar = ({ src, name = 'User', size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-24 h-24 text-2xl',
  };

  const getInitials = (n) =>
    n
      ? n
          .split(' ')
          .map((part) => part[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'K';

  return (
    <div className={`relative rounded-full overflow-hidden bg-teal-700 text-white font-bold flex items-center justify-center border border-slate-200 shrink-0 shadow-xs ${sizes[size]} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : null}
      <span>{getInitials(name)}</span>
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full ${maxWidth} z-10 overflow-hidden`}
        >
          {title && (
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          )}
          <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const Drawer = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative bg-white w-full max-w-md h-full shadow-2xl z-10 flex flex-col border-l border-slate-200"
        >
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">{children}</div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-slate-100 sm:px-6">
      <div className="text-xs text-slate-500 font-medium">
        Page <span className="font-bold text-slate-900">{currentPage}</span> of{' '}
        <span className="font-bold text-slate-900">{totalPages}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronLeft className="w-4 h-4" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))
          .map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                page === currentPage
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              {page}
            </button>
          ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <FiSearch className="absolute left-3.5 text-slate-400 w-4 h-4" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 transition-all shadow-xs"
      />
    </div>
  );
};
