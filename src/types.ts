export type TimerMode = 'pomodoro' | 'countdown';
export type TimerState = 'idle' | 'running' | 'paused';
export type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';

export interface TimerConfig {
  pomodoro: {
    workDuration: number;
    shortBreak: number;
    longBreak: number;
    sessionsBeforeLongBreak: number;
  };
  countdown: {
    defaultDuration: number;
  };
  sound: {
    enabled: boolean;
    volume: number;
  };
}

export interface TimerStatus {
  mode: TimerMode;
  state: TimerState;
  remainingSeconds: number;
  totalSeconds: number;
  pomodoroPhase: PomodoroPhase;
  completedSessions: number;
  currentSession: number;
}

export interface TimerEvents {
  onTick: (status: TimerStatus) => void;
  onComplete: (status: TimerStatus) => void;
  onStateChange: (status: TimerStatus) => void;
}
