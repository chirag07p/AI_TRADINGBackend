import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StarRating } from '../../components/ui/StarRating';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const MyCustomers = () => {
  const { user } = useAuth();
  const { customers, assignCoins } = useAppData();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [coinAmount, setCoinAmount] = useState('');

  const assignedCustomers = customers.filter(c => c.assignedTraderId === user.id);

  const handleAssignCoins = (e) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    assignCoins(selectedCustomer.id, parseInt(coinAmount) || 0);
    setCoinAmount('');
    setSelectedCustomer(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My assigned customers</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Feedback</TableHead>
                <TableHead>Balance (Coins)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedCustomers.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">{c.name}</TableCell>
                  <TableCell>
                    <Badge variant={c.risk === 'High' ? 'danger' : c.risk === 'Low' ? 'success' : 'warning'}>
                      {c.risk}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <StarRating rating={c.feedback} />
                  </TableCell>
                  <TableCell className="font-mono text-gray-600 dark:text-gray-400">{c.coins}</TableCell>
                  <TableCell>
                    <Button variant="secondary" size="sm" onClick={() => setSelectedCustomer(c)}>
                      Assign Coins
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {assignedCustomers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                    No customers assigned currently
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal 
        isOpen={!!selectedCustomer} 
        onClose={() => setSelectedCustomer(null)}
        title="Assign Coins"
      >
        <form onSubmit={handleAssignCoins} className="space-y-4 pt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Allocate trading coins to <b className="text-gray-900 dark:text-gray-100">{selectedCustomer?.name}</b>.
          </p>
          <Input 
            type="number" 
            label="Amount" 
            placeholder="e.g. 500" 
            value={coinAmount}
            onChange={(e) => setCoinAmount(e.target.value)}
            required 
            min="1"
          />
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="ghost" onClick={() => setSelectedCustomer(null)}>Cancel</Button>
            <Button type="submit">Assign</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
