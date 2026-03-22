import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import process from 'node:process'

if (!existsSync('.git')) {
	process.exit(0)
}

try {
	execFileSync('git', ['config', 'core.hooksPath', '.husky'], { stdio: 'ignore' })
} catch {
	process.exit(0)
}
