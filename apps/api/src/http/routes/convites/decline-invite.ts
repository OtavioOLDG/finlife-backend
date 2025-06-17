
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'

export async function declineInvite(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/usuario/convites/recusar/:id', {
            schema:{
                tags: ['Convite'],
                summary: 'Recusa um convite',
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

            const convite = await prisma.convite.findUnique({
                where: {
                    id
                }
            })

            if(!convite){
                throw new BadRequestError('Convite não encontrado')
            }

            if(!convite.pendente){
                throw new BadRequestError('Convite já foi respondido anteriormente')
            }

            if(convite.usuarioDestinoId !== userId){
                throw new BadRequestError('Usuário não tem permissão para aceitar/recusar convites de terceiros')
            }

            const conviteAtualizado = await prisma.convite.update({
                where: {
                    id: convite.id
                },
                data:{
                    pendente: false,
                    recusado: true
                }
            })

            if(!conviteAtualizado){
                throw new BadRequestError('Erro ao recusar convite')
            }

            reply.status(200).send('Convite recusado')
        }
    )
}