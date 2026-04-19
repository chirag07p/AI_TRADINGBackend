import React from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { TrendingUp, Users, Activity, Target, Zap, BarChart3 } from 'lucide-react';

export const Analytics = () => {
  // Mock data for the visual chart
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = [35, 45, 30, 60, 55, 75, 65, 80, 95, 85, 100, 110];
  const maxVal = Math.max(...chartData);

  const stats = [
    { label: 'Total Volume', value: '$45.2M', trend: '+12.5%', icon: Activity, color: 'indigo' },
    { label: 'Active Users', value: '12,450', trend: '+5.2%', icon: Users, color: 'blue' },
    { label: 'Win Rate (AI)', value: '68.4%', trend: '+2.1%', icon: Target, color: 'emerald' },
    { label: 'Trade Velocity', value: '4.2s', trend: '-0.3s', icon: Zap, color: 'amber' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-indigo-500" />
            System Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Real-time performance metrics and AI predictive tracking.
          </p>
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          <button className="px-4 py-1.5 text-sm font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg shadow-sm">1Y</button>
          <button className="px-4 py-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">6M</button>
          <button className="px-4 py-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">30D</button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="overflow-hidden border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors group">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:bg-${stat.color}-500 group-hover:text-white transition-all duration-500`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    stat.trend.startsWith('+') || stat.trend.startsWith('-0') 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {stat.trend}
                  </span>
                </div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">{stat.label}</h3>
                <div className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Bar Chart Panel */}
      <Card className="border-gray-200 border-opacity-50 dark:border-gray-800 relative z-10 shadow-lg">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-500" />
            AI Trade Volume Execution (Annual)
          </h2>
        </div>
        <CardContent className="p-8">
          <div className="relative h-80 flex items-end justify-between gap-2 overflow-hidden">
            {/* Y-axis guidelines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 dark:opacity-10">
              <div className="w-full border-b border-dashed border-gray-900 dark:border-white h-0"></div>
              <div className="w-full border-b border-dashed border-gray-900 dark:border-white h-0"></div>
              <div className="w-full border-b border-dashed border-gray-900 dark:border-white h-0"></div>
              <div className="w-full border-b border-dashed border-gray-900 dark:border-white h-0"></div>
            </div>

            {/* Custom Bar Elements */}
            {chartData.map((val, i) => {
              const heightPercent = (val / maxVal) * 100;
              return (
                <div key={i} className="relative flex flex-col items-center flex-1 h-full justify-end group">
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold py-1 px-2 rounded whitespace-nowrap z-20 shadow-xl pointer-events-none">
                    {val}k Trades
                  </div>
                  
                  <div 
                    className="w-full max-w-[40px] rounded-t-md bg-gradient-to-t from-indigo-600 via-indigo-500 to-indigo-400 dark:from-indigo-900 dark:via-indigo-600 dark:to-indigo-400 shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/50 group-hover:-translate-y-1 transition-all duration-300 relative z-10"
                    style={{ height: `${heightPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity rounded-t-md" />
                  </div>
                  <div className="mt-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {months[i]}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
