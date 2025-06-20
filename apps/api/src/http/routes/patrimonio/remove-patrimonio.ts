
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
                    201: z.string()
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


            const removedPatrimonioInfo = await prisma.patrimonio_info.update({
                where: {
                    id
                },
                data: {
                    id_ativo: true,
                    id_info_ativo: true,
                }
            })


            return reply.status(200).send('Patrimônio removido')

        }
    )
}