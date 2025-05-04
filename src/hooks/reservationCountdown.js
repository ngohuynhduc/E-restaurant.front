import { useEffect, useState } from "react";

export const useCountdown = (expiredTime) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!expiredTime) return;

    const expiredAt = new Date(expiredTime).getTime();
    const countdownTarget = expiredAt;
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((countdownTarget - now) / 1000));
      setTimeLeft(diff);
    };

    updateCountdown();

    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [expiredTime]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return { minutes, seconds, isExpired: timeLeft <= 0 };
};
