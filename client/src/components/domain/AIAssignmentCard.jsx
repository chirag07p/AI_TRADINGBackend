import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { StarRating } from '../ui/StarRating';
import { BrainCircuit, ArrowRight } from 'lucide-react';

export const AIAssignmentCard = ({ customer, assignedEmployee }) => {
  if (!customer || !assignedEmployee) return null;

  return (
    <Card className="border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-br from-white to-indigo-50/30 dark:from-gray-900 dark:to-indigo-950/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center text-sm font-medium text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-indigo-500" />
            AI Assignment Match
          </span>
          <Badge variant="brand">Active Match</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between mt-4">
          <div className="flex-1 w-full p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="text-xs text-gray-500 mb-1">Customer Profile</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">{customer.name}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={customer.risk === 'High' ? 'danger' : customer.risk === 'Low' ? 'success' : 'warning'}>
                {customer.risk} Risk
              </Badge>
              <StarRating rating={customer.feedback} />
            </div>
          </div>

          <div className="my-4 md:my-0 md:mx-4 flex items-center justify-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50">
              <ArrowRight className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <div className="flex-1 w-full p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="text-xs text-gray-500 mb-1">Assigned Trader</div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">{assignedEmployee.name}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="default">{assignedEmployee.experience}</Badge>
              <Badge variant="default" className="capitalize">{assignedEmployee.specialization}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
