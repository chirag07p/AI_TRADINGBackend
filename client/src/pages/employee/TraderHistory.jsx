import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { useAppData } from '../../context/AppDataContext';
import { History, Search, Download, Filter } from 'lucide-react';
import { Input } from '../../components/ui/Input';

export const TraderHistory = () => {
  const { trades, customers } = useAppData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Execution History</h1>
          <p className="text-sm text-gray-500 font-medium">Log of all trade orders executed across your assigned clients</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4 text-gray-500" />
          </button>
          <button className="p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <Card className="border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 flex items-center gap-3">
          <Search className="w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search by client or asset symbol..." 
            className="border-none bg-transparent h-6 text-sm focus:ring-0 p-0"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {trades.length > 0 ? trades.map((t) => {
                const client = customers.find(c => c.id === t.customerId);
                return (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{client?.name || 'Unknown'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-black bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-indigo-500">
                        {t.symbol || 'USD'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold">{t.type || 'BUY'}</td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-gray-900 dark:text-white">${t.amount?.toLocaleString()}</p>
                      <p className="text-[10px] text-green-500 font-bold">{t.profit || '+0.00%'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={t.status === 'Completed' ? 'success' : 'warning'} className="text-[10px]">
                        {t.status?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-xs text-gray-500 font-medium">{new Date(t.date).toLocaleDateString()}</p>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <History className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No transaction records found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
