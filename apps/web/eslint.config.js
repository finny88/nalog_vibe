import { createReactAppConfig } from '../../packages/eslint-config/react-app.js'

export default createReactAppConfig({ typescriptProject: './tsconfig.app.json', tsconfigRootDir: import.meta.dirname })
