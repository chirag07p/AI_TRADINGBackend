import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Radio, 
  Cpu, 
  Target,
  ArrowUpRight,
  Timer
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { API_URL } from '../../services/api';

export const MarketIntelligence = () => {
  const [signals, setSignals] = useState([]);
  const [stats, setStats] = useState({ load: '0.0 GB/s', activePairs: 0, successRate: '0%' });
  const [activeFrequency, setActiveFrequency] = useState('High');
  const [selectedSignal, setSelectedSignal] = useState(null);

  const fetchIntelligence = async () => {
    try {
      const res = await fetch(`${API_URL}/system/intelligence`);
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.signals)) setSignals(data.signals);
        if (data.networkStats) setStats(data.networkStats);
      }
    } catch (err) {
      console.error('Intelligence fetch failed', err);
    }
  };

  useEffect(() => {
    fetchIntelligence();
    const interval = setInterval(fetchIntelligence, 10000); // Sync every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Signal Detail Modal */}
      {selectedSignal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setSelectedSignal(null)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowUpRight className="rotate-45" size={20} />
            </button>

            <div className="p-10 space-y-8">
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl font-black text-white shadow-2xl ${
                  selectedSignal.sentiment === 'Bullish' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {selectedSignal.pair?.charAt(0) || '?'}
                </div>
                <div>
                  <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{selectedSignal.pair}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-indigo-600 text-white border-none">{selectedSignal.type}</Badge>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Signal ID: #{selectedSignal.id}7429</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-50 dark:bg-gray-800/50 border-none rounded-3xl p-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Neural Confidence</p>
                  <div className="text-4xl font-black text-indigo-600 font-mono">{selectedSignal.confidence.toFixed(2)}%</div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-4 overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${selectedSignal.confidence}%` }} />
                  </div>
                </Card>
                <Card className="bg-gray-50 dark:bg-gray-800/50 border-none rounded-3xl p-6">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Signal Strength</p>
                  <div className={`text-4xl font-black font-mono ${
                    selectedSignal.strength === 'Critical' ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {selectedSignal.strength}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest italic">Institutional weight: 8.2M+</p>
                </Card>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-indigo-600" /> System Engine Logic
                </h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                  The System Engine has detected a non-linear accumulation pattern on the {selectedSignal.pair} 15m timeframe. 
                  Order flow imbalance suggests a {selectedSignal.sentiment.toLowerCase()} breakout is imminent as sell-side liquidity 
                  is absorbed by institutional-grade clusters.
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-4">
                <button 
                  className="flex-1 h-14 bg-indigo-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                  onClick={() => window.location.href = '/register'}
                >
                  Connect Node to Execute
                </button>
                <button 
                  onClick={() => setSelectedSignal(null)}
                  className="px-8 h-14 border border-gray-200 dark:border-gray-800 text-gray-400 font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header & Terminal Stats */}
      <div className="relative overflow-hidden bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <Radio className="w-64 h-64 animate-ping duration-[3s]" />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">System Pulse Terminal</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-tight">
              Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Intelligence Hub</span>
            </h1>
            <p className="text-gray-400 max-w-xl text-sm leading-relaxed">
              Real-time pattern recognition across global liquidity pools. Our proprietary System Engine 
              detects institutional movements and market anomalies before they hit retail charts.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Network Load', value: stats.load, icon: Cpu },
              { label: 'Active Pairs', value: stats.activePairs.toLocaleString(), icon: Target },
              { label: 'Success Rate', value: stats.successRate, icon: ShieldCheck },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                <stat.icon className="w-4 h-4 text-indigo-400 mb-2" />
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-black">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Active Stream */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" /> Detected Anomalies
            </h2>
            <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl border border-gray-200 dark:border-gray-800">
              {['Low', 'Medium', 'High'].map(freq => (
                <button 
                  key={freq}
                  onClick={() => setActiveFrequency(freq)}
                  className={`px-4 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${
                    activeFrequency === freq 
                    ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {freq} Freq
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {signals.map((signal, idx) => (
              <div 
                key={signal.id}
                className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-3xl hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <Target className="w-24 h-24 rotate-12" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${
                      signal.sentiment === 'Bullish' 
                      ? 'bg-green-500 text-white shadow-green-500/20' 
                      : signal.sentiment === 'Bearish'
                      ? 'bg-red-500 text-white shadow-red-500/20'
                      : 'bg-gray-500 text-white'
                    }`}>
                      {signal.pair?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 dark:text-white">{signal.pair}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px] font-black uppercase border-indigo-200 text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20">
                          {signal.type}
                        </Badge>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">
                          <Timer className="w-3 h-3" /> {signal.age}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:flex items-center gap-8 w-full md:w-auto border-t md:border-t-0 border-gray-100 dark:border-gray-800 pt-4 md:pt-0">
                    <div className="text-center md:text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Sentiment</p>
                      <div className={`flex items-center gap-1.5 font-black text-sm ${
                        signal.sentiment === 'Bullish' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {signal.sentiment === 'Bullish' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {signal.sentiment.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Confidence</p>
                      <div className="text-xl font-black text-gray-900 dark:text-white font-mono tracking-tighter">
                        {signal.confidence.toFixed(1)}%
                      </div>
                    </div>
                    <div className="col-span-2 md:col-span-1 flex justify-center">
                      <button 
                        onClick={() => setSelectedSignal(signal)}
                        className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300"
                      >
                        <ArrowUpRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Intelligence Hub */}
        <div className="space-y-6">
          <Card className="bg-indigo-600 border-none rounded-[2rem] overflow-hidden shadow-2xl shadow-indigo-600/30">
            <CardContent className="p-8 text-white space-y-6">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black leading-tight">System Alert Protocol</h3>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  The System Engine has detected unusual activity in the DeFi sector. Bypassing standard logic routes to provide immediate node updates.
                </p>
              </div>
              <div className="pt-4 space-y-4">
                {[
                  { label: 'Signal Accuracy', value: '98.4%' },
                  { label: 'Latency', value: '1.2ms' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-white/10 pb-2 text-xs font-bold">
                    <span className="text-indigo-200 uppercase tracking-widest">{row.label}</span>
                    <span>{row.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-200/20 dark:shadow-none">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" /> Strategic Forecast
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-gray-400">Market Absorption</span>
                  <span className="text-green-600">Optimal</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-[78%] rounded-full shadow-[0_0_12px_rgba(34,197,94,0.4)]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase">
                  <span className="text-gray-400">Anomaly Density</span>
                  <span className="text-amber-600">Elevated</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[42%] rounded-full shadow-[0_0_12px_rgba(245,158,11,0.4)]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
