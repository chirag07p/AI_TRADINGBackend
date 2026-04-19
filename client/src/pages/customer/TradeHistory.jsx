import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { ArrowUpRight, ArrowDownRight, Clock, Filter } from 'lucide-react';
import { getTrades } from '../../services/api';

export const TradeHistory = () => {
  const { user } = useAuth();
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL, BUY, SELL

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const data = await getTrades(user.token);
        setTrades(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchTrades();
  }, [user]);

  const filteredTrades = filter === 'ALL' ? trades : trades.filter(t => t.type === filter);

  // Stats
  const totalBuys = trades.filter(t => t.type === 'BUY').length;
  const totalSells = trades.filter(t => t.type === 'SELL').length;
  const totalVolume = trades.reduce((sum, t) => sum + (t.quantity * t.price), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trade History</h1>

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg dark:bg-red-900/20">{error}</div>}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Trades</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{trades.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Buy Orders</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
            <ArrowUpRight className="w-5 h-5" /> {totalBuys}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Sell Orders</p>
          <p className="text-2xl font-bold text-red-500 flex items-center gap-1">
            <ArrowDownRight className="w-5 h-5" /> {totalSells}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Total Volume</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            ${totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500 mr-2">Filter:</span>
        {['ALL', 'BUY', 'SELL'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filter === f 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Trades Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-400" />
            Recent Transactions ({filteredTrades.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.map((t) => (
                <TableRow key={t._id}>
                  <TableCell className="text-gray-500 text-xs">
                    {new Date(t.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    <br />
                    <span className="text-gray-400">{new Date(t.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900 dark:text-white">{t.symbol}</TableCell>
                  <TableCell>
                    <Badge variant={t.type === 'BUY' ? 'success' : 'danger'} className="flex items-center gap-1 w-fit">
                      {t.type === 'BUY' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">{t.quantity}</TableCell>
                  <TableCell className="font-mono">${t.price?.toFixed(2)}</TableCell>
                  <TableCell className="font-mono font-semibold">${(t.quantity * t.price)?.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={t.status === 'COMPLETED' ? 'success' : t.status === 'FAILED' ? 'danger' : 'warning'}>
                      {t.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTrades.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                    {trades.length === 0 ? 'No trades yet. Go to Wallet to execute your first trade!' : 'No trades match this filter.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
