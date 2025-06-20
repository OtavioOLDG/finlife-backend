
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'
import { defineAbilityFor, roleSchema } from '@finlife/auth'
import { userSchema } from '@finlife/auth/src/models/user'

export async function unInvite(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/convite/:id', {
            schema:{
                tags: ['Convite'],
                summary: 'Desconvidar usuário para organização / Cancelar convite',
                security: [{bearerAuth: []}],
                params: z.object({
                    id: z.coerce.number()
                }),
                response: {
                    200: z.string()
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()
            const {id} = request.params

            const {grupoFinanceiro, grupoFinanceiroUsuario} = await request.getMembership()

            const authUser = userSchema.parse({
                id: userId,
                role: grupoFinanceiroUsuario.role
            })

            const auth = defineAbilityFor(authUser)

            if(auth.cannot('delete', 'Convite')){
                throw new BadRequestError('Você não tem permissão para realizar esta ação')
            }

            if(!grupoFinanceiro || !grupoFinanceiroUsuario){
                throw new BadRequestError('Erro ao procurar grupo financeiro')
            }

            const invite = await prisma.convite.findFirst({
                where: {
                    id,
                    grupo_financeiro_usuarioId: grupoFinanceiroUsuario.id,
                    pendente: true
                }
            })

            if(!invite){
                throw new BadRequestError('Convite não encontrado')
            }

            
            const conviteUpdate = await prisma.convite.update({
                where: {
                    id
                },
                data: {
                    pendente: false,
                    recusado: true,
                }
            })
            

            if(!conviteUpdate){
                throw new BadRequestError('Usuário não encontrado')
            }

            reply.status(200).send('Convite cancelado')
        }
    )
}