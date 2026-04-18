import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export const Analytics = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
      <Card>
        <CardHeader>
          <CardTitle>Trade Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
            <p className="text-gray-500">Analytics chart placeholder (simulated data visualization)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
