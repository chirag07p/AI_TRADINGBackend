import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Eye, Plus, Trash2, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { getWatchlist, addToWatchlist, removeFromWatchlist, getMarketQuote } from '../../services/api';

export const Watchlist = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [symbol, setSymbol] = useState('');
  const [notes, setNotes] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchWatchlist = async () => {
    try {
      const data = await getWatchlist(user.token);
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllQuotes = async (watchlistItems) => {
    setRefreshing(true);
    const newQuotes = {};
    for (const item of watchlistItems) {
      try {
        const q = await getMarketQuote(user.token, item.symbol);
        newQuotes[item.symbol] = q;
      } catch {
        newQuotes[item.symbol] = null;
      }
    }
    setQuotes(newQuotes);
    setRefreshing(false);
  };

  useEffect(() => {
    if (user?.token) fetchWatchlist();
  }, [user]);

  useEffect(() => {
    if (items.length > 0) fetchAllQuotes(items);
  }, [items.length]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!symbol.trim()) return;
    setAddLoading(true);
    setError('');
    try {
      await addToWatchlist(user.token, { symbol: symbol.trim(), notes: notes.trim() });
      setSymbol('');
      setNotes('');
      fetchWatchlist();
    } catch (err) {
      setError(err.message);
    } finally {
      setAddLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await removeFromWatchlist(user.token, id);
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Eye className="w-6 h-6 text-indigo-500" /> Watchlist
        </h1>
        <Button
          variant="ghost"
          className="text-sm border border-gray-200 dark:border-gray-700"
          onClick={() => fetchAllQuotes(items)}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Prices
        </Button>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm dark:bg-red-900/20">{error}</div>}

      {/* Add Symbol Form */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <Input label="Symbol" placeholder="e.g. AAPL, TSLA, BTC" value={symbol} onChange={(e) => setSymbol(e.target.value)} required />
            </div>
            <div className="flex-1">
              <Input label="Notes (optional)" placeholder="e.g. Watching for breakout" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <Button type="submit" className="h-11 px-6" disabled={addLoading}>
              <Plus className="w-4 h-4 mr-1" /> {addLoading ? 'Adding...' : 'Add'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Watchlist Items */}
      {items.length === 0 ? (
        <Card className="p-8 text-center">
          <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Your watchlist is empty. Add symbols above to track prices!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const q = quotes[item.symbol];
            return (
              <Card key={item._id} className="p-5 relative group hover:shadow-lg transition-shadow">
                <button
                  onClick={() => handleRemove(item._id)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                    {q && q.change >= 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">{item.symbol}</p>
                    <p className="text-xs text-gray-400">Added {new Date(item.addedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {q ? (
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-mono font-bold text-gray-900 dark:text-white">${q.price?.toFixed(2)}</span>
                    <Badge variant={q.change >= 0 ? 'success' : 'danger'} className="text-xs">
                      {q.change >= 0 ? '+' : ''}{q.change?.toFixed(2)}
                    </Badge>
                  </div>
                ) : (
                  <div className="h-9 flex items-center">
                    <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-24 rounded"></div>
                  </div>
                )}

                {item.notes && (
                  <p className="text-xs text-gray-500 mt-2 italic border-t border-gray-100 dark:border-gray-800 pt-2">{item.notes}</p>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
