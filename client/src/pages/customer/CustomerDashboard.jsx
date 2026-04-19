import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Wallet, Activity, Contact, TrendingUp, DollarSign, Brain, Send, ArrowUpRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDashboardSummary, getAIAdvice } from '../../services/api';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const { customers, employees } = useAppData();
  const navigate = useNavigate();

  const customerData = customers.find(c => c.id === user.id) || user;
  const assignedTrader = employees.find(e => e.id === customerData.assignedTraderId);

  // Backend data
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  // AI Advisor
  const [aiQuery, setAiQuery] = useState('');
  const [aiSymbol, setAiSymbol] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboardSummary(user.token);
        setDashboard(data);
      } catch {
        // Silently fail for mock users
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchDashboard();
    else setLoading(false);
  }, [user]);

  const handleAskAI = async (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResponse('');
    try {
      const data = await getAIAdvice(user.token, {
        symbol: aiSymbol.trim() || 'GENERAL',
        marketData: {},
        query: aiQuery.trim(),
      });
      setAiResponse(data.advice);
    } catch (err) {
      setAiResponse(`Error: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name || 'Trader'} 👋
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/customer/wallet')}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Cash Balance</p>
            <DollarSign className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${dashboard?.portfolio?.totalBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '100,000.00'}
          </p>
          <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> Paper trading</p>
        </Card>

        <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/customer/wallet')}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Net Worth</p>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${dashboard?.portfolio?.netWorth?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '100,000.00'}
          </p>
          <p className="text-xs text-gray-400 mt-1">{dashboard?.stats?.assetsHeld || 0} assets held</p>
        </Card>

        <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/customer/history')}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Total Trades</p>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboard?.stats?.totalTrades || 0}</p>
          <p className="text-xs text-gray-400 mt-1">
            <span className="text-green-500">{dashboard?.stats?.buyTrades || 0} buys</span> · <span className="text-red-500">{dashboard?.stats?.sellTrades || 0} sells</span>
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-500">Assigned Trader</p>
            <Contact className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white capitalize">
            {assignedTrader ? assignedTrader.name : 'Unassigned'}
          </p>
          {assignedTrader && <p className="text-xs text-gray-400 mt-1">{assignedTrader.experience} · {assignedTrader.specialization}</p>}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Trades */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Trades</CardTitle>
            <Button variant="ghost" className="text-xs h-8 px-3" onClick={() => navigate('/customer/history')}>View All</Button>
          </CardHeader>
          <CardContent>
            {dashboard?.recentTrades?.length > 0 ? (
              <div className="space-y-2">
                {dashboard.recentTrades.slice(0, 5).map((t) => (
                  <div key={t._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={t.type === 'BUY' ? 'success' : 'danger'} className="w-12 justify-center text-xs">{t.type}</Badge>
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">{t.symbol}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm text-gray-900 dark:text-white">{t.quantity} × ${t.price?.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No trades yet.</p>
                <Button variant="ghost" className="mt-2 text-sm" onClick={() => navigate('/customer/wallet')}>Execute your first trade →</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Trading Advisor */}
        <Card className="border-purple-100 dark:border-purple-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Brain className="w-5 h-5 text-purple-500" /> AI Trading Advisor
              <Badge className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Free</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAskAI} className="space-y-3">
              <Input
                label="Symbol (optional)"
                placeholder="e.g. AAPL, BTC"
                value={aiSymbol}
                onChange={(e) => setAiSymbol(e.target.value)}
              />
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Question</label>
                <textarea
                  className="flex w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 dark:text-white min-h-[70px] resize-none"
                  placeholder="e.g. Should I buy AAPL right now? What's the market outlook?"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={aiLoading}>
                <Send className="w-4 h-4 mr-2" /> {aiLoading ? 'Thinking...' : 'Ask AI Advisor'}
              </Button>
            </form>

            {aiResponse && (
              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-100 dark:border-purple-900/30">
                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">AI Response:</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{aiResponse}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button variant="ghost" className="h-14 border border-gray-200 dark:border-gray-700 text-base font-semibold" onClick={() => navigate('/customer/wallet')}>
          <Wallet className="w-5 h-5 mr-2 text-green-500" /> Trade & Wallet
        </Button>
        <Button variant="ghost" className="h-14 border border-gray-200 dark:border-gray-700 text-base font-semibold" onClick={() => navigate('/customer/watchlist')}>
          <Eye className="w-5 h-5 mr-2 text-indigo-500" /> Watchlist
        </Button>
        <Button variant="ghost" className="h-14 border border-gray-200 dark:border-gray-700 text-base font-semibold" onClick={() => navigate('/customer/profile')}>
          <Contact className="w-5 h-5 mr-2 text-purple-500" /> My Profile
        </Button>
      </div>
    </div>
  );
};
