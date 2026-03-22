import { createNodeAppConfig } from '../../packages/eslint-config/node-app.js'

export default createNodeAppConfig({ tsconfigRootDir: import.meta.dirname })
