import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Search, Sparkles } from 'lucide-react';
import { TripPreferences } from '../types';

interface TripFormProps {
  onSubmit: (prefs: TripPreferences) => void;
  isLoading: boolean;
  initialValues?: TripPreferences;
}

export const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading, initialValues }) => {
  const [formData, setFormData] = useState<TripPreferences>({
    destination: '',
    days: 5,
    budget: 'Standard',
    interests: [],
    month: 'May'
  });

  useEffect(() => {
    if (initialValues) setFormData(initialValues);
  }, [initialValues]);

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest) 
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const interestsList = ["Food", "Nature", "Adventure", "History", "Relaxation", "Shopping", "Nightlife", "Art"];

  return (
    <div className="relative">
      {/* Hero Background */}
      <div className="h-[600px] bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 -mt-20">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-brand-200 text-sm font-medium mb-6 border border-white/10">
            <Sparkles size={14} className="mr-2" />
            AI-Powered Itineraries
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Your Dream Trip,<br/>Planned in Seconds.
          </h1>
          <p className="text-lg text-brand-100 max-w-2xl">
            Stop searching, start exploring. Tell us where you want to go, and our AI will build the perfect schedule, budget, and guide for you.
          </p>
        </div>
      </div>

      {/* Floating Search Widget */}
      <div className="max-w-4xl mx-auto px-4 relative z-20 -mt-24">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-slate-900/20 p-6 md:p-8 border border-slate-100 dark:border-slate-700">
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Destination */}
              <div className="col-span-1 lg:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Where to?</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    placeholder="E.g. Tokyo, Paris, Bali" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  />
                </div>
              </div>

              {/* Days */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input 
                    type="number" 
                    min={1} max={14}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white"
                    value={formData.days}
                    onChange={(e) => setFormData({...formData, days: parseInt(e.target.value) || 1})}
                  />
                  <span className="absolute right-3 top-3.5 text-xs text-slate-500 font-medium pointer-events-none">DAYS</span>
                </div>
              </div>

               {/* Month */}
               <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">When?</label>
                <select 
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none dark:text-white appearance-none"
                  value={formData.month}
                  onChange={(e) => setFormData({...formData, month: e.target.value})}
                >
                  {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Budget & Interests */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100 dark:border-slate-700">
               <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Budget Style</label>
                  <div className="flex gap-2">
                    {['Budget', 'Standard', 'Luxury'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setFormData({...formData, budget: b as any})}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${
                          formData.budget === b 
                            ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-500 text-brand-700 dark:text-brand-300' 
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Trip Vibe</label>
                  <div className="flex flex-wrap gap-2">
                    {interestsList.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          formData.interests.includes(interest)
                            ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-transparent'
                            : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading || !formData.destination}
              className="w-full bg-accent-500 hover:bg-accent-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-accent-500/25 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center text-lg"
            >
              {isLoading ? (
                <span className="flex items-center"><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div> Generating Itinerary...</span>
              ) : (
                <span className="flex items-center"><Search className="mr-2" /> Plan My Trip</span>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};