
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { Decimal } from '../../../generated/prisma/runtime/library'
import { auth } from '../../middleware/auth'
import { userSchema } from '@finlife/auth/src/models/user'
import { defineAbilityFor } from '@finlife/auth'
import { getAllMembersId } from '../grupo-usuario/grupo-usuario-functions'
import type { patrimonio_info } from '../../../generated/prisma'

export async function getAllEquityGroup(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/patrimonios/grupo-financeiro', {
            schema:{
                tags: ['Patrimônio'],
                summary: 'Pega todos os patrimônios do grupo',
                security: [{bearerAuth: []}],
                response: {
                    201: z.object({
                        patrimonios: z.array(z.object({
                            patrimonio: z.object({
                                nome: z.string(),
                                valor_aquisicao: z.any(),  // Agora, usaremos Decimal aqui
                            }),
                            usuario_info: z.object({
                                usuario: z.object({
                                    nome: z.string(),
                                    cpf: z.string(),
                                }),
                                email: z.string(),
                            }),
                            id: z.number(),
                            id_ativo: z.boolean(),
                            dthr_cadastro: z.date(),
                            id_usuario_info_cadastro: z.number(),
                            id_info_ativo: z.boolean(),
                            valor_mercado: z.any(),  // Alterado para Decimal
                            id_patrimonio: z.number(),
                        })),
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
                throw new BadRequestError('Usuário não encontrado')
            }

            const {grupoFinanceiro, grupoFinanceiroUsuario} = await request.getMembership()
            
            const authUser = userSchema.parse({
                id: userId,
                role: grupoFinanceiroUsuario.role
            })

            const auth = defineAbilityFor(authUser)

            if(auth.cannot('get', 'Patrimonio')){
                throw new BadRequestError('Você não tem permissão para realizar esta ação')
            }

            if(!grupoFinanceiro || !grupoFinanceiroUsuario){
                throw new BadRequestError('Erro ao procurar grupo financeiro')
            }

            const patrimonioUsers = await prisma.patrimonio_info.findMany({
                include: {
                    patrimonio: {
                        select:{
                            nome: true,
                            valor_aquisicao: true
                        }
                    },
                    usuario_info: {
                        select: {
                            email: true,
                            usuario: {
                                select:{
                                    cpf: true,
                                    nome: true
                                }
                            }
                        }
                    }
                },
                where: {
                    id_ativo: true,
                    id_info_ativo: true,
                    usuario_info: {
                        grupo_financeiro_usuario_grupo_financeiro_usuario_id_usuario_infoTousuario_info:{
                            some: {
                                id_grupo_financeiro: grupoFinanceiro.id
                            }
                        }
                    }
                },
            })

            if(!patrimonioUsers){
                throw new BadRequestError('Patrimônios não encontrados')
            }

            return reply.status(200).send({
                patrimonios: patrimonioUsers
            })

        }
    )
}