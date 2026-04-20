import React, { useState, useEffect } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Users, BrainCircuit, Activity, TrendingUp, TrendingDown,
  DollarSign, Shield, AlertTriangle, CheckCircle, ArrowUpRight,
  BarChart3, Zap, Target, Star, Clock, ChevronRight
} from 'lucide-react';

const SYSTEM_EVENTS = [
  { id: 1, text: 'AI re-matched 2 clients after risk profile update', time: '2m ago', type: 'ai' },
  { id: 2, text: 'New customer "Jordan Price" registered', time: '14m ago', type: 'user' },
  { id: 3, text: 'High-risk alert triggered on customer C4', time: '1h ago', type: 'alert' },
  { id: 4, text: 'Monthly analytics report generated', time: '3h ago', type: 'report' },
  { id: 5, text: 'Trader "Alice" success rate updated to 94%', time: '5h ago', type: 'user' },
];

export const AdminDashboard = () => {
  const { employees, customers, trades, simulateAIAssignment } = useAppData();
  const navigate = useNavigate();

  const totalUsers = employees.length + customers.length;
  const assignedCount = customers.filter(c => c.assignedTraderId).length;
  const highRiskCount = customers.filter(c => c.risk === 'High').length;
  const avgSuccessRate = employees.length
    ? Math.round(employees.reduce((sum, e) => sum + (e.successRate || 0), 0) / employees.length)
    : 0;

  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-2xl p-7 text-white shadow-2xl shadow-indigo-900/40">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full bg-green-400 ${pulse ? 'opacity-100' : 'opacity-50'} transition-opacity`} />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">System Live</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">Admin Control Panel</h1>
            <p className="text-indigo-200 text-sm">AllocateIQ Platform — Full system overview and management</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={simulateAIAssignment}
              className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur text-white font-semibold"
            >
              <Zap className="w-4 h-4 mr-2" /> Run AI Match
            </Button>
            <Button
              onClick={() => navigate('/admin/analytics')}
              className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold"
            >
              <BarChart3 className="w-4 h-4 mr-2" /> Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: totalUsers, sub: `${employees.length} traders · ${customers.length} clients`, icon: Users, color: 'indigo', path: '/admin/users' },
          { label: 'AI Matched', value: assignedCount, sub: `${customers.length - assignedCount} unmatched`, icon: BrainCircuit, color: 'green', path: '/admin/ai-assignment' },
          { label: 'High Risk Clients', value: highRiskCount, sub: 'Require priority attention', icon: AlertTriangle, color: 'red', path: '/admin/users' },
          { label: 'Avg Success Rate', value: `${avgSuccessRate}%`, sub: 'Across all traders', icon: Target, color: 'purple', path: '/admin/analytics' },
        ].map(({ label, value, sub, icon: Icon, color, path }) => (
          <Card
            key={label}
            className="p-5 cursor-pointer hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600 transition-all group"
            onClick={() => navigate(path)}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-500">{label}</p>
              <div className={`p-2 rounded-xl bg-${color}-50 dark:bg-${color}-500/10 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-4 h-4 text-${color}-600 dark:text-${color}-400`} />
              </div>
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </Card>
        ))}
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trader Leaderboard */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="w-5 h-5 text-yellow-400" /> Trader Leaderboard
            </CardTitle>
            <Button variant="ghost" className="text-xs h-8 px-3" onClick={() => navigate('/admin/users')}>
              All Traders →
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[...employees]
                .sort((a, b) => (b.successRate || 0) - (a.successRate || 0))
                .map((emp, idx) => {
                  const assignedCnt = customers.filter(c => c.assignedTraderId === emp.id).length;
                  return (
                    <div key={emp.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black ${
                        idx === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' :
                        idx === 1 ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' :
                        'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
                      }`}>
                        #{idx + 1}
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {emp.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">{emp.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{emp.experience} · {emp.specialization}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${(emp.successRate || 0) >= 85 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'}`}>
                          {emp.successRate || 0}%
                        </p>
                        <p className="text-xs text-gray-400">{assignedCnt} clients</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* System Events */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" /> System Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {SYSTEM_EVENTS.map(evt => (
                <div key={evt.id} className="flex items-start gap-2.5">
                  <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    evt.type === 'ai' ? 'bg-purple-50 text-purple-500 dark:bg-purple-500/10' :
                    evt.type === 'alert' ? 'bg-red-50 text-red-500 dark:bg-red-500/10' :
                    evt.type === 'report' ? 'bg-blue-50 text-blue-500 dark:bg-blue-500/10' :
                    'bg-green-50 text-green-500 dark:bg-green-500/10'
                  }`}>
                    {evt.type === 'ai' && <BrainCircuit className="w-3 h-3" />}
                    {evt.type === 'alert' && <AlertTriangle className="w-3 h-3" />}
                    {evt.type === 'report' && <BarChart3 className="w-3 h-3" />}
                    {evt.type === 'user' && <CheckCircle className="w-3 h-3" />}
                  </div>
                  <div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{evt.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {evt.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Risk Distribution */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-500" /> Client Risk Distribution
          </CardTitle>
          <Button variant="ghost" className="text-xs h-8 px-3" onClick={() => navigate('/admin/ai-assignment')}>
            AI Assignments →
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['High', 'Medium', 'Low'].map(risk => {
              const count = customers.filter(c => c.risk === risk).length;
              const pct = customers.length ? Math.round((count / customers.length) * 100) : 0;
              const color = risk === 'High' ? 'red' : risk === 'Medium' ? 'yellow' : 'green';
              return (
                <div key={risk} className={`p-5 rounded-2xl bg-${color}-50 dark:bg-${color}-500/10 border border-${color}-100 dark:border-${color}-500/20`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-bold text-${color}-700 dark:text-${color}-400`}>{risk} Risk</span>
                    <Badge variant={risk === 'High' ? 'danger' : risk === 'Medium' ? 'warning' : 'success'} className="text-xs">
                      {pct}%
                    </Badge>
                  </div>
                  <p className={`text-4xl font-black text-${color}-800 dark:text-${color}-300`}>{count}</p>
                  <div className="mt-3 w-full bg-white/50 dark:bg-black/20 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full bg-${color}-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Nav */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Manage Users', sub: 'Edit roles, traders & clients', path: '/admin/users', icon: Users },
          { label: 'AI Assignment Engine', sub: 'View and retrigger AI matching', path: '/admin/ai-assignment', icon: BrainCircuit },
          { label: 'System Analytics', sub: 'Charts, KPIs, and performance', path: '/admin/analytics', icon: BarChart3 },
        ].map(({ label, sub, path, icon: Icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className="text-left p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:shadow-indigo-500/10 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-500/20 transition-colors">
                <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
