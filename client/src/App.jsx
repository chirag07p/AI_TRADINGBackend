import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { cn } from './components/ui/Card';
import { AppDataProvider } from './context/AppDataContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public
import { Home } from './pages/public/Home';
import { Platform } from './pages/public/Platform';
import { Pricing } from './pages/public/Pricing';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';

// Auth
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';

// Admin
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { UsersManagement } from './pages/admin/UsersManagement';
import { AIAssignmentDashboard } from './pages/admin/AIAssignmentDashboard';
import { Analytics } from './pages/admin/Analytics';
import { SystemLogs } from './pages/admin/SystemLogs';
import { AuditTrail } from './pages/admin/AuditTrail';
import { PlatformSettings } from './pages/admin/PlatformSettings';

// Employee
import { EmployeeDashboard } from './pages/employee/EmployeeDashboard';
import { MyCustomers } from './pages/employee/MyCustomers';
import { MarketAnalytics } from './pages/employee/MarketAnalytics';
import { PerformanceInsights } from './pages/employee/PerformanceInsights';
import { TraderHistory } from './pages/employee/TraderHistory';

// Customer
import { CustomerDashboard } from './pages/customer/CustomerDashboard';
import { Onboarding } from './pages/customer/Onboarding';
import { Profile } from './pages/customer/Profile';
import { Wallet } from './pages/customer/Wallet';
import { TradeHistory } from './pages/customer/TradeHistory';

const AppLayout = ({ children }) => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-950 transition-colors">
      <Navbar />
      <Sidebar />
      <main className="w-full transition-all duration-300 pl-20 md:pl-24 lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppDataProvider>
          <BrowserRouter>
            <AppLayout>
              <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/platform" element={<Platform />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Admin Routes */}
                <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<UsersManagement />} />
                  <Route path="/admin/ai-assignment" element={<AIAssignmentDashboard />} />
                  <Route path="/admin/analytics" element={<Analytics />} />
                  <Route path="/admin/system-logs" element={<SystemLogs />} />
                  <Route path="/admin/audit-trail" element={<AuditTrail />} />
                  <Route path="/admin/settings" element={<PlatformSettings />} />
                </Route>

                {/* Employee Routes */}
                <Route element={<ProtectedRoute allowedRoles={['Employee']} />}>
                  <Route path="/employee" element={<EmployeeDashboard />} />
                  <Route path="/employee/customers" element={<MyCustomers />} />
                  <Route path="/employee/market" element={<MarketAnalytics />} />
                  <Route path="/employee/performance" element={<PerformanceInsights />} />
                  <Route path="/employee/history" element={<TraderHistory />} />
                </Route>

                {/* Customer Routes */}
                <Route element={<ProtectedRoute allowedRoles={['Customer']} />}>
                  <Route path="/customer/onboarding" element={<Onboarding />} />
                  <Route path="/customer" element={<CustomerDashboard />} />
                  <Route path="/customer/profile" element={<Profile />} />
                  <Route path="/customer/wallet" element={<Wallet />} />
                  <Route path="/customer/history" element={<TradeHistory />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </AppDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
