import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Users, Target } from 'lucide-react';

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { customers } = useAppData();

  const assignedCustomers = customers.filter(c => c.assignedTraderId === user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">My Customers</CardTitle>
            <Users className="w-4 h-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{assignedCustomers.length}</div>
            <p className="text-xs text-gray-500 mt-1">Assigned by AI algorithm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">My Specialization</CardTitle>
            <Target className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-900 dark:text-white capitalize">{user.experience} Trader</div>
            <p className="text-xs text-gray-500 mt-1">Focus: {user.specialization}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
