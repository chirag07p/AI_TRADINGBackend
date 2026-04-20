import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { ArrowUpRight, ArrowDownRight, Wallet as WalletIcon, CreditCard, Activity, Briefcase } from 'lucide-react';
import { getPortfolio, depositPortfolio, withdrawPortfolio, executeTrade, getMarketQuote } from '../../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const Wallet = () => {
  const { user } = useAuth();
  
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('deposit');
  const [modalAmount, setModalAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Bank Transfer');

  // Trade state
  const [tradeSymbol, setTradeSymbol] = useState('');
  const [tradeQty, setTradeQty] = useState(1);
  const [tradeType, setTradeType] = useState('BUY');
  const [tradeMessage, setTradeMessage] = useState({ text: '', type: '' });
  const [tradeLoading, setTradeLoading] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await getPortfolio(user.token);
        setBalance(data.totalBalance);
        setTransactions(data.transactions || []);
      } catch (err) {
        console.error('Failed to fetch portfolio', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) {
      fetchBalance();
    }
  }, [user]);

  const handleAction = (type) => {
    setModalType(type);
    setModalAmount('');
    setPaymentMode('Bank Transfer');
    setModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const amount = Number(modalAmount);
    if (!amount || amount <= 0) {
      alert('Invalid amount');
      return;
    }
    
    setActionLoading(true);
    try {
      if (modalType === 'deposit') {
        const data = await depositPortfolio(user.token, amount, paymentMode);
        setBalance(data.totalBalance);
        if (data.transactions) setTransactions(data.transactions);
      } else {
        const data = await withdrawPortfolio(user.token, amount, paymentMode);
        setBalance(data.totalBalance);
        if (data.transactions) setTransactions(data.transactions);
      }
      setModalOpen(false);
    } catch (err) {
      alert(err.message || `Failed to ${modalType}`);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const opts = { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', opts);
  };

  // Sort transactions (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleTrade = async (e) => {
    e.preventDefault();
    if (!tradeSymbol || tradeQty <= 0) return;
    
    setTradeLoading(true);
    setTradeMessage({ text: '', type: '' });

    try {
      // 1. Get current market price
      const quote = await getMarketQuote(user.token, tradeSymbol.toUpperCase());
      if (!quote || !quote.price) throw new Error('Could not fetch market price for symbol');
      
      const price = quote.price;

      // 2. Execute trade
      await executeTrade(user.token, {
        symbol: tradeSymbol.toUpperCase(),
        type: tradeType,
        quantity: tradeQty,
        price: price,
        decisionReasoning: 'Manual quick trade from wallet'
      });
      
      setTradeMessage({ text: `${tradeType} ${tradeQty} ${tradeSymbol.toUpperCase()} at $${price.toFixed(2)} successful!`, type: 'success' });
      
      // Refresh portfolio balance
      const data = await getPortfolio(user.token);
      setBalance(data.totalBalance);
      setTransactions(data.transactions || []);
      
      // Reset form
      setTradeSymbol('');
      setTradeQty(1);
    } catch (err) {
      setTradeMessage({ text: err.message || `Failed to execute ${tradeType}`, type: 'error' });
    } finally {
      setTradeLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
          My Virtual Wallet
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your AI-assigned trading capital and transaction history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Card & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Glassmorphic Virtual Card */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-indigo-900 via-indigo-700 to-purple-800 p-6 shadow-2xl shadow-indigo-900/40 text-white min-h-[220px] flex flex-col justify-between group">
            <div className="absolute top-0 right-0 p-32 bg-white/10 blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2 group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 p-32 bg-indigo-500/20 blur-3xl rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                  <WalletIcon className="w-5 h-5 text-indigo-50" />
                </div>
                <span className="font-semibold tracking-wide text-indigo-100">TradeAI Black</span>
              </div>
              <CreditCard className="w-8 h-8 opacity-50" />
            </div>

            <div className="relative z-10 mt-8">
              <p className="text-sm font-medium text-indigo-200 mb-1 opacity-80 uppercase tracking-widest">Available Balance</p>
              <div className="text-5xl font-black tracking-tight">
                {loading ? '...' : `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              </div>
            </div>

            <div className="relative z-10 flex justify-between items-end mt-6">
              <div className="text-sm font-mono tracking-widest text-indigo-200 opacity-90">
                **** **** **** 4092
              </div>
              <div className="text-xs uppercase font-bold text-indigo-200 tracking-wider">
                {user.name}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleAction('deposit')}
              disabled={actionLoading}
              className="flex flex-col items-center justify-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group disabled:opacity-50">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ArrowDownRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Deposit</span>
            </button>
            <button 
              onClick={() => handleAction('withdraw')}
              disabled={actionLoading}
              className="flex flex-col items-center justify-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group disabled:opacity-50">
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ArrowUpRight className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Withdraw</span>
            </button>
          </div>

          {/* Quick Trade Widget */}
          <Card className="mt-6 border border-gray-200 dark:border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-500" /> Quick Trade
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrade} className="space-y-4">
                {tradeMessage.text && (
                  <div className={`p-2 text-xs rounded ${tradeMessage.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'}`}>
                    {tradeMessage.text}
                  </div>
                )}
                
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setTradeType('BUY')}
                    className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-colors ${tradeType === 'BUY' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  >
                    Buy
                  </button>
                  <button 
                    type="button"
                    onClick={() => setTradeType('SELL')}
                    className={`flex-1 py-1.5 text-sm font-semibold rounded-lg transition-colors ${tradeType === 'SELL' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                  >
                    Sell
                  </button>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input 
                      placeholder="Symbol (e.g. AAPL)" 
                      value={tradeSymbol}
                      onChange={(e) => setTradeSymbol(e.target.value.toUpperCase())}
                      required
                    />
                  </div>
                  <div className="w-24">
                    <Input 
                      type="number" 
                      min="1" 
                      placeholder="Qty" 
                      value={tradeQty}
                      onChange={(e) => setTradeQty(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full text-sm h-9" disabled={tradeLoading}>
                  {tradeLoading ? 'Checking Market...' : `Execute ${tradeType}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Transactions */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800 shadow-sm rounded-2xl h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Activity className="w-5 h-5 text-indigo-500" />
                Recent Activity
              </h3>
              <button className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View All
              </button>
            </div>
            
            <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto max-h-[400px]">
              {sortedTransactions.length === 0 ? (
                <div className="text-center text-gray-400 dark:text-gray-500 py-8">
                  No recent activity
                </div>
              ) : (
                sortedTransactions.map((tx) => (
                  <div key={tx._id || Math.random().toString()} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700/50 cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                        tx.type === 'deposit' 
                          ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' 
                          : tx.type === 'withdraw'
                            ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                            : tx.type === 'buy'
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                              : 'bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400'
                      }`}>
                        {(tx.type === 'deposit' || tx.type === 'sell') ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 capitalize">
                          {tx.type === 'deposit' ? 'Trader Allocation' : tx.type === 'withdraw' ? 'Withdrawal Request' : tx.type === 'buy' ? 'Asset Purchase' : 'Asset Sale'}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(tx.date)}
                          {tx.paymentMode && (tx.type === 'deposit' || tx.type === 'withdraw') && ` • via ${tx.paymentMode}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono font-bold text-lg ${
                        (tx.type === 'deposit' || tx.type === 'sell') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {(tx.type === 'deposit' || tx.type === 'sell') ? '+' : '-'}${tx.amount.toFixed(2)}
                      </div>
                      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500">{tx.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 capitalize text-gray-900 dark:text-white">
                {modalType} Funds
              </h3>
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Amount ($)</label>
                  <Input 
                    type="number" 
                    min="1" 
                    placeholder="e.g. 500" 
                    value={modalAmount}
                    onChange={(e) => setModalAmount(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Payment Mode</label>
                  <select 
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:text-white"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                    <option value="Crypto Wallet">Crypto Wallet</option>
                    <option value="PayPal">PayPal</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={actionLoading}>
                    {actionLoading ? 'Processing...' : 'Confirm'}
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

