import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { TripForm } from './components/TripForm';
import { TripResult } from './components/TripResult';
import { AuthModal } from './components/AuthModal';
import { Toast, ToastType } from './components/Toast';
import { generateTripPlan } from './services/geminiService';
import { TripPlan, TripPreferences, ViewState } from './types';

function App() {
  const [view, setView] = useState<ViewState>('FORM');
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<{name: string} | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  
  // Toast State
  const [toast, setToast] = useState<{ msg: string; type: ToastType; visible: boolean }>({
    msg: '', type: 'info', visible: false
  });

  const showToast = (msg: string, type: ToastType) => {
    setToast({ msg, type, visible: true });
  };
  
  // Persistence & Init
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') setDarkMode(true);
    
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleFormSubmit = async (prefs: TripPreferences) => {
    setView('LOADING');
    try {
      const plan = await generateTripPlan(prefs);
      setTripPlan(plan);
      setView('RESULT');
    } catch (err: any) {
      showToast(err.message || 'Something went wrong', 'error');
      setView('ERROR');
    }
  };

  const handleFeatureClick = (feature: string) => {
    showToast(`${feature} booking is coming soon!`, 'info');
  };

  const handleLogin = (name: string) => {
    setUser({name});
    localStorage.setItem('user', JSON.stringify({name}));
    showToast(`Welcome back, ${name}!`, 'success');
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    showToast('Signed out successfully', 'info');
  };

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)}
      user={user}
      onSignIn={() => setAuthOpen(true)}
      onSignOut={handleSignOut}
      onNavigate={() => setView('FORM')}
      onFeatureClick={handleFeatureClick}
    >
      <AuthModal 
        isOpen={authOpen} 
        onClose={() => setAuthOpen(false)} 
        onLogin={handleLogin}
      />

      <Toast 
        message={toast.msg} 
        type={toast.type} 
        isVisible={toast.visible} 
        onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
      />

      {view === 'FORM' && (
        <TripForm onSubmit={handleFormSubmit} isLoading={false} />
      )}

      {view === 'LOADING' && (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Planning your trip...</h2>
          <p className="text-slate-500 mt-2">Our AI is checking flights, hotels, and local gems.</p>
        </div>
      )}

      {view === 'RESULT' && tripPlan && (
        <TripResult plan={tripPlan} onReset={() => setView('FORM')} />
      )}

      {view === 'ERROR' && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Trip Planning Failed</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">We couldn't generate your itinerary at this moment.</p>
          <button onClick={() => setView('FORM')} className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">Try Again</button>
        </div>
      )}
    </Layout>
  );
}

export default App;