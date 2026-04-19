import React from 'react';
import { Button } from '../../components/ui/Button';

export const Contact = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 py-16 px-4 max-w-2xl mx-auto">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          Contact Support
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Our engineering and support teams are available 24/7 to assist with your AI matching protocols.
        </p>
      </div>

      <form className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800 p-8 rounded-3xl shadow-xl shadow-indigo-900/5 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">First Name</label>
            <input type="text" className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Jane" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Last Name</label>
            <input type="text" className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Doe" />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Email Network</label>
          <input type="email" className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="jane@example.com" />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Inquiry Message</label>
          <textarea rows={5} className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none" placeholder="Describe your logic issue..."></textarea>
        </div>
        
        <Button variant="primary" className="w-full h-14 text-lg rounded-xl font-bold shadow-lg shadow-indigo-500/20" type="button">
          Dispatch Secure Message
        </Button>
      </form>
    </div>
  );
};
