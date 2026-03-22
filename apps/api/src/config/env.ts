import { config as loadDotenv } from 'dotenv'
import { z } from 'zod'

loadDotenv()

const envSchema = z.object({
	API_HOST: z.string().min(1).default('0.0.0.0'),
	API_PORT: z.coerce.number().int().positive().default(3001),
	DATABASE_URL: z.string().url()
})

export const env = envSchema.parse(process.env)
export type Env = z.infer<typeof envSchema>