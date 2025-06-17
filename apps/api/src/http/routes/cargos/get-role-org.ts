
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../../middleware/auth'
import { prisma } from '../../../lib/prisma'
import { roleSchema } from '@finlife/auth'
import { BadRequestError } from '../_errors/bad-request-error'
import { Role } from '../../../generated/prisma'

export async function getRoleOrg(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/grupo-financeiro/cargo', {
            schema:{
                tags: ['Cargos'],
                summary: 'Pegar Cargo na Organização',
                security: [{bearerAuth: []}],
                response: {
                    201: z.object({
                        role: roleSchema
                    })
                }
            }
        },
        async(request, reply) => {
            const {grupoFinanceiroUsuario} = await request.getMembership()

            if(!grupoFinanceiroUsuario){
                return reply.status(200).send({role: Role.CONVIDADO})
            }

            return reply.status(200).send({role: grupoFinanceiroUsuario.role})
        }
    )
}