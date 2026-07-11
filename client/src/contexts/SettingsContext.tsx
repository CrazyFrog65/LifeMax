import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  useAmPm: boolean;
  setUseAmPm: (val: boolean) => void;
  formatTime: (time24h: string) => string;
}

const SettingsContext = createContext<SettingsContextType>({
  useAmPm: false,
  setUseAmPm: () => {},
  formatTime: (t) => t,
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [useAmPm, setUseAmPm] = useState(() => {
    const saved = localStorage.getItem('useAmPm');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('useAmPm', String(useAmPm));
  }, [useAmPm]);

  const formatTime = (time24h: string) => {
    if (!time24h) return time24h;
    
    // time24h is usually in format "HH:mm" or "HH:mm-"
    const hasSuffix = time24h.endsWith('–') || time24h.endsWith('-');
    const cleanTime = time24h.replace(/[–-]/g, '');
    
    if (!useAmPm) return time24h;

    const [h, m] = cleanTime.split(':');
    if (!h || !m) return time24h;

    let hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;

    const formatted = `${hour}:${m} ${ampm}`;
    return hasSuffix ? `${formatted}–` : formatted;
  };

  return (
    <SettingsContext.Provider value={{ useAmPm, setUseAmPm, formatTime }}>
      {children}
    </SettingsContext.Provider>
  );
};
