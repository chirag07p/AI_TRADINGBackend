import React from 'react';
import { Shield, BrainCircuit, Activity, Zap } from 'lucide-react';

export const Platform = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 py-16 px-4 max-w-6xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          The Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Core infrastructure engineered to securely match your risk threshold against real-time algorithmic market momentum patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { icon: BrainCircuit, title: 'Neural Matching', desc: 'Identifies elite traders based strictly on customized algorithmic risk assignment nodes.' },
          { icon: Activity, title: 'Real-time Execution', desc: 'Syncs transactions and wallet updates with no perceptible server latency using our advanced proxy setup.' },
          { icon: Shield, title: 'Encrypted Routing', desc: 'End-to-end proxy obfuscation to protect dynamic trading decisions from frontend interception.' },
          { icon: Zap, title: 'Sub-Millisecond APIs', desc: 'Powered by highly optimized Express backend endpoints prioritizing high-throughput logic requests.' },
        ].map((feature, i) => (
          <div key={i} className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 p-8 rounded-3xl hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.2)] transition-shadow">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6">
              <feature.icon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
