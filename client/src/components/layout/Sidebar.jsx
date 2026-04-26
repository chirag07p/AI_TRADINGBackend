import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLayout } from '../../context/LayoutContext';
import { 
  LayoutDashboard, 
  Users, 
  Zap, 
  LineChart, 
  History, 
  Settings, 
  Globe, 
  ChevronLeft, 
  ChevronRight,
  User,
  Wallet,
  Activity,
  Terminal,
  Shield,
  Home,
  Info,
  DollarSign,
  Cpu,
  LogIn,
  UserPlus
} from 'lucide-react';
import { cn } from '../ui/Card';

export const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isSidebarCollapsed: isCollapsed, setIsSidebarCollapsed: setIsCollapsed } = useLayout();

  const getLinks = () => {
    // Public Links
    if (!user) return [
      { name: 'Home', path: '/', icon: Home },
      { name: 'Platform', path: '/platform', icon: Globe },
      { name: 'Market Intelligence', path: '/market-intelligence', icon: Activity },
      { name: 'About', path: '/about', icon: Info },
    ];

    if (user.role === 'Admin') return [
      { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
      { name: 'Users', path: '/admin/users', icon: Users },
      { name: 'System Logic', path: '/admin/ai-assignment', icon: Zap },
      { name: 'Analytics', path: '/admin/analytics', icon: LineChart },
      { name: 'System Logs', path: '/admin/system-logs', icon: Terminal },
      { name: 'Audit Trail', path: '/admin/audit-trail', icon: Shield },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];
    if (user.role === 'Employee') return [
      { name: 'Dashboard', path: '/employee', icon: LayoutDashboard },
      { name: 'My Customers', path: '/employee/customers', icon: Users },
      { name: 'Market', path: '/employee/market', icon: Globe },
      { name: 'Performance', path: '/employee/performance', icon: Activity },
      { name: 'History', path: '/employee/history', icon: History },
    ];
    if (user.role === 'Customer') return [
      { name: 'Dashboard', path: '/customer', icon: LayoutDashboard },
      { name: 'Profile', path: '/customer/profile', icon: User },
      { name: 'Wallet', path: '/customer/wallet', icon: Wallet },
      { name: 'History', path: '/customer/history', icon: History },
    ];
    return [];
  };

  const links = getLinks();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-20 h-[calc(100vh-80px)] bg-[#f8faff]/90 dark:bg-[#0f111a]/90 backdrop-blur-xl border-r border-indigo-500/5 dark:border-indigo-400/5 transition-all duration-300 z-40 group shadow-2xl shadow-indigo-500/5",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="p-4 flex flex-col h-full">
        <div className="space-y-1.5 flex-1">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 group/item",
                isActive 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-indigo-600"
              )}
            >
              <link.icon className={cn("w-5 h-5 shrink-0", !isCollapsed && "group-hover/item:scale-110 transition-transform")} />
              {!isCollapsed && (
                <span className="text-[11px] font-black uppercase tracking-widest truncate">{link.name}</span>
              )}
              {isCollapsed && (
                <div className="absolute left-16 bg-gray-900 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-tighter">
                  {link.name}
                </div>
              )}
            </NavLink>
          ))}
        </div>

        {/* Auth Section for Guests */}
        {!user && (
          <div className="mt-auto space-y-2 border-t border-gray-100 dark:border-gray-900 pt-4">
            <button 
              onClick={() => navigate('/login')}
              className={cn(
                "flex items-center gap-3 p-3.5 w-full rounded-2xl transition-all text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-indigo-600",
                isCollapsed && "justify-center"
              )}
            >
              <LogIn className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="text-sm font-black uppercase tracking-widest">Sign In</span>}
            </button>
            <button 
              onClick={() => navigate('/register')}
              className={cn(
                "flex items-center gap-3 p-3.5 w-full rounded-2xl transition-all bg-indigo-600 text-white shadow-lg shadow-indigo-600/20",
                isCollapsed && "justify-center"
              )}
            >
              <UserPlus className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="text-sm font-black uppercase tracking-widest">Register</span>}
            </button>
          </div>
        )}

        {/* Bottom Status for Authenticated */}
        {user && !isCollapsed && (
          <div className="mt-auto p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100/50 dark:border-indigo-900/20">
            <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-500 uppercase">Live Engine Active</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
