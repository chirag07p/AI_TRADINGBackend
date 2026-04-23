import React from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { History, UserCheck, Shield, FileText, Search } from 'lucide-react';
import { Input } from '../../components/ui/Input';

export const AuditTrail = () => {
  const events = [
    { id: 1, admin: 'Admin_Chirag', action: 'Modified AI Allocation Weights', target: 'Scoring Engine', time: '10:45 AM', date: 'Today' },
    { id: 2, admin: 'Admin_System', action: 'Force Re-assignment', target: 'Client_JohnDoe', time: '09:30 AM', date: 'Today' },
    { id: 3, admin: 'Admin_Chirag', action: 'Updated Trader Commission', target: 'Employee_Portal', time: 'Yesterday', date: 'April 22' },
    { id: 4, admin: 'Admin_Alice', action: 'New Employee Approved', target: 'Trader_Bob', time: '2 days ago', date: 'April 21' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Security Audit Trail</h1>
        <p className="text-sm text-gray-500 font-medium">Immutable log of all administrative actions and system overrides</p>
      </div>

      <Card className="border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-3 w-1/2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input placeholder="Search logs..." className="border-none bg-transparent h-6 text-sm focus:ring-0 p-0" />
          </div>
          <Badge className="bg-indigo-600/10 text-indigo-600 border-none text-[10px] font-black uppercase">Admin Oversight Mode</Badge>
        </div>
        
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {events.map((e) => (
            <div key={e.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 dark:text-white">
                    <span className="text-indigo-600">{e.admin}</span> performed action: <span className="text-gray-600 dark:text-gray-400 font-bold">{e.action}</span>
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Target: <Badge className="text-[10px] h-5 bg-gray-100 dark:bg-gray-800 text-gray-600 border-none font-bold">{e.target}</Badge>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-gray-900 dark:text-white">{e.time}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{e.date}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
