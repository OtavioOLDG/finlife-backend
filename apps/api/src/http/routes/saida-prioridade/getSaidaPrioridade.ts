
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { compare, hash } from 'bcryptjs'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'

export async function getSaidaPrioridade(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/saida-prioridade', {
            schema:{
                tags: ['Usuários'],
                summary: 'Pega as saídas prioridade',
                security: [{bearerAuth: []}],
                response: {
                    201: z.object({
                        saidas : z.array(z.object({
                            id_ativo: z.boolean(),
                            dthr_cadastro: z.date(),
                            id_usuario_info_cadastro: z.number(),
                            nome: z.string(),
                            nivel: z.number(),
                        }))
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

            const saidas = await prisma.saida_prioridade.findMany({
                select: {
                    nome: true,
                    id_usuario_info_cadastro: true,
                    id_ativo: true,
                    dthr_cadastro: true,
                    nivel: true,
                },
                where: {
                    id_ativo: true,
                    id_usuario_info_cadastro: userId
                },
            })


            if(!saidas){
                throw new BadRequestError('Erro ao remover usuário')
            }

            return reply.status(201).send({saidas: saidas})
        }
    )
}