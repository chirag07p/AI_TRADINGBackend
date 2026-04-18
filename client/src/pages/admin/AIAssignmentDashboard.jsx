import React from 'react';
import { useAppData } from '../../context/AppDataContext';
import { AIAssignmentCard } from '../../components/domain/AIAssignmentCard';

export const AIAssignmentDashboard = () => {
  const { customers, employees } = useAppData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Assignment Logic</h1>
      <p className="text-gray-600 dark:text-gray-400">
        The system automatically assigns the best trader to each customer based on risk level and feedback rating.
      </p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {customers.map((customer) => {
          const assignedEmpl = employees.find(e => e.id === customer.assignedTraderId);
          return (
            <AIAssignmentCard 
              key={customer.id} 
              customer={customer} 
              assignedEmployee={assignedEmpl} 
            />
          );
        })}
      </div>
    </div>
  );
};
