
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
                        message: z.string(),
                        usuario: z.object({
                            id: z.number(),
                            id_ativo: z.boolean(),
                            dthr_cadastro: z.date(),
                            role: roleSchema,
                            id_usuario_info_cadastro: z.number(),
                            id_usuario_info: z.number(),
                            id_grupo_financeiro: z.number(),
                        })
                    })
                }
            }
        },
        async(request, reply) => {
            const {grupoFinanceiroUsuario, grupoFinanceiro} = await request.getMembership()

            const foundUsersFromGroup = await prisma.grupo_financeiro_usuario.findMany({
                where: {
                    id_grupo_financeiro: grupoFinanceiro.id,
                    id_ativo: true
                }
            })

            if(foundUsersFromGroup.length <= 1){
                const updatedGroup = await prisma.grupo_financeiro.update({
                    where: {
                        id: grupoFinanceiro.id
                    },
                    data:{
                        id_ativo: false
                    }
                })

                if(!updatedGroup){
                    throw new BadRequestError('Erro ao apagar grupo')
                }
            }

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


            reply.status(200).send({
                message : 'Você saiu do seu grupo',
                usuario: quitUser
            })
        }
    )
}