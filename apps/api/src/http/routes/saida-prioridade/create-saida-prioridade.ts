
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'

export async function createSaidaPrioridade(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/saida-prioridade', {
            schema:{
                tags: ['Saída prioridade'],
                summary: 'Criar nova saída prioridade',
                security: [{bearerAuth : []}],
                body: z.object({
                    nome: z.string().nonempty(),
                    nivel: z.coerce.number()
                }),
                response: {
                    201: z.object({
                        nome: z.string(),
                        nivel: z.number(),
                        dthr_cadastro: z.date(),
                        id_ativo: z.boolean(),
                        id: z.number(),
                        id_usuario_info_cadastro: z.number(),
                    }),
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()
            const {nivel,nome} = request.body

            if(!userId){
                throw new BadRequestError('Erro')
            }

            const createdResult = await prisma.saida_prioridade.create({
                data: {
                    nome: nome,
                    nivel: nivel,
                    id_usuario_info_cadastro: userId,
                    id_ativo: true,
                    dthr_cadastro: new Date()
                }
            })

            return reply.status(201).send(createdResult)
        }
    )
}