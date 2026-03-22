import { defineConfig } from 'eslint/config'
import { createBaseConfigBlocks } from './base.js'

export const createNodeAppConfig = ({ tsconfigRootDir, overrides = [] } = {}) =>
	defineConfig([
		...createBaseConfigBlocks({
			env: 'node',
			tsconfigRootDir
		}),
		...overrides
	])

export default createNodeAppConfig
