
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'

interface Notificacao {
    id_usuario_info: number
    dthr_cadastro: Date
    titulo: string
    descricao: string
    visto: boolean
    id_saida_info?: number
    id_entrada_info?: number
}

export async function getAllUserNotifications(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/notifications', {
            schema:{
                tags: ['Notificação'],
                summary: 'Pegar notificações do usuário logado',
                security: [{bearerAuth: []}],
                response: {
                    200: z.object({
                        notificacoes: z.array(z.object({
                            id: z.number(),
                            dthr_cadastro: z.date(),
                            id_usuario_info: z.number(),
                            titulo: z.string(),
                            descricao: z.string(),
                            id_saida_info: z.number().nullable(),
                            id_entrada_info: z.number().nullable(),
                            visto: z.boolean(),
                        }) )
                    }),
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()

            const foundNotifications = await prisma.notificacao.findMany({
                where: {
                    id_usuario_info: userId
                }
            })

            if(!foundNotifications){
                throw new BadRequestError('Erro ao encontrar notificações')
            }

            reply.status(200).send({notificacoes: foundNotifications})
        }
    )
}