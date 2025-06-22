
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { Decimal } from '../../../generated/prisma/runtime/library'
import { auth } from '../../middleware/auth'

interface Data {
    nome?: string,
    valor_aquisicao?: number
    valor_mercado?: number
}

export async function editEquityUser(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).patch('/patrimonio/:id', {
            schema:{
                tags: ['Patrimônio'],
                summary: 'Pega todos os patrimônios do usuário',
                security: [{bearerAuth: []}],
                params: z.object({
                    id: z.coerce.number()
                }), 
                body: z.object({
                    nome: z.string().nonempty().nullish(),
                    valor_aquisicao: z.coerce.number().nullish(),
                    valor_mercado: z.coerce.number().nullish()
                }),
                response: {
                    201: z.object({
                        patrimonio: z.object({
                            patrimonio: z.object({
                                nome: z.string(),
                                valor_aquisicao: z.any(),  // Agora, usaremos Decimal aqui
                            }),
                            usuario_info: z.object({
                                usuario: z.object({
                                    nome: z.string(),
                                    cpf: z.string(),
                                }),
                                email: z.string(),
                            }),
                            id: z.number(),
                            id_ativo: z.boolean(),
                            dthr_cadastro: z.date(),
                            id_usuario_info_cadastro: z.number(),
                            id_info_ativo: z.boolean(),
                            valor_mercado: z.any(),  // Alterado para Decimal
                            id_patrimonio: z.number(),
                        }),
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
            
            const {id} = request.params
            const {nome, valor_aquisicao, valor_mercado} = request.body

            const data : Data ={}

            if(nome){
                data.nome = nome
            }

            if(valor_aquisicao){
                data.valor_aquisicao = valor_aquisicao
            }

            if(valor_mercado){
                data.valor_mercado = valor_mercado
            }

            const patrimonios = await prisma.patrimonio_info.update({
                include: {
                    patrimonio: {
                        select:{
                            nome: true,
                            valor_aquisicao: true
                        }
                    },
                    usuario_info: {
                        select: {
                            email: true,
                            usuario: {
                                select:{
                                    cpf: true,
                                    nome: true
                                }
                            }
                        }
                    }
                },
                where: {
                    id
                },
                data: data
            })

            if(!patrimonios){
                throw new BadRequestError('Patrimônios não encontrados')
            }


            

            return reply.status(200).send({
                patrimonio: patrimonios
            })

        }
    )
}