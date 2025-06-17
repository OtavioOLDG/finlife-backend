
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
                security: [{bearerAuth: []}],
                response: {
                    200: z.object({
                        user: z.object({
                            nome: z.string(),
                            sobrenome: z.string(),
                            cpf: z.string(),
                            dthr_nascimento: z.date(),
                            id: z.number(),
                        }).nullish(),
                        userInfo: z.object({
                            id: z.number(),
                            email: z.string(),
                            endereco: z.string()
                        }).nullable()
                    }),
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()


            const result = await prisma.$transaction(async (tx) => {
                const userInfo = await prisma.usuario_info.findUnique({
                    select:{
                        id: true,
                        email: true,
                        id_usuario: true,
                        endereco: true,
                        notificacao: true,
                        grupo_financeiro: true,
                    },
                    where : {
                        id: userId
                    }
                })
                const user = await prisma.usuario.findUnique({
                    select: {
                        id: true,
                        cpf: true,
                        nome: true,
                        sobrenome: true,
                        dthr_nascimento: true,
                    },
                    where: {
                        id: userInfo?.id_usuario
                    }
                })

                return {user , userInfo}
            })
            

            if(!result.user || !result.userInfo){
                throw new BadRequestError('Usuário não encontrado')
            }

            reply.status(200).send(result)
        }
    )
}