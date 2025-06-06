import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
    server:{
        DATABASE_URL: z.string().default('3333'),
        JWT_SECRET: z.string(),
        SERVER_PORT: z.string()
    },
    client: {},
    shared:{},
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        SERVER_PORT: process.env.SERVER_PORT
    },
    emptyStringAsUndefined: true
})