
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { Decimal } from '../../../generated/prisma/runtime/library'
import { auth } from '../../middleware/auth'

export async function removePatrimonio(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/patrimonio/:id', {
            schema:{
                tags: ['Patrimônio'],
                summary: 'Remove um patrimônio',
                security: [{bearerAuth: []}],
                params: z.object({
                    id: z.coerce.number()
                }),
                response: {
                    201: z.object({
                        message: z.string(),
                        patrimonioRemovido: z.object({
                            id:z. number(),
                            id_ativo: z.boolean(),
                            dthr_cadastro: z.date(),
                            id_usuario_info_cadastro:z. number(),
                            id_info_ativo: z.boolean(),
                            id_patrimonio:z. number(),
                            valor_mercado: z.any(),
                        })
                    })
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

            const foundEquity = await prisma.patrimonio_info.findFirst({
                where: {
                    id: id,
                    id_ativo: true,
                    id_info_ativo: true,
                }
            })
            
            if(!foundEquity){
                throw new BadRequestError('Patrimônio não encontrado')
            }

            const removedPatrimonioInfo = await prisma.patrimonio_info.update({
                where: {
                    id: id
                },
                data: {
                    id_ativo: false,
                    id_info_ativo: false,
                }
            })

            if(!removedPatrimonioInfo){
                throw new BadRequestError('Erro ao remover patrimônio')
            }


            return reply.status(200).send({
                message: 'Patrimônio removido',
                patrimonioRemovido: removedPatrimonioInfo
            })

        }
    )
}