
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../../middleware/auth'
import { prisma } from '../../../lib/prisma'
import { roleSchema } from '@finlife/auth'
import { BadRequestError } from '../_errors/bad-request-error'
import { Role } from '../../../generated/prisma'

export async function pegarCargo(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/dev/cargo', {
            schema:{
                tags: ['Desenvolvimento'],
                summary: 'Pegar Cargo',
                security: [{bearerAuth: []}],
                response: {
                    201: z.object({
                        role: roleSchema
                    })
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()

            const membroEmOrganizacoes = await prisma.grupo_financeiro_usuario.findFirst({
                where: {
                    id_usuario_info: userId,
                    id_ativo: true
                }
            })

            if(!membroEmOrganizacoes){
                return reply.status(200).send({role: Role.CONVIDADO})
            }

            return reply.status(200).send({role: membroEmOrganizacoes.role})
        }
    )
}