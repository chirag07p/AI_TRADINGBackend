import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { TrendingUp, TrendingDown, BarChart3, Globe, Zap, Shield } from 'lucide-react';

export const MarketAnalytics = () => {
  const markets = [
    { symbol: 'BTC/USD', price: '64,231.50', change: '+2.4%', status: 'Bullish', volume: '1.2B' },
    { symbol: 'ETH/USD', price: '3,452.10', change: '-1.2%', status: 'Neutral', volume: '800M' },
    { symbol: 'AAPL', price: '189.24', change: '+0.8%', status: 'Stable', volume: '45M' },
    { symbol: 'EUR/USD', price: '1.0824', change: '+0.1%', status: 'Stable', volume: '200B' },
  ];

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
          {markets.map((m) => (
            <Card key={m.symbol} className="p-5 hover:border-indigo-500 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl">
                    <Globe className="w-5 h-5 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-gray-900 dark:text-white">{m.symbol}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Volume: {m.volume}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-gray-900 dark:text-white">${m.price}</p>
                  <p className={`text-xs font-bold ${m.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {m.change.startsWith('+') ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />}
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
