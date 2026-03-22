import { defineConfig } from 'eslint/config'

import { createBaseConfigBlocks } from './base.js'

export const createNodeAppConfig = () =>
	defineConfig([
		...createBaseConfigBlocks({
			env: 'node'
		})
	])

export default createNodeAppConfig