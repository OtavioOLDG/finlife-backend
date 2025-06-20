
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { compare, hash } from 'bcryptjs'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'

export async function removeUser(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/user', {
            schema:{
                tags: ['Usuários'],
                summary: 'Remove o usuário logado',
                security: [{bearerAuth: []}],
                response: {
                    201: z.object({
                        usuarioRemovido : z.object({
                            id: z.number(),
                            id_ativo: z.boolean(),
                            dthr_cadastro: z.date(),
                            endereco: z.string(),
                            email: z.string(),
                            id_info_ativo: z.boolean(),
                            id_usuario: z.number(),
                            senha: z.string(),
                        })
                    }),
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()
            const userFromId = await prisma.usuario_info.findUnique({
                where: {
                    id: userId
                }
            })

            if(!userFromId){
                throw new BadRequestError('Usuário para remoção não encontrado')
            }

            const user = await prisma.usuario.findUnique({
                where: {
                    id: userFromId.id_usuario
                }
            })

            if(!user){
                throw new BadRequestError('Erro ao procurar usuário')
            }

            const result = await prisma.$transaction(async (tx) => {
                const usuarioCongelado = await prisma.usuario_info.update({
                    where: {
                        id: userId
                    },
                    data: {
                        id_ativo: false,
                        id_info_ativo: false
                    }
                })


                if(!usuarioCongelado){
                    throw new BadRequestError('Erro ao remover usuário')
                }

                return usuarioCongelado
            })


            return reply.status(201).send({usuarioRemovido: result})
        }
    )
}