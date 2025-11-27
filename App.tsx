import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { TripForm } from './components/TripForm';
import { TripResult } from './components/TripResult';
import { generateTripPlan } from './services/geminiService';
import { TripPreferences, TripPlan, ViewState } from './types';
import { AlertTriangle, Plane } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState<ViewState>('FORM');
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleFormSubmit = async (prefs: TripPreferences) => {
    setView('LOADING');
    setError(null);
    try {
      const plan = await generateTripPlan(prefs);
      setTripPlan(plan);
      setView('RESULT');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please check your API key and try again.");
      setView('ERROR');
    }
  };

  const handleReset = () => {
    setTripPlan(null);
    setView('FORM');
    setError(null);
  };

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      {view === 'FORM' && (
        <div className="animate-slide-up">
          <TripForm onSubmit={handleFormSubmit} isLoading={false} />
        </div>
      )}

      {view === 'LOADING' && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
           <div className="relative w-32 h-32 mb-8">
              {/* Outer Ring */}
              <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
              {/* Spinning Ring */}
              <div className="absolute inset-0 border-4 border-brand-500 rounded-full border-t-transparent animate-spin"></div>
              {/* Plane Icon */}
              <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                <Plane className="w-12 h-12 text-brand-600 transform -rotate-45" />
              </div>
           </div>
           <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Preparing for Takeoff...</h2>
           <p className="text-slate-500 dark:text-slate-400">Curating the perfect itinerary for you.</p>
        </div>
      )}

      {view === 'RESULT' && tripPlan && (
        <TripResult plan={tripPlan} onReset={handleReset} />
      )}

      {view === 'ERROR' && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-full mb-6 border border-red-100 dark:border-red-900/30">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Flight Delayed</h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-md mb-8">{error}</p>
          <button 
            onClick={handleReset}
            className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 font-semibold"
          >
            Try Again
          </button>
        </div>
      )}
    </Layout>
  );
}

export default App;