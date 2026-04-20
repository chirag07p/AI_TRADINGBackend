import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Wallet, Activity, Contact, TrendingUp, DollarSign, Brain, Send, ArrowUpRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDashboardSummary, getAIAdvice, sendMessage as sendMessageAPI } from '../../services/api';

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

  // Message Trader
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageSending, setMessageSending] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageContent.trim() || !assignedTrader) return;
    setMessageSending(true);
    try {
      await sendMessageAPI(user.token, {
        receiverId: assignedTrader.id,
        content: messageContent.trim()
      });
      alert('Message sent successfully!');
      setMessageContent('');
      setShowMessageModal(false);
    } catch (err) {
      alert(`Failed to send message: ${err.message}`);
    } finally {
      setMessageSending(false);
    }
  };

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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Dedicated Trader Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-indigo-100 dark:border-indigo-900/30 overflow-hidden">
            <CardHeader className="bg-indigo-50/50 dark:bg-indigo-900/10 border-b border-indigo-100 dark:border-indigo-900/20">
              <CardTitle className="flex items-center gap-2 text-indigo-900 dark:text-indigo-100">
                <Brain className="w-5 h-5" /> Your Dedicated Trader Match
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {assignedTrader ? (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shrink-0">
                      {assignedTrader.name.charAt(0)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col md:flex-row md:items-center gap-2">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{assignedTrader.name}</h3>
                        <Badge variant="brand">{assignedTrader.experience} Trader</Badge>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">Specialization: <span className="font-semibold text-indigo-600 dark:text-indigo-400 capitalize">{assignedTrader.specialization}</span></p>
                      <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                        <div className="text-center">
                          <p className="text-sm font-bold text-green-600 dark:text-green-400">{assignedTrader.successRate}%</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Success Rate</p>
                        </div>
                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
                        <div className="text-center">
                          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{customerData.matchScore || 90}%</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Match Score</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 relative">
                    <div className="absolute -top-3 left-4 px-2 bg-white dark:bg-gray-900 text-[10px] font-bold text-indigo-500 uppercase tracking-widest">
                      ✦ AI Match Explanation
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed pt-2">
                      "{assignedTrader.name} is your optimal match because their {assignedTrader.experience} background in {assignedTrader.specialization} trading perfectly aligns with your {customerData.risk} risk profile. The system prioritized their {assignedTrader.successRate}% success rate to ensure your ₹{customerData.portfolioValue?.toLocaleString() || '1.5Cr'} portfolio receives expert oversight."
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="w-12 h-12 text-gray-200 mx-auto mb-4 animate-pulse" />
                  <p className="text-gray-500 font-medium">Auto-aligning your portfolio with the best available trader...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Trades */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2"><Activity className="w-4 h-4" /> Activity Feed</CardTitle>
              <Button variant="ghost" className="text-xs h-8 px-3" onClick={() => navigate('/customer/history')}>View Full History</Button>
            </CardHeader>
            <CardContent>
              {dashboard?.recentTrades?.length > 0 ? (
                <div className="space-y-3">
                  {dashboard.recentTrades.slice(0, 4).map((t) => (
                    <div key={t._id} className="flex items-center justify-between p-3 bg-gray-200/30 dark:bg-gray-800/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Badge variant={t.type === 'BUY' ? 'success' : 'danger'} className="w-12 justify-center text-[10px]">{t.type}</Badge>
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{t.symbol}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xs text-gray-900 dark:text-white font-bold">{t.quantity} @ ${t.price?.toFixed(2)}</p>
                        <p className="text-[10px] text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500 text-sm">No recent transactions reported by your trader.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Portfolio Stats & Quick Link */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-6">Portfolio Health</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-gray-400">ALLOCATION STATUS</span>
                  <span className="text-green-500">OPTIMAL</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[94%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-gray-400">TRADER ATTENTION</span>
                  <span className="text-indigo-500">ACTIVE</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[78%]" />
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
              <Button className="w-full h-12 text-sm font-bold" onClick={() => navigate('/customer/wallet')}>
                <Wallet className="w-4 h-4 mr-2" /> Manage Funds & Wallet
              </Button>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-6 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-20"><Brain className="w-24 h-24" /></div>
            <h4 className="text-lg font-black mb-2 leading-tight">Need expert consultation?</h4>
            <p className="text-xs text-indigo-100 mb-4 leading-relaxed">Your assigned trader {assignedTrader?.name} is available for direct consultation regarding your ₹{customerData.portfolioValue?.toLocaleString() || '1.5Cr'} portfolio.</p>
            <Button className="bg-white text-indigo-600 hover:bg-indigo-50 w-full font-bold" onClick={() => setShowMessageModal(true)}>Message Trader</Button>
          </Card>
        </div>

      </div>

      {/* Message Trader Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-indigo-100 dark:border-indigo-900/50">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                  <Send className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Consult {assignedTrader?.name}</h3>
                  <p className="text-xs text-gray-500 font-medium">Your dedicated expert advisor</p>
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Message Content</label>
                  <textarea
                    className="flex w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:text-white min-h-[150px] resize-none"
                    placeholder="Type your question or consultation request here..."
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowMessageModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20" disabled={messageSending}>
                    {messageSending ? 'Sending...' : 'Send Message'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
