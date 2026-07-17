'use client';

import { useState, useEffect } from 'react';

export default function LPTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 15, seconds: 40 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <span style={{ letterSpacing: 1 }}>
        02:15:40
      </span>
    );
  }

  return (
    <span style={{ letterSpacing: 1 }}>
      {String(timeLeft.hours).padStart(2, '0')}:
      {String(timeLeft.minutes).padStart(2, '0')}:
      {String(timeLeft.seconds).padStart(2, '0')}
    </span>
  );
}
