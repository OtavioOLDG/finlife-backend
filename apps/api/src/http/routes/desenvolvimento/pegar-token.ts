
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function pegarToken(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post('/dev/login', {
            schema:{
                tags: ['Desenvolvimento'],
                summary: 'Pegar token',
                response: {
                    201: z.object({
                        token: z.string()
                    })
                }
            }
        },
        async(request, reply) => {
            const token = await reply.jwtSign({
                sub: 28
            }, {
                sign : {
                    expiresIn: '1d'
                }
            })

            return reply.status(200).send({ token })
        }
    )
}