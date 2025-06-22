
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { Decimal } from '../../../generated/prisma/runtime/library'
import { auth } from '../../middleware/auth'
import { string } from 'zod/v4'

export async function getSaidas(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/saidas', {
            schema:{
                tags: ['Saída'],
                summary: 'Pega todas as saídas do usuário',
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

            const saidaFound = await prisma.saida_info.findMany({
                include: {
                    saida: true
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

            if(!saidaFound){
                throw new BadRequestError('Erro ao buscar saída')
            }

            return reply.status(200).send({
                saidas: saidaFound,
                usuario: userFromId
            })

        }
    )
}