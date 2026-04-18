import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleLinks = () => {
    if (!user) return [
      { name: 'Home', path: '/' },
    ];
    if (user.role === 'Admin') return [
      { name: 'Home', path: '/' },
      { name: 'Dashboard', path: '/admin' },
      { name: 'Users', path: '/admin/users' },
      { name: 'AI Logic', path: '/admin/ai-assignment' },
      { name: 'Analytics', path: '/admin/analytics' }
    ];
    if (user.role === 'Employee') return [
      { name: 'Home', path: '/' },
      { name: 'Dashboard', path: '/employee' },
      { name: 'My Customers', path: '/employee/customers' }
    ];
    if (user.role === 'Customer') return [
      { name: 'Home', path: '/' },
      { name: 'Dashboard', path: '/customer' },
      { name: 'Profile', path: '/customer/profile' },
      { name: 'Wallet', path: '/customer/wallet' },
      { name: 'History', path: '/customer/history' }
    ];
    return [];
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-2 rounded-xl shadow-lg shadow-indigo-500/30">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">TradeAI</span>
          </div>

          <div className="hidden md:flex space-x-1">
            {getRoleLinks().map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200 dark:border-gray-800">
                <div className="hidden sm:block text-sm text-right">
                  <div className="font-bold text-gray-900 dark:text-gray-100">{user.name}</div>
                  <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{user.role}</div>
                </div>
                <Button variant="secondary" size="sm" onClick={handleLogout} className="rounded-xl">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200 dark:border-gray-800">
                <Button variant="ghost" onClick={() => navigate('/login')} className="rounded-xl font-bold">Sign In</Button>
                <Button variant="primary" onClick={() => navigate('/register')} className="rounded-xl font-bold shadow-lg shadow-indigo-500/30">Get Started</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
