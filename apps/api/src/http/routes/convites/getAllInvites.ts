
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'
import { defineAbilityFor, roleSchema } from '@finlife/auth'
import { userSchema } from '@finlife/auth/src/models/user'

export async function getALlInvites(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/convites', {
            schema:{
                tags: ['Convite'],
                summary: 'Pega todos os convites da organização',
                security: [{bearerAuth: []}],
                response: {
                    200: z.object({
                        convites: z.array(
                            z.object({
                                usuario : z.object({
                                    id: z.number(),
                                    email: z.string(),
                                }),
                                membroId: z.object({
                                    usuario_info_grupo_financeiro_usuario_id_usuario_info_cadastroTousuario_info: z.object({
                                        usuario: z.object({
                                            nome: z.string(),
                                            sobrenome: z.string(),
                                        })
                                    })
                                })
                            }).merge(
                                    z.object({
                                        id: z.number(),
                                        cargo: roleSchema,
                                        grupo_financeiro_usuarioId: z.number(),
                                        recusado: z.boolean(),
                                        pendente: z.boolean(),
                                        usuarioDestinoId: z.number(),
                                        grupoFinanceiroId: z.number(),
                                    })
                                )
                        )
                    })
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()

            const {grupoFinanceiro, grupoFinanceiroUsuario} = await request.getMembership()

            const authUser = userSchema.parse({
                id: userId,
                role: grupoFinanceiroUsuario.role
            })

            const auth = defineAbilityFor(authUser)

            if(auth.cannot('getAll', 'Convite')){
                throw new BadRequestError('Você não tem permissão para realizar esta ação')
            }

            if(!grupoFinanceiro || !grupoFinanceiroUsuario){
                throw new BadRequestError('Erro ao procurar grupo financeiro')
            }

            const invites = await prisma.convite.findMany({
                where: {
                    pendente: true,
                    grupoFinanceiroId: grupoFinanceiro.id
                },
                include:{
                    usuario: true,
                    membroId:{
                        include:{
                            usuario_info_grupo_financeiro_usuario_id_usuario_info_cadastroTousuario_info:{
                                include: {
                                    usuario: {
                                        select: {
                                            nome: true,
                                            sobrenome: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })

            if(!invites){
                throw new BadRequestError('Convite não encontrado')
            }
            
            reply.status(200).send({convites: invites})
        }
    )
}