export interface RacerOption {
  id: string;
  name: string;
  color: string;
}

export interface RacerState {
  id: string;
  name: string;
  color: string;
  progress: number;   // 0-100
  speed: number;
  finished: boolean;
  finishOrder: number;
}

export type AppPhase = 'setup' | 'countdown' | 'racing' | 'result';

export const RACER_COLORS = [
  '#e10600', // Ferrari Red
  '#0090ff', // Alpine Blue
  '#ff8700', // McLaren Orange
  '#00d2be', // Mercedes Teal
  '#2b4562', // Red Bull Navy
  '#006f62', // Aston Martin Green
  '#b6babd', // Haas Silver
  '#900000', // Alfa Romeo Maroon
  '#005aff', // Williams Blue
  '#ffffff', // White
  '#52e252', // Lime Green
  '#ff69b4', // Pink
];
