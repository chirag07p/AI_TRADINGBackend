import React from 'react';
import { Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const Pricing = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          No hidden fees. Flat commission models directly synced with your AI assignment nodes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { name: 'Starter', price: 'Free', desc: 'Mock trading simulation node access.', features: ['Access to platform', '1 Node pairing', 'Basic logic'] },
          { name: 'Pro', price: '$29/mo', badge: 'Most Popular', highlight: true, desc: 'Full automated AI pairing architecture.', features: ['Premium traders', 'Priority logic queuing', 'Real-time syncing'] },
          { name: 'Enterprise', price: 'Custom', desc: 'API connectivity for high-volume execution.', features: ['Direct API access', 'Dedicated node clusters', 'White-glove matching'] },
        ].map((plan, i) => (
          <div key={i} className={`relative bg-white dark:bg-gray-900 border ${plan.highlight ? 'border-indigo-500 shadow-xl shadow-indigo-500/20 scale-105 z-10' : 'border-gray-200 dark:border-gray-800'} p-8 rounded-3xl flex flex-col`}>
             {plan.badge && <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-3 px-3 py-1 bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest rounded-full">{plan.badge}</div>}
             <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest">{plan.name}</h3>
             <div className="text-5xl font-black text-gray-900 dark:text-white my-4">{plan.price}</div>
             <p className="text-gray-500 dark:text-gray-400 mb-8">{plan.desc}</p>
             
             <ul className="space-y-4 flex-1 mb-8">
               {plan.features.map((feat, idx) => (
                 <li key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Shield className="w-5 h-5 text-indigo-500" />
                    {feat}
                 </li>
               ))}
             </ul>
             
             <Button variant={plan.highlight ? 'primary' : 'secondary'} className="w-full h-12 text-lg rounded-xl font-bold">
               Choose {plan.name}
             </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
