import React, { useState } from 'react';
import { TripPreferences } from '../types';
import { MapPin, Calendar, Wallet, Heart, Search, Check } from 'lucide-react';

interface TripFormProps {
  onSubmit: (prefs: TripPreferences) => void;
  isLoading: boolean;
}

const INTERESTS_LIST = [
  "Food & Dining", "Culture", "Nature", 
  "Adventure", "Shopping", "Nightlife", 
  "Relaxation", "Art", "Beaches"
];

const BUDGET_OPTIONS = [
  { value: "Budget", label: "Economy", desc: "$ - $$" },
  { value: "Standard", label: "Comfort", desc: "$$ - $$$" },
  { value: "Luxury", label: "Premium", desc: "$$$$+" }
];

export const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<TripPreferences>({
    destination: '',
    days: 5,
    budget: 'Standard',
    interests: [],
    month: new Date().toLocaleString('default', { month: 'long' })
  });

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => {
      const exists = prev.interests.includes(interest);
      if (exists) return { ...prev, interests: prev.interests.filter(i => i !== interest) };
      return { ...prev, interests: [...prev.interests, interest] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full relative pb-20">
      {/* Hero Banner Area */}
      <div className="bg-gradient-to-r from-brand-700 to-brand-500 dark:from-brand-900 dark:to-brand-800 py-16 sm:py-24 px-4 text-center text-white relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Plan your dream getaway.
          </h1>
          <p className="text-brand-100 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Experience the world with AI-curated itineraries tailored just for you.
          </p>
        </div>
      </div>

      {/* Booking Widget / Search Form */}
      <div className="max-w-5xl mx-auto px-4 -mt-12 relative z-20">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Destination Input - Wide */}
              <div className="md:col-span-12 lg:col-span-4 space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Destination</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400 group-focus-within:text-brand-600" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Where are you going?"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow sm:text-sm font-medium"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  />
                </div>
              </div>

              {/* Month & Duration */}
              <div className="md:col-span-6 lg:col-span-4 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration</label>
                   <div className="relative group">
                      <input
                        type="number"
                        min="1"
                        max="30"
                        required
                        className="block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow sm:text-sm font-medium"
                        value={formData.days}
                        onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) || 1 })}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium pointer-events-none">Days</span>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">When</label>
                   <select
                    className="block w-full px-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-shadow sm:text-sm font-medium"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                  >
                    {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget */}
              <div className="md:col-span-6 lg:col-span-4 space-y-2">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Budget Style</label>
                 <div className="grid grid-cols-3 gap-2">
                    {BUDGET_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, budget: option.value })}
                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border transition-all ${
                          formData.budget === option.value
                            ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-500 text-brand-700 dark:text-brand-300'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        <span className="text-sm font-bold">{option.label}</span>
                        <span className="text-[10px] opacity-70">{option.desc}</span>
                      </button>
                    ))}
                 </div>
              </div>

              {/* Interests - Full Width */}
              <div className="md:col-span-12 space-y-2">
                <label className="flex items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <Heart className="w-3 h-3 mr-1" /> Trip Vibe (Select multiple)
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS_LIST.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                        formData.interests.includes(interest)
                          ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-transparent'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-slate-400'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button - Full Width */}
              <div className="md:col-span-12 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-accent-500/25 transform transition-all hover:-translate-y-0.5 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating your itinerary...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Build My Trip</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </form>
          
          {/* Trust Indicators */}
          <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
             <div className="flex items-center"><Check size={14} className="mr-1.5 text-green-500" /> Free Cancellation options</div>
             <div className="flex items-center"><Check size={14} className="mr-1.5 text-green-500" /> AI-Optimized Routes</div>
             <div className="flex items-center"><Check size={14} className="mr-1.5 text-green-500" /> Budget Smart</div>
          </div>
        </div>
      </div>
    </div>
  );
};