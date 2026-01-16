import * as vscode from 'vscode';
import { Timer } from './timer';
import { TimerStatus } from './types';

export class StatusBarController {
  private statusBarItem: vscode.StatusBarItem;
  private timer: Timer;

  constructor(timer: Timer) {
    this.timer = timer;
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this.statusBarItem.command = 'coderTimer.start';
    this.statusBarItem.show();
    this.update(timer.getStatus());
  }

  public update(status: TimerStatus): void {
    const timeString = this.formatTime(status.remainingSeconds);
    const icon = this.getIcon(status);
    const stateIndicator = this.getStateIndicator(status);

    this.statusBarItem.text = `${icon} ${timeString}${stateIndicator}`;
    this.statusBarItem.tooltip = this.getTooltip(status);
    this.statusBarItem.command = status.state === 'running' ? 'coderTimer.pause' : 'coderTimer.start';
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  private getIcon(status: TimerStatus): string {
    if (status.mode === 'pomodoro') {
      switch (status.pomodoroPhase) {
        case 'work':
          return '$(clock)';
        case 'shortBreak':
        case 'longBreak':
          return '$(coffee)';
      }
    }
    return '$(watch)';
  }

  private getStateIndicator(status: TimerStatus): string {
    switch (status.state) {
      case 'running':
        return '';
      case 'paused':
        return ' $(debug-pause)';
      case 'idle':
        return ' $(debug-start)';
    }
  }

  private getTooltip(status: TimerStatus): string {
    const modeText = status.mode === 'pomodoro' ? 'Pomodoro' : 'Countdown';
    const phaseText = status.mode === 'pomodoro' ? ` - ${this.formatPhase(status.pomodoroPhase)}` : '';
    const stateText = status.state.charAt(0).toUpperCase() + status.state.slice(1);
    const sessionsText = status.mode === 'pomodoro' ? `\nCompleted sessions: ${status.completedSessions}` : '';

    return `Coder Timer (${modeText}${phaseText})\nStatus: ${stateText}${sessionsText}\nClick to ${status.state === 'running' ? 'pause' : 'start'}`;
  }

  private formatPhase(phase: string): string {
    switch (phase) {
      case 'work':
        return 'Work';
      case 'shortBreak':
        return 'Short Break';
      case 'longBreak':
        return 'Long Break';
      default:
        return phase;
    }
  }

  public dispose(): void {
    this.statusBarItem.dispose();
  }
}
