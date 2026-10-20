# Mistri Man Jao Error

Plays a sound whenever an error hits in VS Code, so you notice it even when you are not looking at the screen.

## Features

The sound plays when:

- **A new error appears in your code.** A new or different red-squiggle error triggers the sound. This works for any language that reports errors (TypeScript, JavaScript, JSON, Python with a language server, and so on).
- **You save a file that still has errors.**
- **A terminal command fails.** Any command that exits with a non-zero code triggers the sound.

A short cooldown stops the sound from overlapping when many errors appear at once.

## Requirements

The extension plays `error.mp3` using an audio player already on your system.

- **Linux:** install at least one of `mpg123`, `ffmpeg` (for `ffplay`), `mpv` or `vlc`. On Debian, Ubuntu and Parrot:

```bash
  sudo apt install mpg123
```

- **macOS:** works out of the box (uses `afplay`).
- **Windows:** works out of the box (uses PowerShell).

Terminal error detection needs VS Code's shell integration, which is on by default for bash, zsh, fish and PowerShell.

## Commands

Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and run:

- **Mistri Man Jao Error: Play Test Sound** to check that your audio setup works.

## Extension Settings

This extension contributes the following settings:

| Setting | Default | Description |
| --- | --- | --- |
| `errorSound.enabled` | `true` | Turn the error sound on or off. |
| `errorSound.onDiagnostics` | `true` | Play when a new error appears in the code, or when you save a file with errors. |
| `errorSound.onTerminal` | `true` | Play when a terminal command fails. |
| `errorSound.cooldownMs` | `1500` | Minimum time between sounds, in milliseconds. |

## Known Issues

- On Linux, no sound plays if none of `mpg123`, `ffplay`, `mpv` or `cvlc` is installed. A warning message tells you when this happens.
- Opening a file that already contains errors can play the sound once, because those errors are new to the extension.
- Pressing `Ctrl+C` in the terminal exits with a non-zero code, so it may trigger the sound.
- The sound only plays for errors reported by VS Code. A file with no language support or linter will not report any.

## Release Notes

### 0.0.1

Initial release.