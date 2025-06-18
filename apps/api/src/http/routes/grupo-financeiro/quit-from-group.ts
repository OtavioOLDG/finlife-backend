
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'
import { roleSchema } from '@finlife/auth'

export async function quitFromGroup(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/groups/quit', {
            schema:{
                tags: ['Grupo Financeiro'],
                summary: 'Sai do seu grupo atual',
                security: [{bearerAuth: []}],
                response: {
                    200: z.object({
                        message: z.string()
                    })
                }
            }
        },
        async(request, reply) => {
            const {grupoFinanceiroUsuario} = await request.getMembership()

            const quitUser = await prisma.grupo_financeiro_usuario.update({
                where:{
                    id: grupoFinanceiroUsuario.id
                },
                data: {
                    id_ativo: false
                }
            })

            if(!quitUser){
                throw new BadRequestError('Erro ao sair do grupo')
            }


            reply.status(200).send({message : 'Você saiu do seu grupo'})
        }
    )
}