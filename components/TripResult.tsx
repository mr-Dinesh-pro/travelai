import React, { useRef } from 'react';
import { TripPlan } from '../types';
import { BudgetChart } from './BudgetChart';
import { Download, Share2, MapPin, Clock, Star, ArrowRight, RefreshCw, Calendar, DollarSign, Coffee, Camera, AlertCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TripResultProps {
  plan: TripPlan;
  onReset: () => void;
}

export const TripResult: React.FC<TripResultProps> = ({ plan, onReset }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    const element = printRef.current;
    
    // Create a canvas from the element
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate PDF dimensions
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${plan.destination}-Itinerary.pdf`);
  };

  const handleShare = () => {
    const textToShare = `Trip to ${plan.destination}: ${plan.summary} (via TravoGenie)`;
    navigator.clipboard.writeText(textToShare);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-slide-up">
      
      {/* Top Bar Actions */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onReset} className="text-sm font-medium text-slate-500 hover:text-brand-600 flex items-center transition-colors">
          <ArrowRight className="w-4 h-4 mr-1 rotate-180" /> Back to Search
        </button>
        <div className="flex space-x-3">
          <button onClick={handleShare} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <Share2 size={20} />
          </button>
          <button onClick={handleDownloadPDF} className="flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Download size={16} className="mr-2" /> Download PDF
          </button>
        </div>
      </div>

      <div ref={printRef} className="space-y-8">
        
        {/* Header Banner */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
           <div>
             <div className="flex items-center space-x-2 text-sm font-semibold text-brand-600 mb-2">
               <span className="bg-brand-50 dark:bg-brand-900/30 px-2 py-1 rounded text-xs uppercase tracking-wider">Itinerary Generated</span>
               <span>• {plan.duration}</span>
             </div>
             <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
               Trip to {plan.destination}
             </h1>
             <p className="text-slate-500 dark:text-slate-400 max-w-2xl">{plan.summary}</p>
           </div>
           
           <div className="flex flex-col items-end">
              <div className="text-right">
                <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">Est. Budget</span>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{plan.budget.currency} {plan.budget.total.toLocaleString()}</p>
              </div>
              <div className="mt-2 text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded font-medium">
                 {plan.best_month_analysis.split('.')[0]}.
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content: Itinerary */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Itinerary Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-brand-500" /> Day by Day Plan
              </h2>
              <div className="space-y-6">
                {plan.itinerary.map((day, idx) => (
                  <div key={day.day} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white">Day {day.day}: {day.title}</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {day.activities.map((act, i) => (
                           <div key={i} className="flex items-start">
                             <div className="mt-1.5 min-w-[6px] h-[6px] rounded-full bg-brand-400 mr-3"></div>
                             <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{act}</p>
                           </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-4">
                         <div className="flex items-center text-sm text-slate-500">
                           <Coffee className="w-4 h-4 mr-2 text-amber-500" />
                           <span className="font-medium text-slate-700 dark:text-slate-300 mr-1">Lunch:</span> {day.meals.lunch}
                         </div>
                         <div className="flex items-center text-sm text-slate-500">
                           <Coffee className="w-4 h-4 mr-2 text-indigo-500" />
                           <span className="font-medium text-slate-700 dark:text-slate-300 mr-1">Dinner:</span> {day.meals.dinner}
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hotels Section */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                <Star className="w-5 h-5 mr-2 text-brand-500" /> Recommended Hotels
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {plan.hotels.map((hotel, idx) => (
                   <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900 dark:text-white">{hotel.name}</h4>
                          <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded">{hotel.price_range}</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{hotel.description}</p>
                      </div>
                      <button className="w-full py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                        View Details
                      </button>
                   </div>
                 ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Budget Widget */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-brand-500" /> Expenses Breakdown
              </h3>
              <BudgetChart budget={plan.budget} />
              <div className="mt-4 space-y-2">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Accommodation</span>
                    <span className="font-medium dark:text-slate-300">{plan.budget.currency} {plan.budget.accommodation}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Transportation</span>
                    <span className="font-medium dark:text-slate-300">{plan.budget.currency} {plan.budget.transportation}</span>
                 </div>
              </div>
            </div>

            {/* Highlights Widget */}
            <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl p-6 text-white shadow-md">
              <h3 className="font-bold mb-4 flex items-center">
                <Camera className="w-4 h-4 mr-2" /> Top Attractions
              </h3>
              <ul className="space-y-3">
                {plan.places_to_visit.map((place, idx) => (
                  <li key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <span className="font-bold block text-sm">{place.name}</span>
                    <span className="text-xs text-brand-100">{place.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Packing List Widget */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">Pack Smart</h3>
              <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-400">
                {plan.packing_list.slice(0, 6).map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 text-green-500">✓</span> {item}
                  </li>
                ))}
                {plan.packing_list.length > 6 && (
                  <li className="text-xs text-slate-400 pt-2 italic">+ {plan.packing_list.length - 6} more items...</li>
                )}
              </ul>
            </div>

             {/* Tips Widget */}
            <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-6 border border-amber-100 dark:border-amber-900/30">
               <h3 className="font-bold text-amber-800 dark:text-amber-500 mb-3 flex items-center">
                 <AlertCircle className="w-4 h-4 mr-2" /> Local Tips
               </h3>
               <ul className="text-sm space-y-2 text-amber-900 dark:text-amber-100/80">
                  {plan.travel_tips.slice(0,3).map((tip, idx) => (
                    <li key={idx} className="leading-snug">• {tip}</li>
                  ))}
               </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};