import * as vscode from 'vscode';
import { Timer } from './timer';
import { StatusBarController } from './statusBar';
import { SidebarProvider } from './sidebarProvider';

let timer: Timer;
let statusBarController: StatusBarController;
let sidebarProvider: SidebarProvider;

export function activate(context: vscode.ExtensionContext) {
  timer = new Timer(context);
  statusBarController = new StatusBarController(timer);
  sidebarProvider = new SidebarProvider(context.extensionUri, timer);

  // Register sidebar view provider
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      SidebarProvider.viewType,
      sidebarProvider
    )
  );

  // Set up timer event handlers
  timer.on('onTick', (status) => {
    statusBarController.update(status);
    sidebarProvider.update(status);
  });

  timer.on('onStateChange', (status) => {
    statusBarController.update(status);
    sidebarProvider.update(status);
  });

  timer.on('onComplete', (status) => {
    const message = status.mode === 'pomodoro'
      ? getPomodororCompleteMessage(status.pomodoroPhase)
      : 'Countdown timer complete!';

    if (timer.getConfig().sound.enabled) {
      vscode.window.showInformationMessage(message, 'OK');
    }
  });

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('coderTimer.start', () => {
      timer.start();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('coderTimer.pause', () => {
      timer.pause();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('coderTimer.stop', () => {
      timer.stop();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('coderTimer.reset', () => {
      timer.reset();
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('coderTimer.setPomodoro', () => {
      timer.setMode('pomodoro');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('coderTimer.setCountdown', () => {
      timer.setMode('countdown');
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('coderTimer.showSidebar', () => {
      vscode.commands.executeCommand('workbench.view.extension.coder-timer');
    })
  );

  // Listen for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('coderTimer')) {
        timer.reloadConfig();
      }
    })
  );

  // Add disposables
  context.subscriptions.push({
    dispose: () => {
      timer.dispose();
      statusBarController.dispose();
    }
  });
}

function getPomodororCompleteMessage(phase: string): string {
  switch (phase) {
    case 'work':
      return 'Work session complete! Time for a break.';
    case 'shortBreak':
      return 'Short break over! Ready to focus?';
    case 'longBreak':
      return 'Long break over! Ready for another cycle?';
    default:
      return 'Timer complete!';
  }
}

export function deactivate() {
  if (timer) {
    timer.dispose();
  }
  if (statusBarController) {
    statusBarController.dispose();
  }
}
