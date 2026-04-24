import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [trades, setTrades] = useState([
    { id: 't1', customerId: 'c1', amount: 50, date: '2026-04-10', status: 'Completed', profit: '+12%' }
  ]);

  // Weighted scoring matching engine
  const calculateMatchScore = (trader, client) => {
    let score = 0;
    const expMap = { 'Expert': 30, 'Senior': 20, 'Standard': 10, 'Junior': 5 };
    if (client.risk === 'High') score += expMap[trader.experience] || 0;
    else if (client.risk === 'Medium') score += (trader.experience === 'Senior' ? 30 : 15);
    else score += (trader.experience === 'Junior' ? 30 : 10);

    if (trader.specialization === client.risk.toLowerCase() || trader.specialization === 'mixed') score += 25;
    score += (trader.successRate / 100) * 25;

    const assignedCount = customers.filter(c => c.assignedTraderId === trader.id).length;
    if (assignedCount >= 5) score -= 20; 
    else if (assignedCount >= 3) score -= 10;

    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const simulateAIAssignment = async () => {
    if (user?.token && user?.role === 'Admin') {
      try {
        const response = await fetch('http://localhost:5000/api/allocate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });
        const results = await response.json();
        
        // Update local state with real backend results
        if (Array.isArray(results)) {
          setCustomers(prev => prev.map(c => {
            const match = results.find(r => r.clientName === c.name);
            if (match) {
              return { 
                ...c, 
                assignedTraderId: match.allocation.traderId, 
                matchScore: match.allocation.matchScore,
                aiExplanation: match.allocation.aiExplanation // Store explanation for UI
              };
            }
            return c;
          }));
        }
      } catch (err) {
        console.error('Backend Allocation Failed:', err);
      }
    }
    
    // Fallback/Simulated logic for non-admin or offline
    setCustomers(prevCustomers => {
      return prevCustomers.map(customer => {
        if (customer.assignedTraderId) return customer;
        let bestTrader = null;
        let highestScore = -1;
        employees.forEach(trader => {
          const score = calculateMatchScore(trader, customer);
          if (score > highestScore) {
            highestScore = score;
            bestTrader = trader;
          }
        });
        return { ...customer, assignedTraderId: bestTrader?.id || null, matchScore: highestScore };
      });
    });
  };

  useEffect(() => {
    const fetchLiveData = async () => {
      if (!user?.token) return;
      try {
        const [empRes, custRes] = await Promise.all([
          fetch('http://localhost:5000/api/user/employees', { headers: { 'Authorization': `Bearer ${user.token}` } }),
          fetch('http://localhost:5000/api/user/customers', { headers: { 'Authorization': `Bearer ${user.token}` } })
        ]);

        if (empRes.ok && custRes.ok) {
          const empData = await empRes.json();
          const custData = await custRes.json();
          
          setEmployees(empData.map(e => ({
            id: e._id,
            name: e.name,
            role: 'Employee',
            experience: e.level,
            successRate: e.performanceScore,
            specialization: e.specialization?.join(', ') || 'Global Markets',
            capacity: e.capacity,
            currentLoad: e.currentLoad
          })));

          setCustomers(custData.map(c => ({
            id: c._id,
            name: c.name,
            role: 'Customer',
            risk: c.riskAppetite,
            assignedTraderId: c.assignedTraderId,
            portfolioValue: c.portfolioValue
          })));
        }
      } catch (err) {
        console.warn('Live sync failed:', err);
      }
    };

    fetchLiveData();
    simulateAIAssignment();
  }, [user]);

  const assignCoins = (customerId, amount) => {
    setCustomers(prev => prev.map(c => 
      c.id === customerId ? { ...c, coins: (c.coins || 0) + amount } : c
    ));
  };

  const updateFeedback = (customerId, rating) => {
    setCustomers(prev => prev.map(c =>
      c.id === customerId ? { ...c, feedback: rating } : c
    ));
    // Re-run AI assignment since feedback affects trader matching
    setTimeout(() => simulateAIAssignment(), 100);
  };

  const registerCustomer = (data) => {
    const newCustomer = {
      id: `c_${Date.now()}`,
      name: data.name,
      email: data.email || '',
      phone: data.phone || '',
      role: 'Customer',
      risk: 'Medium',
      feedback: 0,
      portfolioValue: data.portfolioValue || Math.floor(Math.random() * 100000) + 10000,
      complexity: Math.floor(Math.random() * 10) + 1,
      assignedTraderId: null,
      matchScore: 0,
      coins: data.coins || 0
    };
    
    setCustomers(prev => {
      const updated = [...prev, newCustomer];
      return updated;
    });
    
    setTimeout(() => {
      simulateAIAssignment();
    }, 100);
  };

  const updateUser = (userId, updatedData) => {
    let oldUser = null;
    let oldType = null;
    
    if (employees.find(e => e.id === userId)) {
      oldUser = employees.find(e => e.id === userId);
      oldType = 'Employee';
    } else if (customers.find(c => c.id === userId)) {
      oldUser = customers.find(c => c.id === userId);
      oldType = 'Customer';
    }

    if (!oldUser) return;

    const newUser = { ...oldUser, ...updatedData };
    const newType = newUser.role;

    if (oldType === newType) {
      if (newType === 'Employee') {
        setEmployees(prev => prev.map(e => e.id === userId ? newUser : e));
      } else {
        setCustomers(prev => prev.map(c => c.id === userId ? newUser : c));
      }
    } else {
      if (oldType === 'Employee') {
        setEmployees(prev => prev.filter(e => e.id !== userId));
        setCustomers(prev => [...prev, { ...newUser, risk: 'Medium', feedback: 0, coins: 0, assignedTraderId: null }]);
      } else {
        setCustomers(prev => prev.filter(c => c.id !== userId));
        setEmployees(prev => [...prev, { ...newUser, experience: 'Standard', successRate: 75, specialization: 'mixed' }]);
      }
    }
    
    setTimeout(() => {
      simulateAIAssignment();
    }, 100);
  };

  return (
    <AppDataContext.Provider value={{
      employees, customers, trades,
      assignCoins, updateUser, updateFeedback, simulateAIAssignment, registerCustomer
    }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);
