import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Target, TrendingUp, Shield, BarChart2 } from 'lucide-react';

export const Onboarding = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  
  const [formData, setFormData] = useState({
    capital: '',
    experience: 'Beginner',
    timeframe: 'Medium Term',
    objectives: ''
  });

  const handleComplete = (e) => {
    e.preventDefault();
    // Simulate saving the advanced client profile details
    const updatedUser = { 
      ...user, 
      onboardingComplete: true,
      clientProfile: formData 
    };
    login(updatedUser); // sync context/localStorage
    navigate('/customer'); // proceed to real dashboard
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="text-center mb-10 max-w-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 shadow-inner mb-6">
          <Target className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
          Client Intake Profile
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Before your AI-assigned trader begins executing logic in your portfolio, please fill out your target benchmarks and profile details.
        </p>
      </div>

      <Card className="max-w-2xl w-full p-8 lg:p-10 border-indigo-100 dark:border-indigo-900/50 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-3xl rounded-full mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
        
        <form onSubmit={handleComplete} className="space-y-8 relative z-10">
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              <DollarSignIcon className="w-4 h-4 text-indigo-500" /> Planned Initial Capital ($)
            </label>
            <input 
              type="number" 
              required
              min="100"
              value={formData.capital}
              onChange={(e) => setFormData({...formData, capital: e.target.value})}
              className="w-full h-14 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-lg font-mono font-semibold" 
              placeholder="e.g. 5000" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                <BarChart2 className="w-4 h-4 text-indigo-500" /> Prior Experience
              </label>
              <div className="relative">
                <select 
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  className="w-full h-14 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 appearance-none font-semibold"
                >
                  <option>None (Beginner)</option>
                  <option>1-3 Years (Intermediate)</option>
                  <option>3+ Years (Advanced)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
               <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  <TrendingUp className="w-4 h-4 text-indigo-500" /> Time Horizon
               </label>
               <div className="relative">
                 <select 
                   value={formData.timeframe}
                   onChange={(e) => setFormData({...formData, timeframe: e.target.value})}
                   className="w-full h-14 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 appearance-none font-semibold"
                 >
                   <option>Short Term (Day Trading)</option>
                   <option>Medium Term (Swing)</option>
                   <option>Long Term (Hold)</option>
                 </select>
               </div>
            </div>
          </div>

          <div className="space-y-2">
             <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                <Shield className="w-4 h-4 text-indigo-500" /> Security & Financial Objectives
             </label>
             <textarea 
               required
               rows={4}
               value={formData.objectives}
               onChange={(e) => setFormData({...formData, objectives: e.target.value})}
               className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none font-medium" 
               placeholder="Describe what you want to achieve (e.g. Generate weekly income vs Compound for retirement)..."
             ></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button type="submit" variant="primary" className="w-full h-14 text-lg rounded-xl font-black tracking-wide shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all">
              Initialize Trader Matching
            </Button>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4 font-semibold">
              This data is sent securely to the AI matching nodes.
            </p>
          </div>

        </form>
      </Card>
    </div>
  );
};

// Quick helper icon for the form
const DollarSignIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);
