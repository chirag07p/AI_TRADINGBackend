import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { getAIAdvice, unassignCustomerTrader } from '../../services/api';
import {
  Users, Target, TrendingUp, TrendingDown, Activity,
  ArrowUpRight, BarChart3, Star, Clock, DollarSign,
  Zap, CheckCircle, AlertCircle, ChevronRight, 
  Layers, MessageSquare, ShieldAlert
} from 'lucide-react';

const MOCK_MARKET = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.42, change: +1.23, pct: +0.65 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 172.85, change: -3.41, pct: -1.93 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 876.30, change: +12.5, pct: +1.45 },
  { symbol: 'MSFT', name: 'Microsoft', price: 414.70, change: +2.10, pct: +0.51 },
  { symbol: 'BTC',  name: 'Bitcoin',  price: 64310.00, change: -820.0, pct: -1.26 },
  { symbol: 'ETH',  name: 'Ethereum', price: 3182.50, change: +45.2, pct: +1.44 },
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
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Smart Allocation Logic: Load Calculation
  const maxCapacity = 10;
  const currentLoad = (assignedCustomers.length / maxCapacity) * 100;

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

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!aiQuery) return;
    setAiLoading(true);
    try {
      const response = await getAIAdvice(user.token, {
        symbol: 'MARKET',
        marketData: {},
        query: aiQuery,
      });
      setAiResponse(response.advice);
    } catch (err) {
      setAiResponse("AI Service unreachable. Please check backend API connection.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. SMART HEADER & CAPACITY */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Trader Control Center
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
            <Badge className="bg-indigo-600 text-white border-none text-[10px] font-bold px-2 py-0.5 uppercase">Trader ID: {user.id?.slice(-6)}</Badge>
            Welcome back, <span className="font-bold text-gray-900 dark:text-gray-100">{user.name}</span>
          </p>
        </div>

        {/* Smart Resource Indicator */}
        <Card className="flex-1 lg:max-w-xs p-4 bg-gray-50/50 dark:bg-gray-800/50 border-dashed border-gray-200 dark:border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="w-3 h-3" /> Allocation Load
            </span>
            <span className={`text-[10px] font-black uppercase ${currentLoad > 80 ? 'text-red-500' : 'text-green-500'}`}>
              {currentLoad > 80 ? 'CRITICAL LOAD' : 'OPTIMAL'}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${currentLoad > 80 ? 'bg-red-500' : 'bg-indigo-600'}`} 
              style={{ width: `${currentLoad}%` }} 
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">
            {assignedCustomers.length} of {maxCapacity} slots assigned
          </p>
        </Card>
      </div>

      {/* 2. KPI STRIP */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Assigned Clients', value: assignedCustomers.length, icon: Users, color: 'indigo', sub: 'Active relationships' },
          { label: 'Risk Exposure', value: highRisk, icon: ShieldAlert, color: 'red', sub: 'Requires mitigation' },
          { label: 'Client Feedback', value: avgFeedback, icon: Star, color: 'yellow', sub: 'Avg rating / 5.0' },
          { label: 'Trader Perf', value: `${user.successRate || 82}%`, icon: Target, color: 'green', sub: 'Win rate history' },
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <Card key={label} className="p-5 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all">
            <div className={`p-2 w-fit rounded-xl bg-${color}-50 dark:bg-${color}-500/10 mb-4`}>
              <Icon className={`w-4 h-4 text-${color}-600 dark:text-${color}-400`} />
            </div>
            <p className="text-3xl font-black text-gray-900 dark:text-white leading-none mb-1">{value}</p>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
            <p className="text-[10px] text-gray-400 mt-2 italic">{sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3. AI TRADER COPILOT */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-indigo-100 dark:border-indigo-900/30 bg-gradient-to-br from-white to-indigo-50/20 dark:from-gray-900 dark:to-indigo-950/10 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Zap className="w-32 h-32" />
            </div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">System Copilot</h3>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-tighter">Proprietary Engine Active</p>
              </div>
            </div>

            <form onSubmit={handleAskAI} className="space-y-4">
              <div className="relative">
                <Input 
                  placeholder="Ask for trade strategies, risk mitigation, or market outlook..." 
                  className="h-12 bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-800 pl-4 pr-12 focus:ring-indigo-500 rounded-2xl"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                />
                <Button 
                  type="submit"
                  size="sm"
                  className="absolute right-1.5 top-1.5 h-9 bg-indigo-600 hover:bg-indigo-700"
                  disabled={aiLoading}
                >
                  {aiLoading ? <Zap className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
                </Button>
              </div>
            </form>

            {aiResponse && (
              <div className="mt-6 p-5 bg-indigo-600/5 dark:bg-indigo-500/5 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
                  <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Market Strategy Result</p>
                </div>
                <div className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-medium prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{aiResponse}</ReactMarkdown>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="ghost" className="h-7 text-[10px] font-bold text-gray-400 hover:text-indigo-600" onClick={() => setAiResponse('')}>DISMISS INSIGHT</Button>
                </div>
              </div>
            )}
          </Card>

          {/* 4. LIVE MARKET WATCH */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-sm uppercase font-black tracking-widest text-gray-500">
                <Activity className="w-4 h-4" /> Live Market Signals
              </CardTitle>
              <Badge className="text-[10px] bg-green-500/10 text-green-600 border-none px-2 py-0.5">REAL-TIME</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {prices.map(stock => (
                  <div key={stock.symbol} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/40 border border-transparent hover:border-gray-100 transition-all cursor-crosshair">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black ${stock.pct >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {stock.symbol.slice(0, 3)}
                      </div>
                      <div>
                        <p className="font-black text-sm text-gray-900 dark:text-gray-100">{stock.symbol}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{stock.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-black text-sm text-gray-900 dark:text-gray-100">
                        ${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className={`text-[10px] font-black ${stock.pct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.pct >= 0 ? '↑' : '↓'} {Math.abs(stock.pct)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 5. SMART SIDEBAR: PRIORITY QUEUE */}
        <div className="space-y-6">
          <Card className="border-indigo-100 dark:border-indigo-900/30">
            <CardHeader className="pb-3 border-b border-gray-50 dark:border-gray-800">
              <CardTitle className="text-sm font-black flex items-center gap-2 text-gray-900 dark:text-white uppercase tracking-widest">
                <ShieldAlert className="w-4 h-4 text-red-500" /> Priority Attention
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {assignedCustomers.filter(c => c.risk === 'High' || (c.feedback > 0 && c.feedback < 3)).length > 0 ? (
                  assignedCustomers
                    .filter(c => c.risk === 'High' || (c.feedback > 0 && c.feedback < 3))
                    .slice(0, 4)
                    .map(c => (
                      <div key={c.id} className="group cursor-pointer">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-black text-xs text-gray-900 dark:text-white truncate">{c.name}</p>
                          <div className="flex gap-1">
                            <Badge variant={c.riskAppetite === 'High' ? 'danger' : 'warning'} className="text-[7px] h-3.5 px-1">
                              {c.riskAppetite || 'Medium'} RISK
                            </Badge>
                            <Badge variant="outline" className="text-[7px] h-3.5 px-1 border-indigo-200 text-indigo-600">
                              {c.preferredSpecialization || 'Equity'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2 text-[9px] font-bold text-gray-400">
                          <span>Complexity: {c.complexity || 5}/10</span>
                          <span>•</span>
                          <span>Rating: {(c.feedback || 0)}.0☆</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
                            <div className={`h-full ${c.riskAppetite === 'High' ? 'bg-red-500' : 'bg-yellow-500'}`} style={{ width: c.riskAppetite === 'High' ? '90%' : '60%' }} />
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full h-7 text-[9px] font-black border border-gray-100 dark:border-gray-800 hover:bg-red-50 hover:text-red-600 hover:border-red-100 uppercase tracking-tighter" 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Disconnect from ${c.name}? This will return them to the matching pool.`)) {
                                unassignCustomerTrader(user.token, c.id).then(() => window.location.reload());
                              }
                            }}
                          >
                            Disconnect Partnership
                          </Button>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-8 h-8 text-green-200 mx-auto mb-2" />
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Portfolio Stable</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-indigo-300 transition-all text-left" onClick={() => navigate('/employee/customers')}>
              <Users className="w-4 h-4 text-indigo-600 mb-2" />
              <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase">Clients</p>
            </button>
            <button className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-indigo-300 transition-all text-left">
              <MessageSquare className="w-4 h-4 text-purple-600 mb-2" />
              <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase">Chat</p>
            </button>
            <button className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-indigo-300 transition-all text-left">
              <BarChart3 className="w-4 h-4 text-green-600 mb-2" />
              <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase">Stats</p>
            </button>
            <button className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-indigo-300 transition-all text-left">
              <Zap className="w-4 h-4 text-yellow-600 mb-2" />
              <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase">Auto</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
