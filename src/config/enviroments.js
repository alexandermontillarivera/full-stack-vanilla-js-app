import { config } from '#loadEnv'

config()

export const enviroments = {
  PORT: Number(process.env.PORT)
}
