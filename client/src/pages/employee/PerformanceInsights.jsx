import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Award, Target, Users, LineChart, TrendingUp, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const PerformanceInsights = () => {
  const { user } = useAuth();
  
  const stats = [
    { label: 'Total Clients', value: '12', icon: Users, color: 'text-blue-500' },
    { label: 'Success Rate', value: '88%', icon: Target, color: 'text-green-500' },
    { label: 'Platform Rank', value: '#4', icon: Award, color: 'text-yellow-500' },
    { label: 'Avg Feedback', value: '4.8', icon: Star, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Trader Performance</h1>
          <p className="text-sm text-gray-500 font-medium">Detailed metrics and success tracking for {user?.name}</p>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-none font-bold">MONTHLY VIEW</Badge>
          <Badge className="bg-green-500/10 text-green-500 border-none font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +4.2% GROWTH
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 flex flex-col items-center text-center">
            <s.icon className={`w-6 h-6 ${s.color} mb-3`} />
            <p className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-center gap-2 mb-6">
            <LineChart className="w-5 h-5 text-indigo-600" />
            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Growth Trajectory</h3>
          </div>
          <div className="h-64 flex items-end gap-2 px-2">
            {[40, 60, 45, 70, 85, 65, 90].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all hover:opacity-80" 
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] font-bold text-gray-400">W{i+1}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest mb-6">Trader Milestones</h3>
          <div className="space-y-6">
            {[
              { title: 'Top Performer April', date: 'April 2026', desc: 'Achieved >85% success rate across 10+ clients.' },
              { title: 'Expert Certification', date: 'March 2026', desc: 'Promoted to Expert level by the platform engine.' },
              { title: 'Customer Satisfaction MVP', date: 'Feb 2026', desc: 'Maintained 5/5 rating for 3 consecutive weeks.' }
            ].map((m, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-1.5 bg-gray-100 dark:bg-gray-800 rounded-full relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-gray-900 shadow-sm" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white">{m.title}</h4>
                  <p className="text-[10px] text-indigo-500 font-bold uppercase">{m.date}</p>
                  <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
