import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { AIAssignmentCard } from '../../components/domain/AIAssignmentCard';
import { Brain, Cpu, Database, Activity } from 'lucide-react';

export const AIAssignmentDashboard = () => {
  const { customers, employees } = useAppData();

  const totalMatches = customers.length;
  const activeNodes = employees.length;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 text-white shadow-2xl shadow-indigo-900/30 relative overflow-hidden">
        {/* Background Visuals */}
        <div className="absolute -right-20 -top-20 opacity-20 pointer-events-none">
          <Brain className="w-96 h-96" />
        </div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-10 mix-blend-overlay"></div>
        
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest text-indigo-200 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            System Live
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2">AI Assignment Logic Engine</h1>
          <p className="text-indigo-200 max-w-xl text-sm md:text-base leading-relaxed">
            The neural network is actively routing high-risk clients to optimized traders while maintaining balance across the global pool.
          </p>
        </div>

        {/* Header Stats */}
        <div className="relative z-10 grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 flex flex-col items-center justify-center min-w-[120px]">
            <Cpu className="w-6 h-6 text-indigo-300 mb-2" />
            <span className="text-3xl font-black">{totalMatches}</span>
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest mt-1">Total Matches</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 flex flex-col items-center justify-center min-w-[120px]">
            <Database className="w-6 h-6 text-purple-300 mb-2" />
            <span className="text-3xl font-black">{activeNodes}</span>
            <span className="text-xs font-bold text-purple-200 uppercase tracking-widest mt-1">Active Traders</span>
          </div>
        </div>
      </div>

      {/* Grid Status Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-800">
        <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Live Node Assignments</h2>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 relative">
        {customers.map((customer, idx) => {
          const assignedEmpl = employees.find(e => e.id === customer.assignedTraderId);
          return (
            <div 
              key={customer.id} 
              className="animate-in fade-in slide-in-from-bottom-8 opacity-0 [animation-fill-mode:forwards]"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <AIAssignmentCard 
                customer={customer} 
                assignedEmployee={assignedEmpl} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
