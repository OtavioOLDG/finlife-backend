
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'
import type { userInfo } from 'os'
import { defineAbilityFor, roleSchema } from '@finlife/auth'
import { Role } from '../../../generated/prisma'
import { userSchema } from '@finlife/auth/src/models/user'
import { id } from 'zod/v4/locales'

export async function getAllUserInvites(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/usuario/convites', {
            schema:{
                tags: ['Convite'],
                summary: 'Pega todos os conivtes de um usuário',
                security: [{bearerAuth: []}],
                response: {
                    200: z.object({
                        convitesUsuario: z.array(
                            z.object({
                                id: z.number(),
                                cargo: roleSchema,
                                usuarioDestinoId: z.number(),
                                grupo_financeiro_usuarioId: z.number(),
                                recusado: z.boolean(),
                                pendente: z.boolean(),
                                grupoFinanceiroId: z.number(),
                            })
                        )
                    })
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()

            const convitesUsuario = await prisma.convite.findMany({
                where: {
                    usuarioDestinoId: userId,
                    pendente: true
                },
                include: {
                    grupoId: true
                }
            })

            if(!convitesUsuario){
                throw new BadRequestError('Erro ao pegar convites do usuário')
            }

            reply.status(200).send({convitesUsuario})
        }
    )
}