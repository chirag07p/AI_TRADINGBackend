import React, { useState } from 'react';
import { 
  Shield, 
  Activity, 
  Zap, 
  Server, 
  Database, 
  ArrowRight, 
  Cpu, 
  Lock, 
  RefreshCw,
  Globe,
  Terminal,
  Layers
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const Platform = () => {
  const [activeNode, setActiveNode] = useState(null);

  const nodes = [
    { 
      id: 'gateway', 
      icon: Globe, 
      name: 'API Gateway', 
      status: 'High Priority', 
      latency: '0.4ms', 
      desc: 'Entry point for all incoming market requests and user interactions. Features L7 load balancing and DDoS protection.',
      details: ['TLS 1.3 Encryption', 'Rate Limiting Active', 'Auth Handshake Optimized']
    },
    { 
      id: 'scorer', 
      icon: Cpu, 
      name: 'System Engine', 
      status: 'Syncing', 
      latency: '2.1ms', 
      desc: 'Our proprietary neural matching layer. Analyzes risk profiles and market trends to generate Intelligent signals.',
      details: ['Neural Weights: 1.2B', 'Pattern Recognition', 'Risk DNA Analysis']
    },
    { 
      id: 'trader', 
      icon: Zap, 
      name: 'Trader Node', 
      status: 'Active', 
      latency: '1.2ms', 
      desc: 'Specialized professional trading nodes assigned to client portfolios based on strategy-affinity scoring.',
      details: ['Direct Liquidity Access', 'Sub-ms Execution', 'Strategy Affinity: 94%']
    },
    { 
      id: 'vault', 
      icon: Lock, 
      name: 'Secure Vault', 
      status: 'Protected', 
      latency: 'N/A', 
      desc: 'Offline cold-storage and hardware security modules (HSM) protecting institutional assets and user credentials.',
      details: ['Hardware Isolation', 'Multi-sig Validation', 'Encrypted State']
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 py-24 px-6 relative overflow-hidden transition-colors duration-500">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto space-y-20 relative z-10">
        {/* Header */}
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-top-12 duration-1000">
          <Badge variant="outline" className="px-4 py-1.5 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] bg-indigo-50/50 dark:bg-transparent">
            System Infrastructure v4.2
          </Badge>
          <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter leading-tight">
            The Engine Behind <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">Intelligent Execution</span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Top Gun isn't just a dashboard—it's a high-throughput financial neural network. 
            Click the architecture nodes below to inspect the system logic.
          </p>
        </div>

        {/* Interactive Schematic Section */}
        <div className="relative p-8 lg:p-12 bg-gray-50 dark:bg-gray-900/50 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/50 dark:shadow-none animate-in zoom-in-95 duration-700">
          
          {/* Legend/Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-6 mb-12 pb-8 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mainnet Online</span>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">4 Logic Layers</span>
              </div>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> System Telemetry: <span className="text-indigo-600">Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Visual Schematic Map (The "Static-Looking" Clickable thing) */}
            <div className="relative aspect-square max-w-md mx-auto w-full p-8">
              {/* Connector Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 dark:opacity-40" viewBox="0 0 400 400">
                <line x1="200" y1="60" x2="200" y2="340" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="60" y1="200" x2="340" y2="200" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="1" />
              </svg>

              {/* Node Buttons */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Central Hub */}
                <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] shadow-2xl shadow-indigo-600/40 flex items-center justify-center text-white z-20 animate-pulse">
                  <RefreshCw className="w-10 h-10 animate-[spin_10s_linear_infinite]" />
                </div>

                {/* Satellite Nodes */}
                {nodes.map((node, i) => {
                  const positions = [
                    'top-0 left-1/2 -translate-x-1/2',
                    'right-0 top-1/2 -translate-y-1/2',
                    'bottom-0 left-1/2 -translate-x-1/2',
                    'left-0 top-1/2 -translate-y-1/2'
                  ];
                  const isActive = activeNode?.id === node.id;
                  
                  return (
                    <button
                      key={node.id}
                      onClick={() => setActiveNode(node)}
                      className={`absolute ${positions[i]} group flex flex-col items-center gap-3 transition-all duration-500 ${isActive ? 'scale-110' : 'hover:scale-105'}`}
                    >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                        isActive 
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-600/40' 
                        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 hover:border-indigo-400 hover:text-indigo-500'
                      }`}>
                        <node.icon className="w-7 h-7" />
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                        {node.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Node Inspection Panel */}
            <div className="space-y-6">
              {activeNode ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                        <activeNode.icon className="w-5 h-5" />
                      </div>
                      <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                        {activeNode.name}
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-green-100 text-green-700 border-none px-3 py-1 font-black text-[10px] uppercase">
                        {activeNode.status}
                      </Badge>
                      <Badge variant="outline" className="border-gray-200 dark:border-gray-800 text-gray-400 px-3 py-1 font-black text-[10px] uppercase">
                        Latency: {activeNode.latency}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-lg">
                    {activeNode.desc}
                  </p>

                  <div className="grid grid-cols-1 gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Technical Telemetry</p>
                    {activeNode.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-700 dark:text-gray-200">
                        <ArrowRight className="w-4 h-4 text-indigo-500" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[2rem] bg-gray-50/50 dark:bg-transparent">
                  <Terminal className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest">Select a Node to Inspect</h3>
                  <p className="text-sm text-gray-500 max-w-xs mt-2 italic">
                    Click any architectural component on the schematic map to reveal real-time system specifications.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature Grid Below */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Shield, title: 'Compliance', desc: 'Regulated infrastructure with institutional auditing.' },
            { icon: Activity, title: 'Throughput', desc: '14k+ TPS across global logic clusters.' },
            { icon: Zap, title: 'Speed', desc: 'Execution pathways optimized for sub-ms trades.' },
            { icon: Lock, title: 'Security', desc: 'Encrypted L2 state for total asset protection.' }
          ].map((item, i) => (
            <Card key={i} className="rounded-[2rem] border-gray-100 dark:border-gray-800 hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-300">
              <CardContent className="p-6">
                <item.icon className="w-6 h-6 text-indigo-500 mb-4" />
                <h4 className="text-sm font-black uppercase tracking-widest mb-2">{item.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
