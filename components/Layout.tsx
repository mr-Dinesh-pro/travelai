import React from 'react';
import { Plane, Moon, Sun, Globe } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, darkMode, toggleDarkMode }) => {
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      {/* Professional Sticky Header */}
      <header className="fixed w-full z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="bg-brand-600 p-1.5 rounded-lg text-white shadow-md group-hover:bg-brand-700 transition-colors">
                <Plane size={20} className="transform -rotate-45" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
                Travo<span className="text-brand-600">Genie</span>
              </span>
            </div>
            
            {/* Nav Items */}
            <div className="flex items-center space-x-2 md:space-x-6">
              <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                <a href="#" className="hover:text-brand-600 transition-colors">Destinations</a>
                <a href="#" className="hover:text-brand-600 transition-colors">Hotels</a>
                <a href="#" className="hover:text-brand-600 transition-colors">Flights</a>
              </div>
              
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block"></div>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
                aria-label="Toggle Dark Mode"
              >
                {darkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
              </button>
              
              <button className="hidden sm:block px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-full transition-colors shadow-md shadow-brand-500/30">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-16 relative">
         {/* Subtle background glow for depth */}
         <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-50 to-transparent dark:from-brand-950/20 dark:to-transparent -z-10" />
         
        {children}
      </main>

      <footer className="mt-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
             <Globe size={20} className="text-brand-500" />
             <span className="font-bold text-slate-700 dark:text-slate-200">TravoGenie</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} TravoGenie Inc. All rights reserved. • Privacy • Terms
          </p>
        </div>
      </footer>
    </div>
  );
};