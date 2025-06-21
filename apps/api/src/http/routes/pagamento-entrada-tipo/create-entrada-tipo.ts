
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { Decimal } from '../../../generated/prisma/runtime/library'
import { auth } from '../../middleware/auth'
import { string } from 'zod/v4'

interface Pagamento{
    nome: string,
    dthr_cadastro: Date,
    id_ativo: boolean,
    id_usuario_info_cadastro: number,
    id_grupo_financeiro?: number
}

export async function createIncome(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/entrada-tipo', {
            schema:{
                tags: ['Pagamento Entrada Tipo'],
                summary: 'Cadastra um novo tipo de entrada',
                security: [{bearerAuth: []}],
                body: z.object({
                    nome: z.string(),
                    vincular_grupo: z.boolean()
                }),
                response: {
                    201: z.object({
                        tipoPagamento: z.object({
                            id: z.number(),
                            id_ativo: z.boolean(),
                            dthr_cadastro: z.date(),
                            id_usuario_info_cadastro: z.number().nullable(),
                            id_grupo_financeiro: z.number().nullable(),
                            nome: z.string(),
                        }),
                    }),
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()
            const {nome, vincular_grupo} = request.body

            const data : Pagamento = {
                nome: nome,
                dthr_cadastro: new Date(),
                id_ativo: true,
                id_usuario_info_cadastro: userId
            }

            if(vincular_grupo){
                const {grupoFinanceiro} = await request.getMembership()
                data.id_grupo_financeiro = grupoFinanceiro.id
            }

            const userFromId = await prisma.usuario_info.findUnique({
                where: {
                    id: userId
                }
            })

            if(!userFromId){
                throw new BadRequestError('Usuário não encontrado')
            }

            const createdTipo = await prisma.pagamento_entrada_tipo.create({
                data: data
            }) 


            if(!createdTipo){
                throw new BadRequestError('Erro ao criar patrimônio')
            }

            return reply.status(200).send({
                tipoPagamento: createdTipo,
            })

        }
    )
}