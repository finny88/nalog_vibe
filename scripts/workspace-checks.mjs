import { execFileSync } from 'node:child_process'
import process from 'node:process'

const [mode, ...args] = process.argv.slice(2)

if (mode !== 'lint' && mode !== 'typecheck') {
	throw new Error('Expected mode to be "lint" or "typecheck"')
}

const stagedOnly = args.includes('--staged')
const explicitFiles = args.filter((arg) => !arg.startsWith('--'))

const normalizePath = (value) => value.replaceAll('\\', '/')
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

const readStagedFiles = () => {
	try {
		const output = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'], { encoding: 'utf8' })

		return output
			.split(/\r?\n/u)
			.map((value) => value.trim())
			.filter(Boolean)
	} catch {
		return []
	}
}

const files = (explicitFiles.length > 0 ? explicitFiles : stagedOnly ? readStagedFiles() : []).map(normalizePath)
const sharedTargets = ['@nalog-vibe/tax-domain', '@nalog-vibe/api', '@nalog-vibe/web']
const targetMap = [
	{ prefix: 'apps/web/', targets: ['@nalog-vibe/web'] },
	{ prefix: 'apps/api/', targets: ['@nalog-vibe/api'] },
	{ prefix: 'packages/tax-domain/', targets: sharedTargets },
	{ prefix: 'packages/tsconfig/', targets: sharedTargets },
	{ prefix: 'packages/eslint-config/', targets: sharedTargets },
	{ prefix: 'scripts/', targets: ['@nalog-vibe/api', '@nalog-vibe/web'] }
]
const rootConfigPrefixes = ['.env.example', '.prettierrc.json', '.yarnrc.yml', 'docker-compose.yml', 'lerna.json', 'nx.json', 'package.json', 'tsconfig.base.json']

const collectTargets = () => {
	if (files.length === 0) {
		return sharedTargets
	}

	const targets = new Set()

	for (const file of files) {
		if (rootConfigPrefixes.includes(file)) {
			sharedTargets.forEach((target) => targets.add(target))
			continue
		}

		for (const entry of targetMap) {
			if (file.startsWith(entry.prefix)) {
				entry.targets.forEach((target) => targets.add(target))
			}
		}
	}

	return Array.from(targets)
}

const targets = collectTargets()

if (targets.length === 0) {
	process.stdout.write(`No workspace targets resolved for ${mode} checks.\n`)
	process.exit(0)
}

for (const workspace of targets) {
	const { command, args: commandArgs } = buildCommand(workspace, mode)

	execFileSync(command, commandArgs, { stdio: 'inherit' })
}