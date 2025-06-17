
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'
import type { userInfo } from 'os'
import { defineAbilityFor, roleSchema } from '@finlife/auth'
import { Role } from '../../../generated/prisma'
import { userSchema } from '@finlife/auth/src/models/user'
import { id } from 'zod/v4/locales'

export async function acceptInvite(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/usuario/convites/aceitar/:id', {
            schema:{
                tags: ['Convite'],
                summary: 'Aceita um convite',
                security: [{bearerAuth: []}],
                params: z.object({
                    id: z.coerce.number()
                }),
                response: {
                    200: z.object({
                        usuarioOrgCriado: z.object({
                            id: z.number(),
                            id_ativo: z.boolean(),
                            dthr_cadastro: z.date(),
                            role: roleSchema,
                            id_usuario_info_cadastro: z.number(),
                            id_usuario_info: z.number(),
                            id_grupo_financeiro: z.number(),
                        }),
                    })
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()
            const {id} = request.params

            const convite = await prisma.convite.findUnique({
                where: {
                    id
                }
            })

            if(!convite){
                throw new BadRequestError('Convite não encontrado')
            }

            if(!convite.pendente){
                throw new BadRequestError('Convite já foi respondido anteriormente')
            }

            if(convite.usuarioDestinoId !== userId){
                throw new BadRequestError('Usuário não tem permissão para aceitar/recusar convites de terceiros')
            }

            const grupoFinanceiro = await prisma.grupo_financeiro.findFirst({
                where:{
                    id: convite.grupoFinanceiroId
                }
            })

            if(!grupoFinanceiro){
                throw new BadRequestError('Erro ao procurar grupo financeiro')
            }

            const result = await prisma.$transaction(async (tx) => {
                const usuarioOrgCriado = await prisma.grupo_financeiro_usuario.create({
                    data:{
                        id_usuario_info: userId,
                        dthr_cadastro: new Date(),
                        id_ativo: true,
                        id_grupo_financeiro: grupoFinanceiro.id,
                        role: convite.cargo,
                        id_usuario_info_cadastro: convite.grupo_financeiro_usuarioId
                    }
                })

                if(!usuarioOrgCriado){
                    throw new BadRequestError('Erro ao criar usuario do grupo financeiro')
                }

                const conviteAtualizado = await prisma.convite.update({
                    where: {
                        id: convite.id
                    },
                    data:{
                        pendente: false,
                        recusado: false
                    }
                })

                if(!conviteAtualizado){
                    throw new BadRequestError('Erro ao aceitar convite')
                }

                return {usuarioOrgCriado,conviteAtualizado}
            })

            if(!result.conviteAtualizado || !result.usuarioOrgCriado){
                throw new BadRequestError('Erro na transação do convite')
            }


            reply.status(200).send({usuarioOrgCriado: result.usuarioOrgCriado})
        }
    )
}