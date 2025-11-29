import React, { useRef } from 'react';
import { TripPlan } from '../types';
import { BudgetChart } from './BudgetChart';
import { Download, Share2, MapPin, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TripResultProps {
  plan: TripPlan;
  onReset: () => void;
}

export const TripResult: React.FC<TripResultProps> = ({ plan, onReset }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!printRef.current) return;
    const element = printRef.current;
    // Temporary style for clean print
    element.classList.add('bg-white', 'text-slate-900', 'p-6');
    element.classList.remove('dark:bg-slate-950');

    try {
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`TravoGenie-${plan.destination}.pdf`);
    } finally {
      element.classList.remove('bg-white', 'text-slate-900', 'p-6');
    }
  };

  const shareTrip = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-slide-up">
      
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <button onClick={onReset} className="text-slate-500 hover:text-brand-600 flex items-center font-medium transition-colors">
          <ArrowRight className="rotate-180 mr-2" size={18} /> Plan Another Trip
        </button>
        <div className="flex gap-3">
          <button onClick={shareTrip} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors flex items-center shadow-sm">
            <Share2 size={16} className="mr-2" /> Share
          </button>
          <button onClick={downloadPDF} className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg flex items-center shadow-md transition-colors font-medium">
            <Download size={16} className="mr-2" /> Export PDF
          </button>
        </div>
      </div>

      <div ref={printRef} className="space-y-6">
        
        {/* Header Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
            <div>
               <div className="flex items-center space-x-2 text-brand-600 mb-2 font-semibold text-sm tracking-wide uppercase">
                 <MapPin size={16} /> <span>{plan.destination}</span>
                 <span className="text-slate-300">•</span>
                 <span>{plan.duration}</span>
               </div>
               <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Trip to {plan.destination}</h1>
               <p className="text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">{plan.summary}</p>
            </div>
            
            <div className="flex flex-col items-end justify-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 min-w-[200px]">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimated Cost</span>
               <span className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{plan.budget.currency} {plan.budget.total.toLocaleString()}</span>
               <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full mt-2 font-medium">Optimal Pricing</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
              <Calendar className="mr-2 text-brand-500" /> Itinerary
            </h2>
            
            <div className="space-y-6">
              {plan.itinerary.map((day) => (
                <div key={day.day} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <span className="font-bold text-brand-600">Day {day.day}</span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{day.title}</span>
                  </div>
                  <div className="p-6 relative">
                    {/* Timeline Line */}
                    <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                    
                    <div className="space-y-6">
                      {day.activities.map((act, i) => (
                        <div key={i} className="relative pl-8">
                          <div className="absolute left-[-5px] top-1.5 w-3 h-3 rounded-full bg-white dark:bg-slate-800 border-2 border-brand-500"></div>
                          <p className="text-slate-600 dark:text-slate-300">{act}</p>
                        </div>
                      ))}
                      
                      {/* Meals */}
                      <div className="relative pl-8 pt-2 mt-4 border-t border-slate-50 dark:border-slate-700/50">
                        <div className="flex gap-4 text-sm text-slate-500">
                          <span>🍴 <strong>Lunch:</strong> {day.meals.lunch}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>🍷 <strong>Dinner:</strong> {day.meals.dinner}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Hotels */}
            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">Where to Stay</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plan.hotels.map((hotel, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 dark:text-white">{hotel.name}</h3>
                    <span className="text-xs font-bold bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 px-2 py-1 rounded">{hotel.price_range}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{hotel.description}</p>
                  <button className="w-full py-2 text-sm font-medium text-brand-600 border border-brand-200 dark:border-brand-900 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                    Check Availability
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Budget Chart */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Budget Breakdown</h3>
              <BudgetChart budget={plan.budget} />
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Accommodation</span>
                  <span className="font-medium text-slate-900 dark:text-white">{plan.budget.currency} {plan.budget.accommodation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Flights & Travel</span>
                  <span className="font-medium text-slate-900 dark:text-white">{plan.budget.currency} {plan.budget.transportation}</span>
                </div>
              </div>
            </div>

            {/* Best Time Analysis */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-xl p-6 text-white shadow-lg">
              <h3 className="font-bold mb-2 flex items-center"><CheckCircle2 size={18} className="mr-2" /> Trip Analysis</h3>
              <p className="text-sm text-brand-100 leading-relaxed">{plan.best_month_analysis}</p>
            </div>

            {/* Packing List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Packing Essentials</h3>
              <ul className="space-y-2">
                {plan.packing_list.slice(0, 5).map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                    <span className="text-green-500 mr-2">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};