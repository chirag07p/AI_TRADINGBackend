import React, { useState, useEffect } from 'react';
import { Badge } from '../../components/ui/Badge';
import { ArrowUpRight, Activity, TrendingUp, DollarSign, Zap, Shield, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { checkAPIStatus } from '../../services/api';

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [apiOnline, setApiOnline] = useState(null);

  const [liveTrades, setLiveTrades] = useState([
    { id: 1, pair: 'BTC/USD', amount: '0.45', type: 'Buy', time: 'Just now' },
    { id: 2, pair: 'ETH/USD', amount: '12.4', type: 'Sell', time: '1m ago' },
    { id: 3, pair: 'SOL/USD', amount: '145.0', type: 'Buy', time: '3m ago' }
  ]);
  
  const [livePrice, setLivePrice] = useState(65430.50);

  // Check backend health on mount
  useEffect(() => {
    checkAPIStatus()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() * 10) - 5;
      setLivePrice(prev => prev + change);

      if (Math.random() > 0.6) {
        const pairs = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'BNB/USD', 'AAPL', 'TSLA'];
        const types = ['Buy', 'Sell'];
        const amount = (Math.random() * 5).toFixed(2);
        const newTrade = {
          id: Date.now(),
          pair: pairs[Math.floor(Math.random() * pairs.length)],
          amount: amount,
          type: types[Math.floor(Math.random() * types.length)],
          time: 'Just now'
        };
        
        setLiveTrades(prev => {
          const updated = [newTrade, ...prev];
          return updated.slice(0, 4); // Keep last 4 for cleaner UI
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] flex flex-col justify-center overflow-hidden pb-24">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 dark:bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen animate-pulse duration-10000" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-500/20 dark:bg-purple-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

      {/* Hero Section */}
      <section className="relative z-10 text-center pt-24 pb-16 px-4 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border border-gray-200 dark:border-gray-800 shadow-sm mb-8 hover:scale-105 transition-transform cursor-default">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
          <span className="w-2 h-2 rounded-full bg-indigo-500 absolute"></span>
          <span className="text-xs font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 ml-2">Next-Gen AI Platform</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tighter mb-8 leading-[1.1]">
          Trade <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Smarter,</span><br/> Not Harder
        </h1>
        
        <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
          The first trading platform with an embedded AI that automatically pairs you with elite industry traders based exactly on your risk tolerance.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
          <button 
            onClick={() => navigate('/register')}
            className="group relative inline-flex items-center justify-center h-16 px-8 text-lg font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative flex items-center gap-2">
              Start Trading Now <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
          </button>
          
          <button 
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center h-16 px-8 text-lg font-bold text-gray-900 dark:text-white bg-white/50 dark:bg-gray-900/50 backdrop-blur-md border-2 border-gray-200 dark:border-gray-800 rounded-2xl transition-all hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 w-full sm:w-auto"
          >
            Sign In to Dashboard
          </button>
        </div>
      </section>

      {/* Embedded Live Widget Section */}
      <section className="relative z-10 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto px-4 lg:px-8 items-center animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
        
        {/* Value Proposition Left */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-8 lg:pr-8">
          <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest text-sm">
            <Zap className="w-4 h-4" /> Real-time Execution
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
            Experience AI logic <br/>in real-time.
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            When you register, you create a custom risk profile. Our simulator instantly runs complex logic to find your exact elite trader match.
          </p>
          
          <div className="space-y-6 pt-4">
            <div className="flex gap-4 group cursor-default">
               <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl h-fit group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                 <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
               </div>
               <div>
                 <strong className="block text-gray-900 dark:text-white text-xl font-bold">Advanced Risk Profiles</strong> 
                 <span className="text-gray-600 dark:text-gray-400 mt-1.5 block text-lg">Differentiates between High, Medium, and Low risk thresholds automatically.</span>
               </div>
            </div>
            <div className="flex gap-4 group cursor-default">
               <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl h-fit group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                 <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
               </div>
               <div>
                 <strong className="block text-gray-900 dark:text-white text-xl font-bold">Live Visualizations</strong> 
                 <span className="text-gray-600 dark:text-gray-400 mt-1.5 block text-lg">Watch simulated trades populate your dynamic wallet in real time.</span>
               </div>
            </div>
          </div>
        </div>

        {/* Live Simulation Card Right */}
        <div className="lg:col-span-7 relative">
          {/* Ornamental border glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-20 dark:opacity-40 animate-pulse" />
          
          <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-gray-200/50 dark:border-gray-700/50 rounded-[2rem] shadow-2xl p-6 md:p-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/50 rounded-xl">
                  <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">Live Market Stream</h3>
                  <p className="text-sm text-gray-500 uppercase tracking-widest font-semibold mt-0.5">Simulation Node</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span> Live
              </div>
            </div>

            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-gray-900 shadow-sm rounded-xl">
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Bitcoin (BTC) Index</p>
                    <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                      ${livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <TrendingUp className={`w-12 h-12 opacity-20 ${Math.random() > 0.5 ? 'text-green-500' : 'text-red-500'}`} />
                </div>
              </div>
            </div>
            
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest px-2 pb-2">
                <span>Asset Pair</span>
                <span>Amount & Time</span>
              </div>
              
              {liveTrades.map(trade => (
                <div key={trade.id} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 animate-in slide-in-from-left-4 fade-in">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-sm ${trade.type === 'Buy' ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'}`}>
                      {trade.type}
                    </div>
                    <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{trade.pair}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-gray-900 dark:text-gray-100 text-lg">{trade.amount}</div>
                    <div className="text-xs font-semibold text-gray-400 mt-0.5">{trade.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>
    </div>
  );
};
