import type { RacerState } from '../types';
import Confetti from './Confetti';

interface ResultScreenProps {
  racers: RacerState[];
  onReset: () => void;
}

export default function ResultScreen({ racers, onReset }: ResultScreenProps) {
  const standings = [...racers].sort((a, b) => a.finishOrder - b.finishOrder);
  const winner = standings[0];

  const posClass = (i: number) => {
    if (i === 0) return 'gold';
    if (i === 1) return 'silver';
    if (i === 2) return 'bronze';
    return '';
  };

  const posMedal = (i: number) => {
    if (i === 0) return '\u{1F947}';
    if (i === 1) return '\u{1F948}';
    if (i === 2) return '\u{1F949}';
    return `${i + 1}`;
  };

  return (
    <>
      <Confetti />
      <div className="result-overlay" onClick={(e) => {
        if (e.target === e.currentTarget) onReset();
      }}>
        <div className="result-card">
          <div className="trophy">{'\u{1F3C6}'}</div>
          <div className="result-label">Winner</div>
          <div className="winner-name">{winner.name}</div>
          <div className="standings">
            <div className="standings-title">Final Standings</div>
            {standings.map((racer, i) => (
              <div className="standing-row" key={racer.id}>
                <span className={`standing-pos ${posClass(i)}`}>
                  {posMedal(i)}
                </span>
                <span
                  className="standing-dot"
                  style={{ background: racer.color }}
                />
                <span className="standing-name">{racer.name}</span>
              </div>
            ))}
          </div>
          <button className="reset-btn" onClick={onReset}>
            Race Again
          </button>
        </div>
      </div>
    </>
  );
}
