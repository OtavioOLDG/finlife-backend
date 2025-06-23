
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { Decimal } from '../../../generated/prisma/runtime/library'
import { auth } from '../../middleware/auth'

export async function getAllEquityUser(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/patrimonios', {
            schema:{
                tags: ['Patrimônio'],
                summary: 'Pega todos os patrimônios do usuário',
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
            

            const result = await prisma.$transaction(async (tx) =>{
                const patrimonios = await prisma.patrimonio_info.findMany({
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
                        },
                        entrada_info: true,
                        saida_info: true,
                    },
                    where: {
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