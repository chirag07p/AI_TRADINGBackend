import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const UsersManagement = () => {
  const { employees, customers, updateUser } = useAppData();
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', role: '' });

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, role: user.role });
  };

  const handleSave = () => {
    updateUser(editingUser.id, formData);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users Management</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...employees, ...customers].map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">{user.name}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'Employee' ? 'brand' : 'default'}>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.role === 'Employee' ? (
                      <span className="text-gray-500">{user.experience} / {user.successRate}% Success</span>
                    ) : (
                      <span className="text-gray-500">{user.risk} Risk / {user.feedback}★</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(user)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal isOpen={!!editingUser} onClose={() => setEditingUser(null)} title="Edit User">
        {editingUser && (
          <div className="space-y-4">
            <Input 
              label="Name" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <select
                className="flex h-10 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent dark:text-gray-100 dark:bg-gray-800"
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="Employee">Employee</option>
                <option value="Customer">Customer</option>
              </select>
            </div>
            <div className="pt-4 flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setEditingUser(null)}>Cancel</Button>
              <Button variant="brand" onClick={handleSave}>Save</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
