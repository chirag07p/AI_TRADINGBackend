import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TrendingUp } from 'lucide-react';

export const Login = () => {
  const [role, setRole] = useState('Customer');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const { employees, customers } = useAppData();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) return;
    if (!password.trim()) {
      setError('Please enter a mock password to continue.');
      return;
    }

    let user;
    if (role === 'Admin') {
      user = { id: 'admin1', name: name.trim(), role: 'Admin' };
    } else if (role === 'Employee') {
      user = employees.find(emp => emp.name.toLowerCase().includes(name.trim().toLowerCase())) || 
             { id: `emp_${Date.now()}`, name: name.trim(), role: 'Employee', experience: 'Junior', specialization: 'mixed' };
    } else {
      user = customers.find(c => c.name.toLowerCase().includes(name.trim().toLowerCase())) || 
             { id: `c_${Date.now()}`, name: name.trim(), role: 'Customer', risk: 'Medium', feedback: 3, assignedTraderId: null, coins: 0 };
    }

    login(user);

    if (role === 'Admin') navigate('/admin');
    else if (role === 'Employee') navigate('/employee');
    else navigate('/customer');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-6 lg:p-8 border-indigo-100 dark:border-indigo-900/50 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <div className="text-center pt-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 shadow-inner">
            <TrendingUp className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">TradeAI Dashboard</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Sign in to your account</p>
        </div>
        
        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 dark:bg-red-900/20 dark:border-red-900/50">{error}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Select Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="flex h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:text-white transition-shadow"
              >
                <option value="Admin" className="dark:bg-gray-800">Admin</option>
                <option value="Employee" className="dark:bg-gray-800">Employee (Trader)</option>
                <option value="Customer" className="dark:bg-gray-800">Customer</option>
              </select>
            </div>

            <Input
              label="Username / Name"
              placeholder="e.g., Alice, Admin, John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Enter any dummy password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Hint: Use any text for mock auth</p>
            </div>
            
          </div>

          <Button type="submit" className="w-full h-12 text-lg font-bold shadow-lg shadow-indigo-500/20">
            Sign In
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Don't have an account? <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Register here</Link>
          </p>
        </form>
      </Card>
    </div>
  );
};
