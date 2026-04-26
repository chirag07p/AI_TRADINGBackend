import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardContent } from '../../components/ui/Card';
import { TrendingUp, Users, Activity, Target, Zap, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MONTHLY = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const TIMEFRAMES = {
  '1Y': [35, 45, 30, 60, 55, 75, 65, 80, 95, 85, 100, 110],
  '6M': [65, 80, 95, 85, 100, 110],
  '30D': [88, 92, 97, 85, 90, 100, 95, 103, 98, 110, 107, 115, 109, 118, 112, 120, 115, 123, 118, 125, 120, 128, 122, 130, 125, 133, 128, 135, 130, 138],
};

export const Analytics = () => {
  const { employees, customers, trades } = useAppData();
  const [timeframe, setTimeframe] = useState('1Y');

  const chartData = TIMEFRAMES[timeframe];
  const maxVal = Math.max(...chartData);
  const labels = timeframe === '1Y' ? MONTHLY : timeframe === '6M' ? MONTHLY.slice(6) : Array.from({ length: 30 }, (_, i) => `${i + 1}`);

  const assignedCount = customers.filter(c => c.assignedTraderId).length;
  const avgSuccess = employees.length
    ? Math.round(employees.reduce((s, e) => s + (e.successRate || 0), 0) / employees.length)
    : 0;

  const stats = [
    { label: 'Total Volume', value: '$45.2M', trend: '+12.5%', up: true, icon: Activity, color: 'indigo' },
    { label: 'Users', value: (employees.length + customers.length).toString(), trend: '+2 this week', up: true, icon: Users, color: 'blue' },
    { label: 'AI Win Rate', value: `${avgSuccess}%`, trend: '+2.1%', up: true, icon: Target, color: 'emerald' },
    { label: 'Trade Velocity', value: '4.2s', trend: '-0.3s', up: true, icon: Zap, color: 'amber' },
  ];

  const riskDist = ['High', 'Medium', 'Low'].map(r => ({
    label: r,
    value: customers.filter(c => c.risk === r).length,
    pct: customers.length ? Math.round((customers.filter(c => c.risk === r).length / customers.length) * 100) : 0,
    color: r === 'High' ? '#ef4444' : r === 'Medium' ? '#f59e0b' : '#22c55e',
  }));

  const traderPerf = [...employees]
    .sort((a, b) => (b.successRate || 0) - (a.successRate || 0))
    .map(e => ({
      name: e.name,
      rate: e.successRate || 0,
      clients: customers.filter(c => c.assignedTraderId === e.id).length,
    }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-indigo-500" /> System Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Real-time platform performance metrics</p>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {Object.keys(TIMEFRAMES).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                timeframe === tf
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:bg-${stat.color}-500 group-hover:text-white transition-all duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
                    stat.up
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.trend}
                  </span>
                </div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
                <div className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chart + Risk Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <Card className="lg:col-span-2 shadow-lg">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" /> AI Trade Volume
            </h2>
            <span className="text-xs text-gray-400">{timeframe}</span>
          </div>
          <CardContent className="p-6">
            <div className="relative h-56 flex items-end gap-1 overflow-hidden">
              {/* Gridlines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0,1,2,3].map(i => (
                  <div key={i} className="w-full border-b border-dashed border-gray-200 dark:border-gray-800 h-0" />
                ))}
              </div>
              {chartData.map((val, i) => {
                const h = (val / maxVal) * 100;
                return (
                  <div key={i} className="relative flex flex-col items-center flex-1 h-full justify-end group">
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold py-1 px-2 rounded whitespace-nowrap z-20 shadow-xl pointer-events-none">
                      {val}k
                    </div>
                    <div
                      className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-indigo-700 to-indigo-400 group-hover:from-purple-600 group-hover:to-purple-400 group-hover:-translate-y-1 transition-all duration-300 shadow-md shadow-indigo-500/20"
                      style={{ height: `${h}%` }}
                    />
                    {labels[i] && i % Math.ceil(labels.length / 8) === 0 && (
                      <p className="mt-2 text-xs text-gray-400 font-medium">{labels[i]}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <div className="p-5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-base font-bold text-gray-900 dark:text-white">Risk Distribution</h2>
            <p className="text-xs text-gray-400 mt-0.5">{customers.length} total clients</p>
          </div>
          <CardContent className="p-5">
            <div className="space-y-4">
              {riskDist.map(({ label, value, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label} Risk</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-gray-900 dark:text-white">{value}</span>
                      <span className="text-xs text-gray-400">{pct}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Assignment Health</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                    style={{ width: `${customers.length ? Math.round((assignedCount / customers.length) * 100) : 0}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {customers.length ? Math.round((assignedCount / customers.length) * 100) : 0}%
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{assignedCount}/{customers.length} clients matched</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trader Performance Table */}
      <Card>
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Trader Performance</h2>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {traderPerf.map((t, idx) => (
              <div key={t.name} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${
                  idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                  idx === 1 ? 'bg-gray-100 text-gray-600' :
                  'bg-orange-100 text-orange-700'
                }`}>#{idx + 1}</div>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {t.name?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.clients} clients assigned</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${t.rate >= 85 ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {t.rate}%
                  </p>
                  <p className="text-xs text-gray-400">success rate</p>
                </div>
                <div className="w-24">
                  <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{ width: `${t.rate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
