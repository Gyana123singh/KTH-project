import React from 'react';
import { FiMenu } from 'react-icons/fi';
import { SearchBar, NotificationDropdown, ProfileDropdown, ThemeSwitcher } from './NavbarComponents';

export const Navbar = ({ onOpenMobileMenu }) => {
  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        {/* Mobile drawer menu trigger */}
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open Mobile Menu"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <SearchBar />
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeSwitcher />
        <NotificationDropdown />
        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />
        <ProfileDropdown />
      </div>
    </header>
  );
};
