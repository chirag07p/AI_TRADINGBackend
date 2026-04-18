import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { StarRating } from '../../components/ui/StarRating';
import { Badge } from '../../components/ui/Badge';

export const Profile = () => {
  const { user } = useAuth();
  const { customers, employees } = useAppData();

  const customerData = customers.find(c => c.id === user.id) || user;
  const assignedTrader = employees.find(e => e.id === customerData.assignedTraderId);

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{customerData.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Risk Profile</p>
              <Badge variant={customerData.risk === 'High' ? 'danger' : customerData.risk === 'Low' ? 'success' : 'warning'}>
                {customerData.risk}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">My Feedback Rating</p>
              <StarRating rating={customerData.feedback || 0} />
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-md font-medium text-gray-900 dark:text-gray-100 mb-2">My Assigned Trader</h3>
            {assignedTrader ? (
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <p className="font-semibold text-gray-900 dark:text-gray-100">{assignedTrader.name}</p>
                <div className="flex gap-2 mt-2">
                  <Badge>{assignedTrader.experience}</Badge>
                  <Badge className="capitalize">{assignedTrader.specialization}</Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Please wait while the AI assigns a trader for you.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
