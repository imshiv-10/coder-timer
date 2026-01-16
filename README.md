# Coder Timer - Pomodoro & Countdown Timer for VS Code

> Stay focused and boost your productivity with a simple yet powerful timer right inside your favourite code editor.

![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/shiva-dev.coder-timer)
![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/shiva-dev.coder-timer)
![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/shiva-dev.coder-timer)

## Why Coder Timer?

We all know the struggle - you sit down to code, and before you realise, hours have passed without a single break. Your eyes are tired, your back is aching, and somehow you're still stuck on that same bug!

**Coder Timer** helps you work smarter, not harder. It brings the famous Pomodoro Technique directly into VS Code, so you don't have to switch between apps or keep checking your phone for timers.

### What You Get

- **Pomodoro Mode** - Work in focused 25-minute sessions with short breaks in between. After 4 sessions, take a longer break. Simple and effective!
- **Countdown Mode** - Need a quick 10-minute timer? Or maybe 45 minutes for that feature you're building? Set any duration you want.
- **Status Bar Timer** - Always visible at the bottom of your editor. One click to start, one click to pause.
- **Beautiful Sidebar Panel** - Full controls with progress bar, session tracking, and more.
- **Fully Customisable** - Change work duration, break times, and everything else from settings.

## Installation

1. Open VS Code
2. Go to Extensions (`Ctrl+Shift+X` or `Cmd+Shift+X` on Mac)
3. Search for "Coder Timer"
4. Click Install
5. Done! You'll see the timer icon in your activity bar

## How to Use

### Getting Started

Once installed, you'll notice two things:
- A **timer icon** in the left activity bar
- A **timer display** in the status bar (bottom right)

Click on either to get started!

### Using Pomodoro Mode

Pomodoro is the default mode and honestly, it's brilliant for coding:

1. Click **Start** to begin a 25-minute work session
2. Code with full focus until the timer ends
3. Take a 5-minute short break (stretch, grab chai, rest your eyes)
4. Repeat! After 4 work sessions, you get a 15-minute long break

The sidebar shows your current session number and total completed sessions for the day.

### Using Countdown Mode

Sometimes you just need a simple timer:

1. Click **Countdown** button in the sidebar
2. Enter your desired duration (1 to 180 minutes)
3. Click **Start**
4. Timer will notify you when done

Perfect for meetings, quick tasks, or when you want to timeblock specific work.

### Available Commands

Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and type "Coder Timer":

| Command | What It Does |
|---------|--------------|
| `Coder Timer: Start/Resume Timer` | Starts the timer or resumes if paused |
| `Coder Timer: Pause Timer` | Pauses the running timer |
| `Coder Timer: Stop Timer` | Stops and resets the timer |
| `Coder Timer: Reset Timer` | Resets current session to beginning |
| `Coder Timer: Switch to Pomodoro Mode` | Changes to Pomodoro mode |
| `Coder Timer: Switch to Countdown Mode` | Changes to Countdown mode |
| `Coder Timer: Show Timer Panel` | Opens the sidebar panel |

### Keyboard Shortcut Tip

You can assign keyboard shortcuts to any command. Go to `File > Preferences > Keyboard Shortcuts` and search for "coderTimer".

## Settings

Customise everything from `File > Preferences > Settings` and search for "Coder Timer":

| Setting | Default | Description |
|---------|---------|-------------|
| `coderTimer.pomodoro.workDuration` | 25 | Work session length in minutes |
| `coderTimer.pomodoro.shortBreak` | 5 | Short break length in minutes |
| `coderTimer.pomodoro.longBreak` | 15 | Long break length in minutes |
| `coderTimer.pomodoro.sessionsBeforeLongBreak` | 4 | Work sessions before long break |
| `coderTimer.countdown.defaultDuration` | 10 | Default countdown duration in minutes |
| `coderTimer.sound.enabled` | true | Show notification when timer completes |
| `coderTimer.sound.volume` | 0.5 | Notification volume (for future use) |

### Example Configuration

Add to your `settings.json` for a custom setup:

```json
{
  "coderTimer.pomodoro.workDuration": 30,
  "coderTimer.pomodoro.shortBreak": 7,
  "coderTimer.pomodoro.longBreak": 20,
  "coderTimer.pomodoro.sessionsBeforeLongBreak": 3
}
```

## Features in Detail

### Status Bar Integration

The status bar shows:
- Current time remaining (MM:SS format)
- Icon indicating mode (clock for work, coffee cup for break)
- Play/pause indicator

**Click behaviour:**
- When stopped → Click to Start
- When running → Click to Pause
- When paused → Click to Resume

### Sidebar Panel

The sidebar gives you complete control:
- Large timer display with progress bar
- Mode toggle buttons (Pomodoro/Countdown)
- Start, Pause, Reset controls
- Skip Phase button (Pomodoro only)
- Session statistics

### Session Persistence

Your completed session count is saved automatically. Even if you close VS Code, your progress for the day is remembered. Great for tracking your productivity!

## Tips for Best Results

1. **Start with default settings** - The 25/5/15 minute structure is scientifically proven to work. Try it for a week before customising.

2. **Actually take breaks** - When the break timer starts, step away from the screen. Stretch, walk around, hydrate yourself.

3. **Use Skip Phase wisely** - If you're in the zone and don't want to break focus, you can skip the break. But don't make it a habit!

4. **Track your sessions** - Note how many Pomodoros different tasks take. It helps with future estimation.

## Known Issues

- Sound notification is currently system notification only. Custom sounds coming in future update.
- Session count resets if you clear VS Code global storage.

## Roadmap

We're actively working on:
- [ ] Custom notification sounds
- [ ] Daily/weekly statistics view
- [ ] Export productivity reports
- [ ] Team sync feature
- [ ] More themes for sidebar

## Contributing

Found a bug? Have a feature request? I'd love to hear from you!

- **Issues**: [GitHub Issues](https://github.com/imshiv-10/coder-timer/issues)
- **Pull Requests**: Always welcome!
- **Email**: [imshiv@umich.edu](mailto:imshiv@umich.edu)

## Support

If this extension helps you code better, please consider:
- Giving it a **5-star rating** on the marketplace
- **Sharing** with your developer friends
- **Following** for updates

## About the Author

Hi, I'm **Shiva (Sivaprasad Nidamanuri)** - a developer who believes in building tools that actually help people work better. This extension was born out of my own need to manage coding sessions without leaving VS Code.

- **GitHub**: [imshiv-10](https://github.com/imshiv-10)
- **LinkedIn**: [Sivaprasad Nidamanuri](https://www.linkedin.com/in/sivaprasadnidamanuri/)
- **Email**: [imshiv@umich.edu](mailto:imshiv@umich.edu)

Feel free to connect! Always happy to chat about productivity, coding, or anything tech.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## License

MIT License - feel free to use, modify, and distribute.

---

**Happy Coding!** Remember, productivity is not about working more hours, it's about working smarter. Take those breaks, stay hydrated, and keep shipping great code!

Made with love by [Shiva](https://github.com/imshiv-10) for the developer community.
