import React, { createContext, useContext, useState, useEffect } from 'react';

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
  const [employees, setEmployees] = useState([
    { id: 'emp1', name: 'Alice (Expert)', role: 'Employee', experience: 'Expert', successRate: 92, specialization: 'high-risk' },
    { id: 'emp2', name: 'Bob (Standard)', role: 'Employee', experience: 'Standard', successRate: 75, specialization: 'low-risk' },
    { id: 'emp3', name: 'Charlie (Senior)', role: 'Employee', experience: 'Senior', successRate: 85, specialization: 'mixed' }
  ]);

  const [customers, setCustomers] = useState([
    { id: 'c1', name: 'John Doe', role: 'Customer', risk: 'High', feedback: 4, assignedTraderId: null, coins: 0 },
    { id: 'c2', name: 'Jane Smith', role: 'Customer', risk: 'Low', feedback: 5, assignedTraderId: null, coins: 0 },
    { id: 'c3', name: 'Mike Ross', role: 'Customer', risk: 'Medium', feedback: 2, assignedTraderId: null, coins: 0 },
    { id: 'c4', name: 'Sarah Lee', role: 'Customer', risk: 'High', feedback: 3, assignedTraderId: null, coins: 0 }
  ]);

  const [trades, setTrades] = useState([
    { id: 't1', customerId: 'c1', amount: 50, date: '2026-04-10', status: 'Completed', profit: '+12%' }
  ]);

  // AI Assignment Simulation
  const simulateAIAssignment = () => {
    setCustomers(prev => prev.map(customer => {
      let assignedId = null;
      if (customer.feedback <= 3) {
        assignedId = 'emp3'; // Senior
      } else if (customer.risk === 'High') {
        assignedId = 'emp1'; // Expert/Experienced
      } else {
        assignedId = 'emp2'; // Standard
      }
      return { ...customer, assignedTraderId: assignedId };
    }));
  };

  useEffect(() => {
    simulateAIAssignment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      assignedTraderId: null,
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
