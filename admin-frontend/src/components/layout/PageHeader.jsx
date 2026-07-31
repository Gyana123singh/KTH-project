import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiChevronRight, FiHome } from 'react-icons/fi';

export const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-3">
      <Link to="/" className="hover:text-teal-700 transition-colors flex items-center gap-1">
        <FiHome className="w-3.5 h-3.5" />
        <span>Dashboard</span>
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');

        return (
          <React.Fragment key={name}>
            <FiChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            {isLast ? (
              <span className="font-bold text-slate-900 capitalize">{formattedName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-teal-700 transition-colors capitalize">
                {formattedName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <Breadcrumb />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 font-medium mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
    </div>
  );
};
