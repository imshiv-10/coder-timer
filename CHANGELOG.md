# Changelog

All notable changes to the "Coder Timer" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-15

### Added

- **Pomodoro Timer Mode**
  - 25-minute work sessions (configurable)
  - 5-minute short breaks after each session
  - 15-minute long breaks after 4 sessions
  - Automatic phase transitions
  - Skip phase functionality

- **Countdown Timer Mode**
  - Custom duration from 1 to 180 minutes
  - Simple start/pause/reset controls

- **Status Bar Integration**
  - Real-time timer display in status bar
  - Click to start/pause functionality
  - Visual indicators for timer state
  - Different icons for work and break phases

- **Sidebar Panel**
  - Beautiful webview-based UI
  - Mode toggle buttons
  - Large timer display with progress bar
  - Session statistics tracking
  - Full timer controls

- **Customisation Options**
  - Configurable work duration
  - Configurable short break duration
  - Configurable long break duration
  - Adjustable sessions before long break
  - Default countdown duration setting
  - Notification toggle

- **Session Persistence**
  - Completed sessions saved across VS Code restarts
  - Mode preference remembered

- **7 Commands Available**
  - Start/Resume Timer
  - Pause Timer
  - Stop Timer
  - Reset Timer
  - Switch to Pomodoro Mode
  - Switch to Countdown Mode
  - Show Timer Panel

### Technical Details

- Built with TypeScript for type safety
- Follows VS Code extension best practices
- Minimal dependencies for fast loading
- Clean, maintainable code structure

---

## Future Plans

### [1.1.0] - Planned

- Custom notification sounds
- Sound volume control
- Keyboard shortcuts out of the box

### [1.2.0] - Planned

- Daily statistics view
- Weekly productivity reports
- Export data feature

### [2.0.0] - Planned

- Team synchronisation
- Shared Pomodoro sessions
- Leaderboard (optional)

---

## Feedback

If you have suggestions or found bugs, please raise an issue on our GitHub repository. Your feedback helps us make Coder Timer better for everyone!
