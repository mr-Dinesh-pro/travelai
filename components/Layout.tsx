import React, { useState } from 'react';
import { Plane, Moon, Sun, LogOut, ChevronDown, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: { name: string } | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onNavigate: () => void;
  onFeatureClick: (feature: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, darkMode, toggleDarkMode, user, onSignIn, onSignOut, onNavigate, onFeatureClick
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={onNavigate}>
              <div className="bg-brand-600 p-1.5 rounded-lg text-white mr-2 shadow-lg shadow-brand-500/30">
                <Plane size={20} className="transform -rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Travo<span className="text-brand-600">Genie</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              <button onClick={onNavigate} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors">Plan Trip</button>
              <button onClick={() => onFeatureClick('Hotels')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors">Hotels</button>
              <button onClick={() => onFeatureClick('Flights')} className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors">Flights</button>
              
              <div className="h-5 w-px bg-slate-300 dark:bg-slate-700 mx-2"></div>

              <button onClick={toggleDarkMode} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {user ? (
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-300 flex items-center justify-center font-bold text-xs">
                      {user.name[0]}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{user.name}</span>
                    <ChevronDown size={14} className="text-slate-400" />
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 animate-slide-up origin-top-right overflow-hidden">
                      <button onClick={() => { onSignOut(); setProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center">
                        <LogOut size={14} className="mr-2" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={onSignIn} className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-full shadow-lg shadow-brand-500/20 transition-all hover:scale-105">
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Menu Btn */}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-sm text-slate-500">
        <p>© 2025 TravoGenie Inc. Smart Travel Planning.</p>
      </footer>
    </div>
  );
};