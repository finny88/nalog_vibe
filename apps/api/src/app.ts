import Fastify from 'fastify'
import { env } from './config/env.js'

export const buildApp = () => {
	const app = Fastify({
		logger: true
	})

	app.get('/health', async () => ({
		host: env.API_HOST,
		ok: true
	}))

	return app
}