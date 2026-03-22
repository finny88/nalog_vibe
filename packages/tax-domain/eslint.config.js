import { createNodeAppConfig } from '../eslint-config/node-app.js'

export default createNodeAppConfig({
	tsconfigRootDir: import.meta.dirname,
	overrides: [
		{
			files: ['src/questionCatalog.ts'],
			rules: {
				'max-lines': 'off'
			}
		}
	]
})
