import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

export function useCurrentTime() {
  const [currentTimeMins, setCurrentTimeMins] = useState(() => {
    const now = dayjs();
    return now.hour() * 60 + now.minute();
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = dayjs();
      setCurrentTimeMins(now.hour() * 60 + now.minute());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return currentTimeMins;
}
