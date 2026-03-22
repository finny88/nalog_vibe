import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const sharedRules = {
	'@stylistic/spaced-comment': ['error', 'always', { exceptions: ['-+'] }],
	'@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
	'@typescript-eslint/consistent-type-imports': ['warn', { fixStyle: 'separate-type-imports', disallowTypeAnnotations: false }],
	'@typescript-eslint/no-non-null-assertion': 'error',
	'@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
	'@typescript-eslint/no-use-before-define': 'warn',
	camelcase: 'error',
	complexity: 'warn',
	curly: 'error',
	eqeqeq: 'error',
	'func-style': ['error', 'expression', { allowArrowFunctions: true }],
	'max-depth': ['error', 4],
	'max-lines': ['error', 300],
	'max-nested-callbacks': ['error', 5],
	'max-params': ['warn', 2],
	'max-statements': ['error', 50, { ignoreTopLevelFunctions: true }],
	'no-console': 'error',
	'no-implicit-coercion': ['error', { disallowTemplateShorthand: true, allow: ['!!', '+'] }],
	'no-lone-blocks': 'error',
	'no-nested-ternary': 'error',
	'no-shadow': ['error', { hoist: 'all' }],
	'no-unsafe-optional-chaining': ['error', { disallowArithmeticOperators: true }]
}

export const createBaseConfigBlocks = ({ env = 'node', ignores = [] } = {}) => [
	globalIgnores(['coverage', 'dist', 'node_modules', ...ignores]),
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		extends: [js.configs.recommended, tseslint.configs.recommended, prettierConfig],
		plugins: {
			'@stylistic': stylistic,
			import: importPlugin
		},
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: env === 'browser' ? globals.browser : globals.node
		},
		rules: sharedRules
	},
	{
		files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		settings: {
			'import/internal-regex': '^@'
		},
		rules: {
			'import/newline-after-import': 'error',
			'import/no-duplicates': 'error',
			'import/order': [
				'warn',
				{
					groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
					alphabetize: { order: 'asc', caseInsensitive: true },
					'newlines-between': 'never'
				}
			]
		}
	}
]

export const createBaseConfig = ({ env = 'node', ignores = [] } = {}) => defineConfig(createBaseConfigBlocks({ env, ignores }))