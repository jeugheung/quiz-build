// ReloadContext.jsx
import React, { createContext, useContext, useCallback } from 'react';

const ReloadContext = createContext(null);

export const useReload = () => {
  const reload = useContext(ReloadContext);
  if (!reload) {
    throw new Error('useReload must be used within a ReloadProvider');
  }
  return reload;
};

export const ReloadProvider = ({ children }) => {
  const reload = useCallback(() => {
    window.location.reload(); // Перезагружаем страницу
  }, []);

  return (
    <ReloadContext.Provider value={reload}>
      {children}
    </ReloadContext.Provider>
  );
};
