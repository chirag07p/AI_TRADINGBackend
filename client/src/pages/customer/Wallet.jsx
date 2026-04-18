import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export const Wallet = () => {
  const { user } = useAuth();
  const { customers } = useAppData();
  const customerData = customers.find(c => c.id === user.id) || user;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wallet</h1>
      <Card>
        <CardHeader>
          <CardTitle>Trade Coins Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
            {customerData.coins || 0}
          </div>
          <p className="text-gray-500 mt-2">These coins are provided by your assigned trader.</p>
        </CardContent>
      </Card>
    </div>
  );
};
