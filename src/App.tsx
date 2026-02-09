import { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';
import type { RacerOption, RacerState, AppPhase } from './types';
import { RACER_COLORS } from './types';
import OptionInput from './components/OptionInput';
import RaceTrack from './components/RaceTrack';
import ResultScreen from './components/ResultScreen';
import Countdown from './components/Countdown';

let idCounter = 0;
const genId = () => `opt-${++idCounter}`;

function App() {
  const [phase, setPhase] = useState<AppPhase>('setup');
  const [options, setOptions] = useState<RacerOption[]>([]);
  const [racers, setRacers] = useState<RacerState[]>([]);
  const animRef = useRef<number>(0);
  const winnerIdRef = useRef<string | null>(null);
  const finishCountRef = useRef(0);

  const addOption = useCallback((name: string) => {
    setOptions(prev => {
      if (prev.length >= 12) return prev;
      const color = RACER_COLORS[prev.length % RACER_COLORS.length];
      return [...prev, { id: genId(), name, color }];
    });
  }, []);

  const removeOption = useCallback((id: string) => {
    setOptions(prev => {
      const filtered = prev.filter(o => o.id !== id);
      return filtered.map((o, i) => ({
        ...o,
        color: RACER_COLORS[i % RACER_COLORS.length],
      }));
    });
  }, []);

  const startCountdown = useCallback(() => {
    if (options.length < 2) return;

    // Pre-determine the winner randomly
    const winnerIdx = Math.floor(Math.random() * options.length);
    winnerIdRef.current = options[winnerIdx].id;
    finishCountRef.current = 0;

    // Initialize racers
    const initial: RacerState[] = options.map(opt => ({
      id: opt.id,
      name: opt.name,
      color: opt.color,
      progress: 0,
      speed: 0.3 + Math.random() * 0.3,
      finished: false,
      finishOrder: 0,
    }));
    setRacers(initial);
    setPhase('countdown');
  }, [options]);

  const startRace = useCallback(() => {
    setPhase('racing');
  }, []);

  // Racing animation loop
  useEffect(() => {
    if (phase !== 'racing') return;

    const FINISH_LINE = 100;
    const winnerId = winnerIdRef.current;
    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      setRacers(prev => {
        const allFinished = prev.every(r => r.finished);
        if (allFinished) {
          setPhase('result');
          return prev;
        }

        return prev.map(racer => {
          if (racer.finished) return racer;

          // Base random acceleration with some variation
          const jitter = (Math.random() - 0.5) * 0.8;
          const accel = racer.speed + jitter;

          // Winner bias: the predetermined winner gets a slight overall advantage
          const isWinner = racer.id === winnerId;
          let boost = 0;

          const progress = racer.progress;

          if (progress > 60) {
            // In the final stretch, strongly push the winner ahead
            if (isWinner) {
              boost = 0.3 + (progress - 60) * 0.015;
            } else {
              // Others get slight drag that increases as winner nears finish
              boost = -0.05 - (progress - 60) * 0.008;
            }
          } else if (progress > 30) {
            // Mid race, gentle nudges
            if (isWinner) {
              boost = 0.1;
            }
          }

          const delta = (accel + boost) * (dt / 16);
          const newProgress = Math.min(racer.progress + Math.max(delta, 0.05), FINISH_LINE);

          if (newProgress >= FINISH_LINE && !racer.finished) {
            finishCountRef.current += 1;
            return {
              ...racer,
              progress: FINISH_LINE,
              finished: true,
              finishOrder: finishCountRef.current,
            };
          }

          return {
            ...racer,
            progress: newProgress,
            // Slightly vary speed over time for natural feel
            speed: racer.speed + (Math.random() - 0.5) * 0.02,
          };
        });
      });

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [phase]);

  const reset = useCallback(() => {
    setPhase('setup');
    setRacers([]);
    winnerIdRef.current = null;
    finishCountRef.current = 0;
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Racing Roulette</h1>
        <p className="app-subtitle">Add options and let them race!</p>
      </header>

      {phase === 'setup' && (
        <>
          <OptionInput
            options={options}
            onAdd={addOption}
            onRemove={removeOption}
          />
          <button
            className="start-btn"
            disabled={options.length < 2}
            onClick={startCountdown}
          >
            {options.length < 2
              ? `Add ${2 - options.length} more option${options.length === 0 ? 's' : ''}`
              : 'Start Race!'}
          </button>
        </>
      )}

      {phase === 'countdown' && (
        <Countdown onComplete={startRace} />
      )}

      {(phase === 'racing' || phase === 'countdown') && (
        <div className="race-container">
          <div className="race-header">
            <span className="race-status">
              {phase === 'countdown' ? 'Get Ready...' : 'Racing!'}
            </span>
          </div>
          <RaceTrack racers={racers} />
        </div>
      )}

      {phase === 'result' && (
        <>
          <div className="race-container">
            <RaceTrack racers={racers} />
          </div>
          <ResultScreen racers={racers} onReset={reset} />
        </>
      )}
    </div>
  );
}

export default App;
