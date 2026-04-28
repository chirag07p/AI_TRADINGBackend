import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, LogOut, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';
import './Navbar.css';

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
      { name: 'Platform', path: '/platform' },
      { name: 'Market Intelligence', path: '/market-intelligence' },
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' }
    ];
    if (user.role === 'Admin') return [
      { name: 'Home', path: '/' },
      { name: 'Dashboard', path: '/admin' },
      { name: 'Users', path: '/admin/users' },
      { name: 'AI Logic', path: '/admin/ai-assignment' },
      { name: 'Analytics', path: '/admin/analytics' },
      { name: 'System Logs', path: '/admin/system-logs' },
      { name: 'Audit Trail', path: '/admin/audit-trail' },
      { name: 'Settings', path: '/admin/settings' }
    ];
    if (user.role === 'Employee') return [
      { name: 'Home', path: '/' },
      { name: 'Dashboard', path: '/employee' },
      { name: 'My Customers', path: '/employee/customers' },
      { name: 'Market', path: '/employee/market' },
      { name: 'Performance', path: '/employee/performance' },
      { name: 'History', path: '/employee/history' }
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
    <nav className="premium-navbar">
      <div className="premium-nav-container">

        {/* Brand Logo */}
        <div className="premium-logo-group" onClick={() => navigate('/')}>
          <div className="premium-logo-icon-wrapper">
            <TrendingUp className="premium-logo-icon" />
          </div>
          <span className="premium-logo-text">Top Gun</span>
        </div>

        {/* Interactions & User Profile */}
        <div className="premium-nav-actions">
          <button
            onClick={toggleTheme}
            className="premium-theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user && (
            <div className="premium-user-section">
              <div className="premium-user-info">
                <div className="premium-user-name">{user.name}</div>
                <div className="premium-user-role">{user.role}</div>
              </div>
              <Button variant="secondary" size="sm" onClick={handleLogout} className="rounded-xl">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};
