import * as vscode from 'vscode';
import { Timer } from './timer';
import { TimerStatus } from './types';

export class SidebarProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'coderTimer.sidebar';
  private webviewView?: vscode.WebviewView;
  private timer: Timer;
  private extensionUri: vscode.Uri;

  constructor(extensionUri: vscode.Uri, timer: Timer) {
    this.extensionUri = extensionUri;
    this.timer = timer;
  }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this.webviewView = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    webviewView.webview.html = this.getHtmlContent(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'start':
          vscode.commands.executeCommand('coderTimer.start');
          break;
        case 'pause':
          vscode.commands.executeCommand('coderTimer.pause');
          break;
        case 'stop':
          vscode.commands.executeCommand('coderTimer.stop');
          break;
        case 'reset':
          vscode.commands.executeCommand('coderTimer.reset');
          break;
        case 'setMode':
          if (message.mode === 'pomodoro') {
            vscode.commands.executeCommand('coderTimer.setPomodoro');
          } else {
            vscode.commands.executeCommand('coderTimer.setCountdown');
          }
          break;
        case 'setDuration':
          this.timer.setCountdownDuration(message.minutes);
          break;
        case 'skipPhase':
          this.timer.skipPhase();
          break;
      }
    });

    this.update(this.timer.getStatus());
  }

  public update(status: TimerStatus): void {
    if (this.webviewView) {
      this.webviewView.webview.postMessage({
        type: 'update',
        status: status,
      });
    }
  }

  private getHtmlContent(webview: vscode.Webview): string {
    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this.extensionUri, 'media', 'sidebar.css')
    );

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'unsafe-inline';">
  <title>Coder Timer</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: var(--vscode-font-family);
      color: var(--vscode-foreground);
      padding: 16px;
    }
    .timer-display {
      text-align: center;
      margin-bottom: 20px;
    }
    .time {
      font-size: 48px;
      font-weight: bold;
      font-family: monospace;
      color: var(--vscode-textLink-foreground);
    }
    .phase {
      font-size: 14px;
      color: var(--vscode-descriptionForeground);
      margin-top: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .mode-selector {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }
    .mode-btn {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid var(--vscode-button-border, var(--vscode-contrastBorder, transparent));
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
      cursor: pointer;
      font-size: 12px;
      border-radius: 4px;
    }
    .mode-btn.active {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
    }
    .mode-btn:hover {
      opacity: 0.9;
    }
    .controls {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }
    .control-btn {
      flex: 1;
      padding: 10px;
      border: none;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      cursor: pointer;
      font-size: 14px;
      border-radius: 4px;
    }
    .control-btn:hover {
      background: var(--vscode-button-hoverBackground);
    }
    .control-btn.secondary {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }
    .control-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .duration-input {
      margin-bottom: 20px;
    }
    .duration-input label {
      display: block;
      font-size: 12px;
      color: var(--vscode-descriptionForeground);
      margin-bottom: 6px;
    }
    .duration-input input {
      width: 100%;
      padding: 8px;
      border: 1px solid var(--vscode-input-border, var(--vscode-contrastBorder, #333));
      background: var(--vscode-input-background);
      color: var(--vscode-input-foreground);
      border-radius: 4px;
      font-size: 14px;
    }
    .stats {
      padding: 12px;
      background: var(--vscode-editor-inactiveSelectionBackground);
      border-radius: 4px;
      font-size: 12px;
    }
    .stats-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .stats-row:last-child {
      margin-bottom: 0;
    }
    .stats-label {
      color: var(--vscode-descriptionForeground);
    }
    .stats-value {
      font-weight: bold;
    }
    .progress-bar {
      width: 100%;
      height: 4px;
      background: var(--vscode-progressBar-background);
      border-radius: 2px;
      margin-top: 12px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: var(--vscode-textLink-foreground);
      transition: width 0.3s ease;
    }
    .hidden {
      display: none;
    }
  </style>
</head>
<body>
  <div class="mode-selector">
    <button class="mode-btn active" id="pomodoroMode">Pomodoro</button>
    <button class="mode-btn" id="countdownMode">Countdown</button>
  </div>

  <div class="timer-display">
    <div class="time" id="timeDisplay">25:00</div>
    <div class="phase" id="phaseDisplay">Work Session</div>
    <div class="progress-bar">
      <div class="progress-fill" id="progressBar" style="width: 100%"></div>
    </div>
  </div>

  <div class="duration-input hidden" id="durationSection">
    <label for="durationInput">Duration (minutes)</label>
    <input type="number" id="durationInput" min="1" max="180" value="10">
  </div>

  <div class="controls">
    <button class="control-btn" id="startBtn">Start</button>
    <button class="control-btn secondary" id="resetBtn">Reset</button>
  </div>

  <div class="controls" id="pomodoroControls">
    <button class="control-btn secondary" id="skipBtn">Skip Phase</button>
  </div>

  <div class="stats">
    <div class="stats-row">
      <span class="stats-label">Completed Sessions</span>
      <span class="stats-value" id="sessionsCount">0</span>
    </div>
    <div class="stats-row" id="sessionRow">
      <span class="stats-label">Current Session</span>
      <span class="stats-value" id="currentSession">1 / 4</span>
    </div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();

    const elements = {
      timeDisplay: document.getElementById('timeDisplay'),
      phaseDisplay: document.getElementById('phaseDisplay'),
      progressBar: document.getElementById('progressBar'),
      pomodoroMode: document.getElementById('pomodoroMode'),
      countdownMode: document.getElementById('countdownMode'),
      startBtn: document.getElementById('startBtn'),
      resetBtn: document.getElementById('resetBtn'),
      skipBtn: document.getElementById('skipBtn'),
      durationSection: document.getElementById('durationSection'),
      durationInput: document.getElementById('durationInput'),
      sessionsCount: document.getElementById('sessionsCount'),
      currentSession: document.getElementById('currentSession'),
      pomodoroControls: document.getElementById('pomodoroControls'),
      sessionRow: document.getElementById('sessionRow'),
    };

    let currentStatus = null;

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
    }

    function formatPhase(phase) {
      switch (phase) {
        case 'work': return 'Work Session';
        case 'shortBreak': return 'Short Break';
        case 'longBreak': return 'Long Break';
        default: return 'Countdown';
      }
    }

    function updateUI(status) {
      currentStatus = status;

      elements.timeDisplay.textContent = formatTime(status.remainingSeconds);
      elements.phaseDisplay.textContent = status.mode === 'pomodoro'
        ? formatPhase(status.pomodoroPhase)
        : 'Countdown Timer';

      const progress = status.totalSeconds > 0
        ? (status.remainingSeconds / status.totalSeconds) * 100
        : 100;
      elements.progressBar.style.width = progress + '%';

      elements.pomodoroMode.classList.toggle('active', status.mode === 'pomodoro');
      elements.countdownMode.classList.toggle('active', status.mode === 'countdown');

      elements.durationSection.classList.toggle('hidden', status.mode === 'pomodoro');
      elements.pomodoroControls.classList.toggle('hidden', status.mode !== 'pomodoro');
      elements.sessionRow.classList.toggle('hidden', status.mode !== 'pomodoro');

      if (status.state === 'running') {
        elements.startBtn.textContent = 'Pause';
      } else if (status.state === 'paused') {
        elements.startBtn.textContent = 'Resume';
      } else {
        elements.startBtn.textContent = 'Start';
      }

      elements.sessionsCount.textContent = status.completedSessions;
      elements.currentSession.textContent = status.currentSession + ' / 4';
    }

    elements.pomodoroMode.addEventListener('click', () => {
      vscode.postMessage({ command: 'setMode', mode: 'pomodoro' });
    });

    elements.countdownMode.addEventListener('click', () => {
      vscode.postMessage({ command: 'setMode', mode: 'countdown' });
    });

    elements.startBtn.addEventListener('click', () => {
      if (currentStatus?.state === 'running') {
        vscode.postMessage({ command: 'pause' });
      } else {
        vscode.postMessage({ command: 'start' });
      }
    });

    elements.resetBtn.addEventListener('click', () => {
      vscode.postMessage({ command: 'stop' });
    });

    elements.skipBtn.addEventListener('click', () => {
      vscode.postMessage({ command: 'skipPhase' });
    });

    elements.durationInput.addEventListener('change', (e) => {
      const minutes = parseInt(e.target.value, 10);
      if (minutes > 0 && minutes <= 180) {
        vscode.postMessage({ command: 'setDuration', minutes: minutes });
      }
    });

    window.addEventListener('message', (event) => {
      const message = event.data;
      if (message.type === 'update') {
        updateUI(message.status);
      }
    });
  </script>
</body>
</html>`;
  }
}
