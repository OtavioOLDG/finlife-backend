
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { Decimal } from '../../../generated/prisma/runtime/library'
import { auth } from '../../middleware/auth'
import { string } from 'zod/v4'

export async function getEntrada(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/entrada/:id', {
            schema:{
                tags: ['Entrada'],
                summary: 'Pega uma entrada',
                security: [{bearerAuth: []}],
                params: z.object({
                    id: z.coerce.number()
                }),
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()

            const userFromId = await prisma.usuario_info.findUnique({
                include: {
                    usuario: true
                },
                where: {
                    id: userId
                }
            })

            if(!userFromId){
                throw new BadRequestError('Usuário não encontrado')
            }

            const {id} = request.params

            const entradaFound = prisma.entrada_info.findFirst({
                include: {
                    entrada: true
                },
                where: {
                    id: id,
                    id_ativo: true,
                    id_usuario_info_cadastro: userId
                }
            })

            if(!entradaFound){
                throw new BadRequestError('Erro ao buscar saída')
            }

            return reply.status(200).send({
                entrada: entradaFound
            })

        }
    )
}