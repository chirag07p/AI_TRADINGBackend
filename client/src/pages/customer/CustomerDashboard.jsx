import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Wallet, Activity, Contact, TrendingUp, DollarSign, Brain, Send, ArrowUpRight, Eye, Check, X, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getDashboardSummary, getAIAdvice, sendMessage as sendMessageAPI, allocateCustomer, finalizeAllocationProposal, rejectAllocationProposal, unassignCustomerTrader } from '../../services/api';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const { customers, employees } = useAppData();
  const navigate = useNavigate();

  const customerData = customers.find(c => c.id === (user._id || user.id)) || user;
  const assignedTrader = employees.find(e => e.id === customerData.assignedTraderId);

  // Backend data
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  // AI Advisor
  const [aiQuery, setAiQuery] = useState('');
  const [aiSymbol, setAiSymbol] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Proposed Match State
  const [proposedMatch, setProposedMatch] = useState(null);

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

  const [matchingLoading, setMatchingLoading] = useState(false);
  const handleAIMatch = async () => {
    setMatchingLoading(true);
    try {
      const targetId = user._id || user.id;
      const data = await allocateCustomer(user.token, targetId);
      setProposedMatch(data);
    } catch (err) {
      alert(`Matching failed: ${err.message}`);
    } finally {
      setMatchingLoading(false);
    }
  };

  const [finalizingLoading, setFinalizingLoading] = useState(false);
  const handleAcceptMatch = async () => {
    if (!proposedMatch) return;
    setFinalizingLoading(true);
    try {
      await finalizeAllocationProposal(user.token, proposedMatch.allocationId);
      alert('Partnership established! Redirecting...');
      window.location.reload();
    } catch (err) {
      alert(`Finalization failed: ${err.message}`);
    } finally {
      setFinalizingLoading(false);
    }
  };

  const handleRejectMatch = async () => {
    if (!proposedMatch) return;
    try {
      await rejectAllocationProposal(user.token, proposedMatch.allocationId);
      setProposedMatch(null);
    } catch (err) {
      alert(`Rejection failed: ${err.message}`);
    }
  };

  const [disconnectingLoading, setDisconnectingLoading] = useState(false);
  const handleDisconnect = async () => {
    if (!window.confirm("Are you sure you want to disconnect from your current trader?")) return;
    setDisconnectingLoading(true);
    try {
      await unassignCustomerTrader(user.token);
      alert('Successfully disconnected from your trader.');
      window.location.reload();
    } catch (err) {
      alert(`Disconnect failed: ${err.message}`);
    } finally {
      setDisconnectingLoading(false);
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

      {!assignedTrader && !proposedMatch && (
        <Card className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 border-none shadow-2xl p-8 text-white">
          <div className="absolute top-0 right-0 p-8 opacity-10 animate-pulse">
            <Brain className="w-32 h-32" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Neural Matching Engine Active</p>
              </div>
              <h2 className="text-3xl font-black mb-3">Initialize Your Trading DNA</h2>
              <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                Our AI analyzes your risk appetite and financial goals to pair you with a top-tier trader specializing in your preferred asset classes. Start your journey with a data-driven partnership.
              </p>
              <Button 
                onClick={handleAIMatch}
                disabled={matchingLoading}
                className="h-12 bg-white text-indigo-900 hover:bg-indigo-50 font-black px-8 shadow-xl shadow-white/10"
              >
                {matchingLoading ? (
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-spin" /> ANALYZING NODES...
                  </span>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" /> REQUEST AI MATCH
                  </>
                )}
              </Button>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Latency', value: '4ms' },
                  { label: 'Precision', value: '98.4%' },
                  { label: 'Success', value: '92%' },
                  { label: 'Nodes', value: '128' }
                ].map(stat => (
                  <div key={stat.label} className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10 min-w-[120px]">
                    <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-xl font-black">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {proposedMatch && (
        <Card className="relative overflow-hidden border-2 border-indigo-500/50 bg-white dark:bg-gray-900 shadow-2xl p-0 transition-all animate-in zoom-in-95 duration-500">
          <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              <span className="text-sm font-black uppercase tracking-widest">AI Match Discovery</span>
            </div>
            <Badge className="bg-white/20 text-white border-none">Match Score: {proposedMatch.matchScore}%</Badge>
          </div>
          
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-3xl font-black text-indigo-600">
                  {proposedMatch.trader.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">{proposedMatch.trader.name}</h3>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] uppercase">{proposedMatch.trader.level} Expert</Badge>
                    <Badge variant="outline" className="text-[10px] uppercase">{proposedMatch.trader.experience} Years Exp.</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-bold text-gray-400 uppercase">Specialization</span>
                  <span className="text-sm font-black text-indigo-600">{proposedMatch.trader.specialization?.join(', ')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-bold text-gray-400 uppercase">Performance</span>
                  <span className="text-sm font-black text-green-500">{proposedMatch.trader.performanceScore}% Success Rate</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-bold text-gray-400 uppercase">Current Workload</span>
                  <span className="text-sm font-black text-gray-600 dark:text-gray-300">{proposedMatch.trader.currentLoad}/{proposedMatch.trader.capacity} Clients</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 flex flex-col">
              <div className="flex items-center gap-2 mb-4 text-indigo-600">
                <Info className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Neural Logic Justification</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic flex-1">
                "{proposedMatch.aiExplanation}"
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <Button 
                  variant="outline" 
                  onClick={handleRejectMatch}
                  className="h-12 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 font-black"
                >
                  <X className="w-4 h-4 mr-2" /> REJECT
                </Button>
                <Button 
                  onClick={handleAcceptMatch}
                  disabled={finalizingLoading}
                  className="h-12 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 font-black"
                >
                  {finalizingLoading ? 'FINALIZING...' : (
                    <><Check className="w-4 h-4 mr-2" /> ACCEPT PARTNER</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Interaction & Activity (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. AI Strategy Advisor (Primary Interaction) */}
          <Card className="p-6 border-indigo-100 dark:border-indigo-900/30 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md shadow-indigo-500/20">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">AI Strategy Advisor</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Powered by NVIDIA Nemotron-3</p>
              </div>
            </div>

            <form onSubmit={handleAskAI} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="md:w-1/4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block ml-1">Asset Symbol</label>
                  <Input 
                    placeholder="e.g. BTC" 
                    className="h-11 bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:ring-indigo-500"
                    value={aiSymbol}
                    onChange={(e) => setAiSymbol(e.target.value.toUpperCase())}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block ml-1">Your Question</label>
                  <Input 
                    placeholder="What's the best entry strategy for this week?" 
                    className="h-11 bg-gray-50/50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-800 focus:ring-indigo-500"
                    value={aiQuery}
                    onChange={(e) => setAiQuery(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 text-sm font-black bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.98]"
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-spin" /> ANALYZING...
                  </span>
                ) : 'GENERATE AI INSIGHT'}
              </Button>
            </form>

            {aiResponse && (
              <div className="mt-6 p-4 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                  <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">NVIDIA AI RECOMMENDATION</p>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                  {aiResponse}
                </p>
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="ghost" 
                    className="h-7 text-[10px] font-bold text-gray-400 hover:text-indigo-600 hover:bg-transparent p-0"
                    onClick={() => setAiResponse('')}
                  >
                    DISMISS ANALYSIS
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* 2. Recent Activity Feed */}
          <Card className="border-gray-100 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-sm font-black flex items-center gap-2 text-gray-900 dark:text-white uppercase tracking-widest">
                <Activity className="w-4 h-4 text-indigo-500" /> Recent Operations
              </CardTitle>
              <Button variant="ghost" className="text-[10px] font-bold h-7 px-3 text-indigo-600" onClick={() => navigate('/customer/history')}>
                FULL HISTORY
              </Button>
            </CardHeader>
            <CardContent className="pb-6">
              {dashboard?.recentTrades?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dashboard.recentTrades.slice(0, 6).map((t) => (
                    <div key={t._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100/50 dark:border-gray-800/50 hover:border-indigo-200 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${t.type === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {t.type.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-sm text-gray-900 dark:text-white">{t.symbol}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{t.type} ORDER</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-black text-gray-900 dark:text-white">${t.price?.toLocaleString()}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{new Date(t.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
                  <Activity className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No recent trade signals</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: Team & Portfolio Intelligence (1/3 width) */}
        <div className="space-y-6">
          
          {/* 1. Your Expert Partner */}
          <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
            <div className="p-6 relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Contact className="w-20 h-20" />
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-xl font-black">
                  {assignedTrader ? assignedTrader.name.charAt(0) : '?'}
                </div>
                <div>
                  <h3 className="text-lg font-black leading-none mb-1">{assignedTrader ? assignedTrader.name : 'Awaiting Match'}</h3>
                  <Badge className="bg-white/20 text-white border-none text-[10px] font-bold">
                    {assignedTrader ? `${assignedTrader.level} Expert` : 'System Engine'}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                  <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-tighter mb-1">Success Rate</p>
                  <p className="text-lg font-black">{assignedTrader?.successRate || '94'}%</p>
                </div>
                <div className="bg-black/10 rounded-xl p-3 backdrop-blur-sm border border-white/5">
                  <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-tighter mb-1">Expertise</p>
                  <p className="text-xs font-black truncate">{assignedTrader?.specialization || 'Global Markets'}</p>
                </div>
              </div>

              <Button 
                className="w-full h-11 bg-white text-indigo-600 hover:bg-indigo-50 font-black text-xs uppercase tracking-widest shadow-lg"
                onClick={() => setShowMessageModal(true)}
              >
                <Send className="w-4 h-4 mr-2" /> Message Trader
              </Button>
            </div>
          </Card>

          {/* 2. Smart Insights & Health */}
          <Card className="p-6 border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp className="w-3 h-3" /> Portfolio Intelligence
            </h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-[10px] font-black mb-2">
                  <span className="text-gray-400 uppercase">Allocation Status</span>
                  <span className="text-green-500 uppercase">Optimal</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[94%] shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-[10px] font-black mb-2">
                  <span className="text-gray-400 uppercase">Trader Attention</span>
                  <span className="text-indigo-500 uppercase">High Priority</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[82%] shadow-[0_0_8px_rgba(99,102,241,0.4)]" />
                </div>
              </div>
            </div>

            {assignedTrader && (
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="w-3 h-3 text-indigo-500" />
                  <p className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tighter">Match Logic Justification</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 italic leading-relaxed">
                    "{assignedTrader.name} was selected because their expertise in {assignedTrader.specialization} perfectly offsets your {customerData.risk} risk profile, ensuring a {customerData.matchScore || 92}% strategy alignment."
                  </p>
                </div>
              </div>
            )}
            
            <div className="mt-8 space-y-3">
              <Button 
                variant="outline" 
                className="w-full h-10 text-[10px] font-black border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => navigate('/customer/wallet')}
              >
                <Wallet className="w-3.5 h-3.5 mr-2" /> MANAGE WALLET
              </Button>
              {assignedTrader && (
                <Button 
                  variant="outline" 
                  className="w-full h-10 text-[10px] font-black border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10"
                  onClick={handleDisconnect}
                  disabled={disconnectingLoading}
                >
                  <X className="w-3.5 h-3.5 mr-2" /> {disconnectingLoading ? 'DISCONNECTING...' : 'DISCONNECT PARTNER'}
                </Button>
              )}
            </div>
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
