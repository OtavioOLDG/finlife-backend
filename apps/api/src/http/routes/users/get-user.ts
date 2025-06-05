
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'

export async function getProfile(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/users/profile', {
            schema:{
                tags: ['Usuários'],
                summary: 'Pegar informações do usuário',
                response: {
                    201: z.object({
                        id: z.number(),
                        email: z.string()
                    })
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()

            const user = await prisma.usuario_info.findUnique({
                select:{
                    id: true,
                    email: true,
                },
                where : {
                    id: userId
                }
            })

            if(!user){
                throw new BadRequestError('Usuário não encontrado')
            }

            reply.status(200).send(user)
        }
    )
}