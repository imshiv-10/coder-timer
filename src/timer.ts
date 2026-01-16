import * as vscode from 'vscode';
import { TimerMode, TimerState, PomodoroPhase, TimerConfig, TimerStatus, TimerEvents } from './types';

export class Timer {
  private mode: TimerMode = 'pomodoro';
  private state: TimerState = 'idle';
  private remainingSeconds: number = 0;
  private totalSeconds: number = 0;
  private pomodoroPhase: PomodoroPhase = 'work';
  private completedSessions: number = 0;
  private currentSession: number = 1;
  private intervalId: NodeJS.Timeout | null = null;
  private config: TimerConfig;
  private events: Partial<TimerEvents> = {};
  private context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.config = this.loadConfig();
    this.loadState();
  }

  private loadConfig(): TimerConfig {
    const config = vscode.workspace.getConfiguration('coderTimer');
    return {
      pomodoro: {
        workDuration: config.get('pomodoro.workDuration', 25),
        shortBreak: config.get('pomodoro.shortBreak', 5),
        longBreak: config.get('pomodoro.longBreak', 15),
        sessionsBeforeLongBreak: config.get('pomodoro.sessionsBeforeLongBreak', 4),
      },
      countdown: {
        defaultDuration: config.get('countdown.defaultDuration', 10),
      },
      sound: {
        enabled: config.get('sound.enabled', true),
        volume: config.get('sound.volume', 0.5),
      },
    };
  }

  private loadState(): void {
    const savedState = this.context.globalState.get<{
      mode: TimerMode;
      completedSessions: number;
    }>('timerState');

    if (savedState) {
      this.mode = savedState.mode;
      this.completedSessions = savedState.completedSessions;
    }
    this.resetTimer();
  }

  private saveState(): void {
    this.context.globalState.update('timerState', {
      mode: this.mode,
      completedSessions: this.completedSessions,
    });
  }

  public reloadConfig(): void {
    this.config = this.loadConfig();
  }

  public getConfig(): TimerConfig {
    return this.config;
  }

  public on<K extends keyof TimerEvents>(event: K, callback: TimerEvents[K]): void {
    this.events[event] = callback;
  }

  public getStatus(): TimerStatus {
    return {
      mode: this.mode,
      state: this.state,
      remainingSeconds: this.remainingSeconds,
      totalSeconds: this.totalSeconds,
      pomodoroPhase: this.pomodoroPhase,
      completedSessions: this.completedSessions,
      currentSession: this.currentSession,
    };
  }

  public setMode(mode: TimerMode): void {
    if (this.state === 'running') {
      this.stop();
    }
    this.mode = mode;
    this.resetTimer();
    this.saveState();
    this.emitStateChange();
  }

  public setCountdownDuration(minutes: number): void {
    if (this.mode !== 'countdown') return;
    this.totalSeconds = minutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.emitStateChange();
  }

  private resetTimer(): void {
    if (this.mode === 'pomodoro') {
      this.totalSeconds = this.getPomodoroPhaseSeconds();
      this.remainingSeconds = this.totalSeconds;
    } else {
      this.totalSeconds = this.config.countdown.defaultDuration * 60;
      this.remainingSeconds = this.totalSeconds;
    }
  }

  private getPomodoroPhaseSeconds(): number {
    switch (this.pomodoroPhase) {
      case 'work':
        return this.config.pomodoro.workDuration * 60;
      case 'shortBreak':
        return this.config.pomodoro.shortBreak * 60;
      case 'longBreak':
        return this.config.pomodoro.longBreak * 60;
    }
  }

  public start(): void {
    if (this.state === 'running') return;

    if (this.state === 'idle') {
      this.resetTimer();
    }

    this.state = 'running';
    this.intervalId = setInterval(() => this.tick(), 1000);
    this.emitStateChange();
  }

  public pause(): void {
    if (this.state !== 'running') return;

    this.state = 'paused';
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.emitStateChange();
  }

  public resume(): void {
    if (this.state !== 'paused') return;
    this.start();
  }

  public stop(): void {
    this.state = 'idle';
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.resetTimer();
    this.emitStateChange();
  }

  public reset(): void {
    const wasRunning = this.state === 'running';
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.resetTimer();
    this.state = 'idle';
    if (wasRunning) {
      this.start();
    } else {
      this.emitStateChange();
    }
  }

  public skipPhase(): void {
    if (this.mode !== 'pomodoro') return;
    this.advancePomodoro();
  }

  private tick(): void {
    if (this.remainingSeconds > 0) {
      this.remainingSeconds--;
      this.events.onTick?.(this.getStatus());
    } else {
      this.complete();
    }
  }

  private complete(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.state = 'idle';

    if (this.mode === 'pomodoro') {
      if (this.pomodoroPhase === 'work') {
        this.completedSessions++;
        this.saveState();
      }
      this.events.onComplete?.(this.getStatus());
      this.advancePomodoro();
    } else {
      this.events.onComplete?.(this.getStatus());
      this.emitStateChange();
    }
  }

  private advancePomodoro(): void {
    if (this.pomodoroPhase === 'work') {
      if (this.currentSession >= this.config.pomodoro.sessionsBeforeLongBreak) {
        this.pomodoroPhase = 'longBreak';
        this.currentSession = 1;
      } else {
        this.pomodoroPhase = 'shortBreak';
      }
    } else {
      this.pomodoroPhase = 'work';
      if (this.pomodoroPhase === 'work' && this.state === 'idle') {
        this.currentSession++;
      }
    }
    this.resetTimer();
    this.emitStateChange();
  }

  private emitStateChange(): void {
    this.events.onStateChange?.(this.getStatus());
  }

  public dispose(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
