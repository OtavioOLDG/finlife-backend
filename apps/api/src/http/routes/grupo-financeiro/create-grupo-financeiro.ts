
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'
import { roleSchema } from '@finlife/auth'

export async function createGrupoFinanceiro(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/groups', {
            schema:{
                tags: ['Grupo Financeiro'],
                summary: 'Cria grupo financeiro adicionando usuário admin',
                security: [{bearerAuth: []}],
                body: z.object({
                    nome: z.string()
                }),
                response: {
                    200: z.object({
                        grupoFinanceiroCriado: z.object({
                            nome: z.string(),
                            id: z.number(),
                            dthr_cadastro: z.date(),
                            id_ativo: z.boolean(),
                            id_usuario_info_cadastro: z.number(),
                        }),
                        usuarioGrupoFinanceiro: z.object({
                            id: z.number(),
                            dthr_cadastro: z.date(),
                            id_ativo: z.boolean(),
                            id_usuario_info_cadastro: z.number(),
                            role: roleSchema,
                            id_usuario_info: z.number(),
                            id_grupo_financeiro: z.number(),
                        })
                    })
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()
            const { nome } = request.body

            const userInfo = await prisma.usuario_info.findUnique({
                where: {
                    id: userId
                }
            })

            const user = await prisma.usuario.findFirst({
                select: {
                    cpf: true,
                    dthr_nascimento: true,
                    id: true,
                    nome: true,
                    sobrenome: true,
                    usuario_info: {
                        select:{
                            email: true
                        },
                        where: {
                            id:userId
                        }
                    }
                },
                where: {
                    usuario_info: {
                        some: {
                            id: userInfo?.id
                        }
                    }
                },
            })

            if(!userInfo || !user){
                throw new BadRequestError('Você deve estar logado para realizar esta ação')
            }


            const foundMember = await prisma.grupo_financeiro_usuario.findFirst({
                where:{
                    id_ativo: true,
                    id_usuario_info: userId
                }
            })

            if(foundMember){
                throw new BadRequestError('Você não pode entrar em mais de um grupo')
            }


            const result = await prisma.$transaction(async (tx) => {
                const grupoFinanceiroCriado = await tx.grupo_financeiro.create({
                    data: {
                        id_ativo: true,
                        nome: nome,
                        dthr_cadastro: new Date(),
                        id_usuario_info_cadastro: userId
                    }
                })

                const usuarioGrupoFinanceiro = await tx.grupo_financeiro_usuario.create({
                    data: {
                        role: 'ADMIN',
                        id_ativo: true,
                        dthr_cadastro: new Date(),
                        id_usuario_info_cadastro: userId,
                        id_grupo_financeiro: grupoFinanceiroCriado.id,
                        id_usuario_info: userId
                    }
                })

                return { grupoFinanceiroCriado, usuarioGrupoFinanceiro };
            })
            

            if(!result.grupoFinanceiroCriado || !result.usuarioGrupoFinanceiro){
                throw new BadRequestError('Erro ao criar grupo financeiro')
            }

            reply.status(200).send(result)
        }
    )
}