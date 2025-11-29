import React, { useEffect } from 'react';
import { Check, Info, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'error';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <Check size={18} className="text-green-500" />,
    info: <Info size={18} className="text-brand-500" />,
    error: <AlertCircle size={18} className="text-red-500" />
  };

  const bgColors = {
    success: 'bg-white dark:bg-slate-800 border-green-500',
    info: 'bg-white dark:bg-slate-800 border-brand-500',
    error: 'bg-white dark:bg-slate-800 border-red-500'
  };

  return (
    <div className={`fixed top-20 right-4 z-[70] animate-slide-up`}>
      <div className={`flex items-center p-4 rounded-xl shadow-2xl border-l-4 ${bgColors[type]} max-w-sm w-full`}>
        <div className="flex-shrink-0 mr-3">
          {icons[type]}
        </div>
        <div className="flex-1 mr-2">
          <p className="text-sm font-medium text-slate-800 dark:text-white">
            {message}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};