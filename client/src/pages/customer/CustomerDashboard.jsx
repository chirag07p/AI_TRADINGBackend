import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Wallet, Activity, Contact } from 'lucide-react';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const { customers, employees, trades } = useAppData();

  const customerData = customers.find(c => c.id === user.id) || user;
  const assignedTrader = employees.find(e => e.id === customerData.assignedTraderId);
  const myTrades = trades.filter(t => t.customerId === user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Wallet Balance</CardTitle>
            <Wallet className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex gap-1 text-gray-900 dark:text-white">
              {customerData.coins || 0}
              <span className="text-gray-400 text-sm font-normal self-end mb-1">coins</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Assigned Trader</CardTitle>
            <Contact className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-900 dark:text-white capitalize">
              {assignedTrader ? assignedTrader.name : 'Unassigned'}
            </div>
            {assignedTrader && <p className="text-xs text-gray-500 mt-1">{assignedTrader.experience} / {assignedTrader.specialization}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Trades</CardTitle>
            <Activity className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{myTrades.length}</div>
            <p className="text-xs text-gray-500 mt-1">Historically tracked trades</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
