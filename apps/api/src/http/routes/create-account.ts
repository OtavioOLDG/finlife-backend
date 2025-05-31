
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import {z} from 'zod'
import { email } from 'zod/v4'

export async function createAccount(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post('/users', {
            schema:{
                body: z.object({
                    name: z.string(),
                    email: z.string().email(),
                    password: z.string().min(6),
                })
            }
        },
        async(request, reply) => {
            return 'User created'
        }
    )
}