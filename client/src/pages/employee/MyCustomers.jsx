import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { getMessages, sendMessage as sendMessageAPI } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import {
  Users, Star, Search, Filter, TrendingUp, TrendingDown,
  DollarSign, MessageSquare, X, ChevronDown, AlertTriangle,
  CheckCircle, Clock, BarChart2, ArrowUpDown, Coins
} from 'lucide-react';

const RISK_COLORS = {
  High: 'danger',
  Medium: 'warning',
  Low: 'success',
};

const StarRating = ({ value, onChange }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <button
        key={i}
        type="button"
        onClick={() => onChange?.(i)}
        className={`w-5 h-5 transition-transform hover:scale-110 ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <Star className={`w-5 h-5 ${i <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
      </button>
    ))}
  </div>
);

const CustomerDetailModal = ({ customer, onClose, onAssignCoins, onUpdateFeedback, onUpdateRisk }) => {
  const { user } = useAuth();
  const [coinAmt, setCoinAmt] = useState('');
  const [note, setNote] = useState('');
  const [tempRisk, setTempRisk] = useState(customer.risk);
  const [localFeedback, setLocalFeedback] = useState(customer.feedback || 0);
  const [activeTab, setActiveTab] = useState('overview');

  // Messaging Logic
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMsg, setLoadingMsg] = useState(false);

  React.useEffect(() => {
    if (activeTab === 'messages') {
      const fetchMsgs = async () => {
        try {
          const data = await getMessages(user.token, customer.id);
          setMessages(data);
        } catch {}
      };
      fetchMsgs();
      const interval = setInterval(fetchMsgs, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab, customer.id, user.token]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await sendMessageAPI(user.token, { receiverId: customer.id, content: newMessage });
      setNewMessage('');
      const data = await getMessages(user.token, customer.id);
      setMessages(data);
    } catch (err) {
      alert('Failed to send: ' + err.message);
    }
  };

  const handleAssign = (e) => {
    e.preventDefault();
    const amount = parseInt(coinAmt);
    if (!amount || amount <= 0) return;
    onAssignCoins(customer.id, amount);
    setCoinAmt('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
              {customer.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{customer.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={RISK_COLORS[customer.risk]} className="text-xs">{customer.risk} Risk</Badge>
                <span className="text-xs text-gray-400">{customer.email || 'No email'}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 px-6">
          {['overview', 'allocate', 'messages', 'notes'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-sm font-semibold capitalize border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Current Balance</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white font-mono">{customer.coins || 0}</p>
                  <p className="text-xs text-gray-400">coins allocated</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Risk Level</p>
                  <select
                    value={tempRisk}
                    onChange={e => {
                      setTempRisk(e.target.value);
                      onUpdateRisk(customer.id, e.target.value);
                    }}
                    className="w-full mt-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1.5 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Client Satisfaction</p>
                <div className="flex items-center gap-3">
                  <StarRating value={localFeedback} onChange={v => { setLocalFeedback(v); onUpdateFeedback(customer.id, v); }} />
                  <span className="text-sm text-gray-500">{localFeedback}/5</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Trades', value: Math.floor(Math.random() * 40) + 5, icon: BarChart2, color: 'blue' },
                  { label: 'Profitable', value: `${Math.floor(Math.random() * 30) + 60}%`, icon: TrendingUp, color: 'green' },
                  { label: 'Joined', value: '3 months ago', icon: Clock, color: 'purple' },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
                    <Icon className={`w-5 h-5 mx-auto mb-1 text-${color}-500`} />
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{value}</p>
                    <p className="text-xs text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'allocate' && (
            <form onSubmit={handleAssign} className="space-y-4">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mb-1">Current Balance</p>
                <p className="text-3xl font-black text-indigo-900 dark:text-indigo-300">{customer.coins || 0} <span className="text-lg font-semibold">coins</span></p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Coins to Allocate</label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 500"
                  value={coinAmt}
                  onChange={e => setCoinAmt(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2">
                {[100, 500, 1000, 5000].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setCoinAmt(String(preset))}
                    className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400 transition-colors"
                  >
                    +{preset}
                  </button>
                ))}
              </div>

              <Button type="submit" className="w-full" disabled={!coinAmt}>
                <Coins className="w-4 h-4 mr-2" /> Allocate Coins
              </Button>
            </form>
          )}

          {activeTab === 'messages' && (
            <div className="flex flex-col h-[400px]">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <MessageSquare className="w-12 h-12 mb-2 opacity-20" />
                    <p className="text-sm">No messages yet.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg._id} className={`flex ${msg.sender === user.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        msg.sender === user.id 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none'
                      }`}>
                        <p>{msg.content}</p>
                        <p className={`text-[10px] mt-1 opacity-60 ${msg.sender === user.id ? 'text-right' : 'text-left'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a reply..."
                   className="flex-1 h-10 px-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-sm focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white"
                />
                <Button type="submit" size="sm" className="h-10 px-4" disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Private Trader Notes</label>
                <textarea
                  rows={5}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Record observations, strategy ideas, or risk flags for this client..."
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-4 py-3 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>
              <Button className="w-full" onClick={() => alert('Note saved (local only)!')}>
                <MessageSquare className="w-4 h-4 mr-2" /> Save Note
              </Button>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Notes are session-only in demo mode
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const MyCustomers = () => {
  const { user } = useAuth();
  const { customers, assignCoins, updateFeedback, updateUser } = useAppData();

  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const assignedCustomers = customers.filter(c => c.assignedTraderId === user.id);

  const handleUpdateRisk = (customerId, risk) => {
    updateUser(customerId, { risk });
  };

  let filtered = assignedCustomers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === 'All' || c.risk === riskFilter;
    return matchSearch && matchRisk;
  });

  if (sortBy === 'name') filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === 'coins') filtered = [...filtered].sort((a, b) => (b.coins || 0) - (a.coins || 0));
  if (sortBy === 'rating') filtered = [...filtered].sort((a, b) => (b.feedback || 0) - (a.feedback || 0));

  const totalCoins = assignedCustomers.reduce((sum, c) => sum + (c.coins || 0), 0);
  const avgRating = assignedCustomers.length
    ? (assignedCustomers.reduce((sum, c) => sum + (c.feedback || 0), 0) / assignedCustomers.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
          My Clients
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage and monitor your assigned trading clients
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: assignedCustomers.length, icon: Users, color: 'indigo' },
          { label: 'Total Coins', value: totalCoins.toLocaleString(), icon: DollarSign, color: 'green' },
          { label: 'Avg Rating', value: `${avgRating} ★`, icon: Star, color: 'yellow' },
          { label: 'High Risk', value: assignedCustomers.filter(c => c.risk === 'High').length, icon: AlertTriangle, color: 'red' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <Icon className={`w-4 h-4 text-${color}-500`} />
            </div>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Filter className="w-4 h-4 text-gray-400" />
              {['All', 'High', 'Medium', 'Low'].map(r => (
                <button
                  key={r}
                  onClick={() => setRiskFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    riskFilter === r
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="name">Sort: Name</option>
              <option value="coins">Sort: Balance</option>
              <option value="rating">Sort: Rating</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Client Cards Grid */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {assignedCustomers.length === 0 ? 'No clients assigned yet.' : 'No clients match your filters.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(c => (
            <div
              key={c.id}
              onClick={() => setSelectedCustomer(c)}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-black text-base shadow-md">
                    {(c.name?.charAt(0) || '?').toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.email || 'Client'}</p>
                  </div>
                </div>
                <Badge variant={RISK_COLORS[c.risk]} className="text-xs">{c.risk}</Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Balance</span>
                  <span className="font-mono font-bold text-sm text-gray-900 dark:text-gray-100">{(c.coins || 0).toLocaleString()} coins</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Rating</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-3 h-3 ${i <= (c.feedback || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-400">Click to manage</span>
                <div className="flex items-center text-xs text-indigo-500 font-semibold group-hover:gap-1 transition-all">
                  View Details →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Client Detail Modal */}
      {selectedCustomer && (
        <CustomerDetailModal
          customer={customers.find(c => c.id === selectedCustomer.id) || selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onAssignCoins={(id, amt) => { assignCoins(id, amt); }}
          onUpdateFeedback={(id, rating) => updateFeedback(id, rating)}
          onUpdateRisk={(id, risk) => handleUpdateRisk(id, risk)}
        />
      )}
    </div>
  );
};
