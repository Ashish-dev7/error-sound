import * as vscode from 'vscode';
import * as path from 'path';
import { spawn } from 'child_process';

type Player = [string, string[]];

let lastPlayed = 0;

function config() {
	return vscode.workspace.getConfiguration('errorSound');
}

function tryPlayers(players: Player[]) {
	const next = players.shift();
	if (!next) {
		vscode.window.showWarningMessage(
			'No audio player found. Install mpg123, ffmpeg (ffplay) or mpv.'
		);
		return;
	}
	const [cmd, args] = next;
	const child = spawn(cmd, args, { stdio: 'ignore' });
	child.on('error', () => tryPlayers(players));
}

function playSound(context: vscode.ExtensionContext, force = false) {
	if (!force && !config().get<boolean>('enabled', true)) {
		return;
	}
	const now = Date.now();
	if (!force && now - lastPlayed < config().get<number>('cooldownMs', 1000)) {
		return;
	}
	lastPlayed = now;

	const file = path.join(context.extensionPath, 'media', 'error.mp3');

	if (process.platform === 'darwin') {
		tryPlayers([['afplay', [file]]]);
	} else if (process.platform === 'win32') {
		tryPlayers([
			[
				'powershell',
				[
					'-NoProfile',
					'-Command',
					`Add-Type -AssemblyName presentationCore; $p = New-Object System.Windows.Media.MediaPlayer; $p.Open([uri]'${file}'); $p.Play(); Start-Sleep -Seconds 5`,
				],
			],
		]);
	} else {
		tryPlayers([
			['mpg123', ['-q', file]],
			['ffplay', ['-nodisp', '-autoexit', '-loglevel', 'quiet', file]],
			['mpv', ['--no-video', '--really-quiet', file]],
			['cvlc', ['--play-and-exit', '--quiet', file]],
		]);
	}
}

export function activate(context: vscode.ExtensionContext) {
	// Manual test command
	context.subscriptions.push(
		vscode.commands.registerCommand('error-sound.test', () => playSound(context, true))
	);

	// Plays once each time a terminal command finishes with an error
	context.subscriptions.push(
		vscode.window.onDidEndTerminalShellExecution((e) => {
			const code = e.exitCode;
			// 0 = success, undefined = unknown, 130 = Ctrl+C
			if (code === undefined || code === 0 || code === 130) {
				return;
			}
			playSound(context);
		})
	);
}

export function deactivate() {}