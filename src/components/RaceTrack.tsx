import type { RacerState } from '../types';

interface RaceTrackProps {
  racers: RacerState[];
}

export default function RaceTrack({ racers }: RaceTrackProps) {
  const sorted = [...racers].sort((a, b) => {
    if (a.finished && b.finished) return a.finishOrder - b.finishOrder;
    if (a.finished) return -1;
    if (b.finished) return 1;
    return b.progress - a.progress;
  });

  const getPosition = (racer: RacerState) => {
    const idx = sorted.findIndex(r => r.id === racer.id);
    return idx + 1;
  };

  return (
    <div className="race-track">
      {racers.map((racer) => {
        const pos = getPosition(racer);
        return (
          <div className="track-lane" key={racer.id}>
            <span className="racer-name" title={racer.name}>{racer.name}</span>
            <div className="lane-track">
              <div
                className="racer-car"
                style={{
                  left: `calc(${Math.min(racer.progress, 97)}% - 12px)`,
                  ['--car-color' as string]: racer.color,
                }}
              >
                <div
                  className="car-trail"
                  style={{ background: racer.color }}
                />
                <span className="car-body">
                  {racer.finished ? '\u{1F3C1}' : '\u{1F3CE}\uFE0F'}
                </span>
              </div>
            </div>
            <span className="position-badge" style={{ color: racer.color }}>
              P{pos}
            </span>
          </div>
        );
      })}
    </div>
  );
}
