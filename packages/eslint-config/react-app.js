/* eslint import/order: off */
import { createRequire } from 'node:module'
import { defineConfig } from 'eslint/config'
import boundaries from 'eslint-plugin-boundaries'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { createBaseConfigBlocks } from './base.js'

const require = createRequire(import.meta.url)
const { layersLib } = require('@feature-sliced/eslint-config/utils')

const getFsdElements = () => [
	{ type: 'entities_x', pattern: 'src/entities/*/@x/*', mode: 'file' },
	...layersLib.FS_LAYERS.map((layer) => ({
		type: layer,
		pattern: `src/${layer}/!(_*){,/*}`,
		mode: 'folder',
		capture: ['slices']
	})),
	...layersLib.FS_LAYERS.map((layer) => ({
		type: `gm_${layer}`,
		pattern: `src/${layer}/_*`,
		mode: 'folder',
		capture: ['slices']
	}))
]

const getFsdBoundaryRules = () => [
	...layersLib.getUpperLayers('shared').map((layer) => ({
		from: layer,
		allow: layersLib.getLowerLayers(layer)
	})),
	{ from: 'entities', allow: 'entities_x' },
	{ from: 'entities_x', allow: 'entities' },
	{ from: 'shared', allow: 'shared' },
	{ from: 'app', allow: 'app' },
	...layersLib.FS_LAYERS.map((layer) => ({
		from: `gm_${layer}`,
		allow: [layer, ...layersLib.getLowerLayers(layer)]
	}))
]

export const createReactAppConfig = ({ typescriptProject = './tsconfig.app.json', tsconfigRootDir } = {}) =>
	defineConfig([
		...createBaseConfigBlocks({
			env: 'browser',
			ignores: ['postcss.config.cjs', 'vite.config.ts'],
			tsconfigRootDir
		}),
		{
			files: ['**/*.{ts,tsx,jsx}'],
			extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
			plugins: {
				react
			},
			settings: {
				react: {
					version: 'detect'
				}
			},
			rules: {
				'react/display-name': 'warn',
				'react/jsx-curly-brace-presence': ['error', { props: 'always' }],
				'react/no-children-prop': 'warn',
				'react/react-in-jsx-scope': 'off',
				'react-hooks/incompatible-library': 'off'
			}
		},
		{
			files: ['**/*.{ts,tsx,jsx,js}'],
			settings: {
				'import/resolver': {
					typescript: { project: typescriptProject }
				},
				'import/internal-regex': '^@(app|entities|features|pages|shared|widgets)/'
			}
		},
		{
			files: ['src/**/*.{ts,tsx}'],
			plugins: {
				boundaries
			},
			settings: {
				'boundaries/elements': getFsdElements(),
				'import/resolver': {
					typescript: {
						project: typescriptProject
					}
				}
			},
			rules: {
				'boundaries/element-types': [
					'error',
					{
						default: 'disallow',
						message: '"${file.type}" is not allowed to import "${dependency.type}" | See: https://feature-sliced.design/docs/reference/layers',
						rules: getFsdBoundaryRules()
					}
				]
			}
		}
	])

export default createReactAppConfig
