import React, { createContext, useContext, useState } from 'react';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 1024);

  const toggleSidebar = () => setIsSidebarCollapsed(prev => !prev);

  return (
    <LayoutContext.Provider value={{ isSidebarCollapsed, setIsSidebarCollapsed, toggleSidebar }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
