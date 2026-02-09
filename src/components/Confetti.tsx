import { useMemo } from 'react';

const CONFETTI_COUNT = 50;
const COLORS = ['#e10600', '#ffcc00', '#0090ff', '#00d2be', '#ff8700', '#ffffff', '#52e252'];

export default function Confetti() {
  const pieces = useMemo(() => {
    return Array.from({ length: CONFETTI_COUNT }, (_, i) => {
      const color = COLORS[i % COLORS.length];
      const left = Math.random() * 100;
      const delay = Math.random() * 2;
      const duration = 2 + Math.random() * 2;
      const size = 6 + Math.random() * 8;
      const shape = Math.random() > 0.5 ? '50%' : '0';
      return { id: i, color, left, delay, duration, size, shape };
    });
  }, []);

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            borderRadius: p.shape,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
