
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { Decimal } from '../../../generated/prisma/runtime/library'
import { auth } from '../../middleware/auth'
import { string } from 'zod/v4'

export async function getAllEntradas(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/entradas', {
            schema:{
                tags: ['Entrada'],
                summary: 'Pega todas as entradas do usuário',
                security: [{bearerAuth: []}],
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

            const foundEntradas = await prisma.entrada_info.findMany({
                include: {
                    entrada: true
                },
                where: {
                    id_ativo: true,
                    id_info_ativo: true,
                    OR: [{
                        id_usuario_info_cadastro: userId,
                        id_usuario_info: userId
                    }]
                }
            })


            return reply.status(200).send({
                entradas: foundEntradas
            })

        }
    )
}