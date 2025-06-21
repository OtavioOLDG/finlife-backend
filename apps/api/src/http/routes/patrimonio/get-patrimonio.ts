
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { Decimal } from '../../../generated/prisma/runtime/library'
import { auth } from '../../middleware/auth'
import { id } from 'zod/v4/locales'

export async function getEquityById(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/patrimonio/:id', {
            schema:{
                tags: ['Patrimônio'],
                summary: 'Pega patrimônio por id',
                security: [{bearerAuth: []}],
                params: z.object({
                    id: z.coerce.number()
                }),
                response: {
                    201: z.object({
                        patrimonios: z.object({
                            patrimonio: z.object({
                                nome: z.string(),
                                valor_aquisicao: z.any(),  // Agora, usaremos Decimal aqui
                            }),
                            entrada_info: z.array(
                                z.object({
                                    id_ativo: z.boolean(),
                                    id_periodicidade: z.number(),
                                    valor: z.any()
                                })
                            ),
                            saida_info: z.array(
                                z.object({
                                    id_ativo: z.boolean(),
                                    id_periodicidade: z.number(),
                                    valor: z.any()
                                })
                            ),
                            id: z.number(),
                            id_ativo: z.boolean(),
                            dthr_cadastro: z.date(),
                            id_usuario_info_cadastro: z.number(),
                            id_info_ativo: z.boolean(),
                            valor_mercado: z.any(),  // Alterado para Decimal
                            id_patrimonio: z.number(),
                        }),
                    }),
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()
            const {id} = request.params

            const userFromId = await prisma.usuario_info.findUnique({
                where: {
                    id: userId
                }
            })

            if(!userFromId){
                throw new BadRequestError('Usuário não encontrado')
            }
            
            const result = await prisma.$transaction(async (tx) =>{
                const patrimonios = await prisma.patrimonio_info.findFirst({
                    include: {
                        patrimonio: {
                            select:{
                                nome: true,
                                valor_aquisicao: true
                            }
                        },
                        entrada_info: {
                            select: {
                                id_ativo:true,
                                id_periodicidade: true,
                                valor: true
                            }
                        },
                        saida_info: {
                            select:{
                                id_ativo:true,
                                id_periodicidade: true,
                                valor: true
                            }
                        }
                    },
                    where: {
                        id: id,
                        id_usuario_info_cadastro: userId,
                        id_ativo: true,
                        id_info_ativo: true
                    },
                })

                if(!patrimonios){
                    throw new BadRequestError('Patrimônios não encontrados')
                }

                return (patrimonios)
            })


            return reply.status(200).send({
                patrimonios: result
            })

        }
    )
}