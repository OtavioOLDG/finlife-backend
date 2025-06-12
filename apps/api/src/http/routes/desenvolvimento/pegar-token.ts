
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import {z} from 'zod'
import { email } from 'zod/v4'
import { prisma } from '../../../lib/prisma'
import { timeStamp } from 'console'
import { equal } from 'assert'
import { compare, hash } from 'bcryptjs'
import { BadRequestError } from '../_errors/bad-request-error'

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
                sub: 1
            }, {
                sign : {
                    expiresIn: '10m'
                }
            })

            return reply.status(200).send({ token })
        }
    )
}