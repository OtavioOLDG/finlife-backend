
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { Decimal } from '../../../generated/prisma/runtime/library'
import { auth } from '../../middleware/auth'
import { string } from 'zod/v4'

export async function getAllTiposSaida(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/saida-tipo/todos', {
            schema:{
                tags: ['Pagamento Entrada Tipo'],
                summary: 'Pega todos os tipos de saída',
                security: [{bearerAuth: []}],
                response: {
                    201: z.object({
                        tiposPublicos: z.array(z.object({
                            id: z.number(),
                            id_ativo: z.boolean(),
                            dthr_cadastro: z.date(),
                            id_usuario_info_cadastro: z.number().nullable(),
                            id_grupo_financeiro: z.number().nullable(),
                            nome: z.string(),
                        })),
                        tiposPrivados: z.array(z.object({
                            id: z.number(),
                            id_ativo: z.boolean(),
                            dthr_cadastro: z.date(),
                            id_usuario_info_cadastro: z.number().nullable(),
                            id_grupo_financeiro: z.number().nullable(),
                            nome: z.string(),
                        })),
                    }),
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()

            const userFromId = await prisma.usuario_info.findUnique({
                where: {
                    id: userId
                }
            })

            if(!userFromId){
                throw new BadRequestError('Usuário não encontrado')
            }

            const tiposPublicos = await prisma.pagamento_saida_tipo.findMany({
                where: {
                    publico: true
                }
            }) 


            if(!tiposPublicos){
                throw new BadRequestError('Erro ao pegar tipos públicos')
            }

            const tiposPrivados = await prisma.pagamento_saida_tipo.findMany({
                where: {
                    publico: false,
                    id_ativo: true,
                    id_usuario_info_cadastro: userId
                }
            }) 


            if(!tiposPrivados){
                throw new BadRequestError('Erro ao pegar tipos públicos')
            }
            

            return reply.status(200).send({
                tiposPublicos: tiposPublicos,
                tiposPrivados: tiposPrivados
            })

        }
    )
}