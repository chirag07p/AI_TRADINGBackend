import React from 'react';

export const About = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 py-16 px-4 max-w-4xl mx-auto space-y-10">
      <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-center mb-12">
        About Top Gun
      </h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
        <p>
          Founded on the principle that the immense complexity of quantitative algorithmic trading should be democratized, Top Gun serves as the bridge between institutional data analysis and individual retail investors.
        </p>
        <p>
          Rather than offering complex broker platforms with steep learning curves, we rely on a sophisticated backend assigning engine. By answering a few simple risk tolerance questions, our platform instantly pairs you with mocked, data-driven "Trader Profiles" that match your exact monetary constraints and profit margins.
        </p>
        
        <div className="my-12 p-8 bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-3xl">
          <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-4">Our Mission</h3>
          <p className="text-indigo-800 dark:text-indigo-200">
            To abstract away volatility through powerful, instantaneous artificial intelligence matching architectures. We handle the heavy node processing so you can focus strictly on macroscopic portfolio tracking.
          </p>
        </div>
        
        <p>
          Our teams operate globally, monitoring internal Node.js systems to ensure near 100% uptime, routing thousands of high-frequency simulated transactions through tailored dashboard endpoints flawlessly.
        </p>
      </div>
    </div>
  );
};
