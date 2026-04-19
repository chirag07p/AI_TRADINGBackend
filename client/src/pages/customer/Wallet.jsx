import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { ArrowUpRight, ArrowDownRight, Wallet as WalletIcon, CreditCard, Activity } from 'lucide-react';

export const Wallet = () => {
  const { user } = useAuth();
  const { customers } = useAppData();
  const customerData = customers.find(c => c.id === user.id) || user;
  
  const balance = customerData.coins || 0;
  
  // Simulated transactions
  const transactions = [
    { id: 1, type: 'deposit', amount: 1540.00, date: 'Today, 2:41 PM', status: 'Completed' },
    { id: 2, type: 'withdrawal', amount: 350.50, date: 'Yesterday, 11:30 AM', status: 'Completed' },
    { id: 3, type: 'deposit', amount: 8900.00, date: 'Oct 24, 9:15 AM', status: 'Completed' },
    { id: 4, type: 'deposit', amount: 150.00, date: 'Oct 20, 4:00 PM', status: 'Completed' },
  ];

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
                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            <button className="flex flex-col items-center justify-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ArrowDownRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Deposit</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ArrowUpRight className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
              </div>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Withdraw</span>
            </button>
          </div>
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
            
            <div className="flex-1 p-6 flex flex-col gap-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700/50 cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                      tx.type === 'deposit' 
                        ? 'bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400' 
                        : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                      {tx.type === 'deposit' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 capitalize">
                        {tx.type === 'deposit' ? 'Trader Allocation' : 'Withdrawal Request'}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono font-bold text-lg ${
                      tx.type === 'deposit' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </div>
                    <p className="text-xs font-semibold text-gray-400 dark:text-gray-500">{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

