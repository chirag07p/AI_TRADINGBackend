import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserPlus } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [investment, setInvestment] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      await register({ name: name.trim(), email: email.trim(), password });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-6 lg:p-8 border-indigo-100 dark:border-indigo-900/50 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <div className="text-center pt-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 shadow-inner">
            <UserPlus className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Join as a new Customer</p>
        </div>
        
        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 dark:bg-red-900/20 dark:border-red-900/50">{error}</div>}
        {success && <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100 dark:bg-green-900/20 dark:border-green-900/50">{success}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Michael Jordan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="michael@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Mobile Number"
              type="tel"
              placeholder="+91 9876543210"
              pattern="^(?:\+91|91)?[6789]\d{9}$"
              title="Please enter a valid 10-digit Indian mobile number (e.g. +91 9876543210)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="Initial Investment Amount ($)"
              type="number"
              min="0"
              placeholder="e.g. 1000"
              value={investment}
              onChange={(e) => setInvestment(e.target.value)}
            />
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Must be at least 6 characters</p>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-bold shadow-lg shadow-indigo-500/20"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Already have an account? <Link to="/login" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Sign in</Link>
          </p>
        </form>
      </Card>
    </div>
  );
};
