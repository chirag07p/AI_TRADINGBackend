import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Users, Target, TrendingUp, TrendingDown, Activity,
  ArrowUpRight, BarChart3, Star, Clock, DollarSign,
  Zap, CheckCircle, AlertCircle, ChevronRight
} from 'lucide-react';

const MOCK_MARKET = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.42, change: +1.23, pct: +0.65 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 172.85, change: -3.41, pct: -1.93 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 876.30, change: +12.5, pct: +1.45 },
  { symbol: 'MSFT', name: 'Microsoft', price: 414.70, change: +2.10, pct: +0.51 },
  { symbol: 'BTC',  name: 'Bitcoin',  price: 64310.00, change: -820.0, pct: -1.26 },
  { symbol: 'ETH',  name: 'Ethereum', price: 3182.50, change: +45.2, pct: +1.44 },
];

const RECENT_ACTIVITY = [
  { id: 1, text: 'Executed BUY 10 × AAPL for C1', time: '2m ago', icon: 'buy' },
  { id: 2, text: 'Portfolio rebalance completed for C2', time: '15m ago', icon: 'check' },
  { id: 3, text: 'Risk alert triggered on TSLA position', time: '1h ago', icon: 'alert' },
  { id: 4, text: 'Monthly report sent to 3 clients', time: '3h ago', icon: 'check' },
];

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { customers } = useAppData();
  const navigate = useNavigate();

  const assignedCustomers = customers.filter(c => c.assignedTraderId === user.id);
  const highRisk = assignedCustomers.filter(c => c.risk === 'High').length;
  const avgFeedback = assignedCustomers.length
    ? (assignedCustomers.reduce((sum, c) => sum + (c.feedback || 0), 0) / assignedCustomers.length).toFixed(1)
    : '—';

  const [prices, setPrices] = useState(MOCK_MARKET);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(stock => {
        const delta = (Math.random() - 0.5) * stock.price * 0.002;
        const newPrice = +(stock.price + delta).toFixed(2);
        const newChange = +(stock.change + delta).toFixed(2);
        const newPct = +((newChange / newPrice) * 100).toFixed(2);
        return { ...stock, price: newPrice, change: newChange, pct: newPct };
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Trader Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, <span className="font-semibold text-gray-700 dark:text-gray-300">{user.name}</span>
            {user.specialization && <span className="ml-2 text-indigo-500 text-sm">· {user.specialization}</span>}
          </p>
        </div>
        <Button onClick={() => navigate('/employee/customers')} className="flex items-center gap-2 h-10 px-5">
          <Users className="w-4 h-4" /> Manage Clients
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/employee/customers')}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">Assigned Clients</p>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{assignedCustomers.length}</p>
          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            <ChevronRight className="w-3 h-3" /> View all clients
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">High Risk</p>
            <div className="p-2 rounded-xl bg-red-50 dark:bg-red-500/10">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{highRisk}</p>
          <p className="text-xs text-red-400 mt-1">Require close monitoring</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">Avg. Rating</p>
            <div className="p-2 rounded-xl bg-yellow-50 dark:bg-yellow-500/10">
              <Star className="w-4 h-4 text-yellow-500" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">{avgFeedback}</p>
          <p className="text-xs text-gray-400 mt-1">out of 5 stars</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-500">Success Rate</p>
            <div className="p-2 rounded-xl bg-green-50 dark:bg-green-500/10">
              <Target className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white">
            {user.successRate || 82}<span className="text-lg">%</span>
          </p>
          <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> Above average
          </p>
        </Card>
      </div>

      {/* Market Watch + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Market Watch */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="w-5 h-5 text-indigo-500" />
              Live Market Watch
              <span className="flex items-center gap-1 text-xs font-normal text-green-500 ml-2">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                Live
              </span>
            </CardTitle>
            <Badge className="text-xs bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">Simulated</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {prices.map(stock => (
                <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${stock.pct >= 0 ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
                      {stock.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{stock.symbol}</p>
                      <p className="text-xs text-gray-400">{stock.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-sm text-gray-900 dark:text-gray-100">
                      ${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className={`text-xs font-semibold ${stock.pct >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {stock.pct >= 0 ? '+' : ''}{stock.pct}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed + Trader Info */}
        <div className="space-y-4">
          {/* Trader Profile Card */}
          <Card className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-100 dark:border-indigo-800/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/30">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold capitalize">
                  {user.experience || 'Junior'} Trader
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Specialization</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200 capitalize">{user.specialization || 'Mixed'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Clients</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{assignedCustomers.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Success Rate</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{user.successRate || 82}%</span>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {RECENT_ACTIVITY.map(item => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      item.icon === 'buy' ? 'bg-blue-50 text-blue-500 dark:bg-blue-500/10' :
                      item.icon === 'check' ? 'bg-green-50 text-green-500 dark:bg-green-500/10' :
                      'bg-red-50 text-red-500 dark:bg-red-500/10'
                    }`}>
                      {item.icon === 'buy' && <TrendingUp className="w-3 h-3" />}
                      {item.icon === 'check' && <CheckCircle className="w-3 h-3" />}
                      {item.icon === 'alert' && <AlertCircle className="w-3 h-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{item.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Client Overview Strip */}
      {assignedCustomers.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" /> Client Portfolio Overview
            </CardTitle>
            <Button variant="ghost" className="text-xs h-8 px-3" onClick={() => navigate('/employee/customers')}>
              Manage All →
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {assignedCustomers.slice(0, 4).map(c => (
                <div key={c.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">{c.name}</p>
                    <Badge variant={c.risk === 'High' ? 'danger' : c.risk === 'Low' ? 'success' : 'warning'} className="text-xs ml-1">
                      {c.risk}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-3 h-3 ${i <= (c.feedback || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-mono">Coins: {c.coins || 0}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
