import { execFileSync, spawn } from 'node:child_process'
import process from 'node:process'

const [script] = process.argv.slice(2)

if (typeof script !== 'string' || script.length === 0) {
	throw new Error('Expected a workspace script name')
}

const workspacesByScript = {
	build: ['@nalog-vibe/tax-domain', '@nalog-vibe/api', '@nalog-vibe/web'],
	dev: ['@nalog-vibe/api', '@nalog-vibe/web'],
	lint: ['@nalog-vibe/tax-domain', '@nalog-vibe/api', '@nalog-vibe/web'],
	test: ['@nalog-vibe/tax-domain', '@nalog-vibe/api', '@nalog-vibe/web'],
	typecheck: ['@nalog-vibe/tax-domain', '@nalog-vibe/api', '@nalog-vibe/web']
}
const workspaces = workspacesByScript[script]

if (!Array.isArray(workspaces)) {
	throw new Error(`Unsupported workspace script: ${script}`)
}

const buildCommand = (workspace, workspaceScript) =>
	process.platform === 'win32'
		? {
				command: 'cmd.exe',
				args: ['/d', '/s', '/c', `yarn.cmd workspace ${workspace} ${workspaceScript}`]
			}
		: {
				command: 'yarn',
				args: ['workspace', workspace, workspaceScript]
			}

if (script === 'dev') {
	const children = workspaces.map((workspace) => {
		const { command, args } = buildCommand(workspace, script)

		return spawn(command, args, { stdio: 'inherit' })
	})

	for (const child of children) {
		child.on('exit', (code) => {
			if (typeof code === 'number' && code !== 0) {
				process.exitCode = code
			}
		})
		child.on('error', (error) => {
			throw error
		})
		child.on('close', () => {
			children.forEach((candidate) => {
				if (candidate.pid !== child.pid && !candidate.killed) {
					candidate.kill()
				}
			})
		})
	}
} else {
	for (const workspace of workspaces) {
		const { command, args } = buildCommand(workspace, script)

		execFileSync(command, args, { stdio: 'inherit' })
	}
}