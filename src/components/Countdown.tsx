import { useEffect, useState } from 'react';

interface CountdownProps {
  onComplete: () => void;
}

export default function Countdown({ onComplete }: CountdownProps) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      const timeout = setTimeout(onComplete, 600);
      return () => clearTimeout(timeout);
    }
    const interval = setTimeout(() => setCount(c => c - 1), 800);
    return () => clearTimeout(interval);
  }, [count, onComplete]);

  return (
    <div className="countdown-overlay">
      {count > 0 ? (
        <div className="countdown-text" key={count}>{count}</div>
      ) : (
        <div className="countdown-go" key="go">GO!</div>
      )}
    </div>
  );
}
