
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'
import { roleSchema } from '@finlife/auth'
import { email } from 'zod/v4'

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
                                membroId: z.object({
                                    usuario_info_grupo_financeiro_usuario_id_usuario_info_cadastroTousuario_info: z.object({
                                            usuario: z.object({
                                                nome: z.string(),
                                                sobrenome: z.string(),
                                            }),
                                            email: z.string().email(),
                                        })
                                        .merge(
                                            z.object({
                                                id: z.number(),
                                                email: z.string().email(),
                                            })
                                        ),
                                    })
                                    .merge(
                                        z.object({
                                            role: roleSchema,
                                        })
                                    ),
                                id: z.number(),
                                cargo: roleSchema,
                                grupo_financeiro_usuarioId: z.number(),
                                usuarioDestinoId: z.number(),
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
                    membroId:{
                        include:{
                            usuario_info_grupo_financeiro_usuario_id_usuario_info_cadastroTousuario_info:{
                                include: {
                                    usuario: {
                                        select: {
                                            nome: true,
                                            sobrenome: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                }
            })

            if(!convitesUsuario){
                throw new BadRequestError('Erro ao pegar convites do usuário')
            }



            reply.status(200).send({convitesUsuario})
        }
    )
}