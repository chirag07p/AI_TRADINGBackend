import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TrendingUp, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

export const Login = () => {
  const [role, setRole] = useState('Customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  
  const { login, mockLogin, googleLogin } = useAuth();
  const { employees, customers } = useAppData();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setError('');
      const userData = await googleLogin(credentialResponse.credential, role);
      if (userData.role === 'Admin') navigate('/admin');
      else if (userData.role === 'Employee') navigate('/employee');
      else navigate('/customer');
    } catch (err) {
      setError('Google authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        setError('Please enter email and password.');
        setIsLoading(false);
        return;
      }
      
      const userData = await login({ email: email.trim(), password, role });
      
      if (userData.role === 'Admin') navigate('/admin');
      else if (userData.role === 'Employee') navigate('/employee');
      else navigate('/customer');
      
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    // Simulate sending reset email (no real backend)
    await new Promise(res => setTimeout(res, 1500));
    setForgotLoading(false);
    setForgotSent(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-6 lg:p-8 border-indigo-100 dark:border-indigo-900/50 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <div className="text-center pt-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 shadow-inner">
            <TrendingUp className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Top Gun Dashboard</h2>
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
              label="Email Address"
              type="email"
              placeholder="e.g., john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-between items-center mt-1">
                <div />
                <button 
                  type="button" 
                  onClick={() => setShowForgot(true)}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-bold shadow-lg shadow-indigo-500/20"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Don't have an account? <Link to="/register" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">Register here</Link>
          </p>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login failed')}
                theme="outline"
                shape="rectangular"
                text="signin_with"
              />
            </div>
          </div>
        </form>
      </Card>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => { setShowForgot(false); setForgotSent(false); }} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reset Password</h3>
              </div>
              
              {!forgotSent ? (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm focus:ring-2 focus:ring-indigo-600 outline-none dark:text-white"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={forgotLoading}>
                    {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Check your email</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      We've sent a password reset link to <span className="font-semibold text-gray-700 dark:text-gray-300">{forgotEmail}</span>
                    </p>
                  </div>
                  <Button variant="ghost" onClick={() => { setShowForgot(false); setForgotSent(false); }} className="w-full">
                    Back to Login
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
