import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { TrendingUp, TrendingDown, BarChart3, Globe, Zap, Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../services/api';

export const MarketAnalytics = () => {
  const { user } = useAuth();
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMarketData = async () => {
    try {
      const res = await fetch(`${API_URL}/system/market`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = await res.json();
      setMarkets(data);
      setLoading(false);
    } catch (err) {
      console.error('Market fetch failed:', err);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Global Market Intelligence</h1>
          <p className="text-sm text-gray-500 font-medium">Real-time simulated data for trader decision support</p>
        </div>
        <Badge className="bg-indigo-600 text-white border-none py-1.5 px-4 font-bold tracking-widest">LIVE SIMULATION</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Ticker */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-800/20 rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Synchronizing Market Data...</p>
            </div>
          ) : markets.map((m) => (
            <Card key={m.symbol} className="p-5 hover:border-indigo-500 transition-colors cursor-pointer group/card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl group-hover/card:bg-indigo-50 transition-colors">
                    <Globe className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-gray-900 dark:text-white">{m.symbol}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Volume: {m.volume}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-gray-900 dark:text-white font-mono">${m.price}</p>
                  <p className={`text-xs font-bold flex items-center justify-end ${m.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {m.change.startsWith('+') ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {m.change}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-6">
          <Card className="bg-indigo-600 text-white p-6 border-none shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 fill-white" />
              <h3 className="font-black text-sm uppercase tracking-widest">AI Market Signal</h3>
            </div>
            <p className="text-sm font-medium leading-relaxed opacity-90 italic">
              "The current BTC/USD trend shows strong support at $63.8k. Expect a breakout if volume sustains above 1.5B in the next 4 hours."
            </p>
          </Card>

          <Card className="p-6 border-gray-100 dark:border-gray-800">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield className="w-3 h-3" /> Risk Heatmap
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase">
                  <span>Crypto Volatility</span>
                  <span className="text-red-500">Extremely High</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full w-[92%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase">
                  <span>Equities Stability</span>
                  <span className="text-green-500">Stable</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[74%]" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
