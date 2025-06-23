
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { Decimal } from '../../../generated/prisma/runtime/library'
import { auth } from '../../middleware/auth'
import { string } from 'zod/v4'

interface SaidaInfo{
    id_ativo: boolean,
    dthr_cadastro: Date,
    dthr_saida?: Date,
    id_saida_categoria: number
    id_pagamento_saida_tipo: number
    id_usuario_info_cadastro: number
    id_saida?: number,
    id_info_ativo: boolean,
    id_saida_prioridade: number
    id_usuario_info: number
    id_periodicidade: number
    valor: number
    id_patrimonio_info?: number
    patrimonio_infoId?: number
}

export async function createSaida(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/saida', {
            schema:{
                tags: ['Saída'],
                summary: 'Cadastra uma nova saída',
                security: [{bearerAuth: []}],
                body: z.object({
                    nome: z.string(),
                    dthr_saida: z.date().nullish(),
                    id_saida_categoria: z.coerce.number(),
                    id_pagamento_saida_tipo: z.coerce.number(),
                    id_saida_prioridade: z.coerce.number(),
                    id_usuario_info: z.coerce.number(),
                    id_periodicidade: z.coerce.number(),
                    valor: z.coerce.number(),
                    id_patrimonio_info: z.number().nullish(),
                }),
                response: {
                    201: z.object({
                        saida: z.object({
                            id: z.number(),
                            nome: z.string(),
                        }),
                        saidaInfo: z.object({
                            id: z.number(),
                            id_ativo: z.boolean(),
                            dthr_cadastro: z.date(),
                            id_usuario_info_cadastro: z.number(),
                            id_usuario_info: z.number(),
                            dthr_saida: z.date().nullable(),
                            id_saida_categoria: z.number(),
                            id_pagamento_saida_tipo: z.number(),
                            id_saida_prioridade: z.number(),
                            id_periodicidade: z.number(),
                            valor: z.any(),
                            id_patrimonio_info: z.number().nullable(),
                            id_info_ativo: z.boolean(),
                            comprovante: z.number().nullable(),
                            id_saida: z.number(),
                        })
                    }),
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()
            const {nome, id_pagamento_saida_tipo,id_periodicidade,id_saida_categoria,id_saida_prioridade,id_usuario_info,valor,id_patrimonio_info, dthr_saida} = request.body

            const data : SaidaInfo = {
                dthr_cadastro: new Date(),
                id_usuario_info_cadastro: userId,
                id_pagamento_saida_tipo: id_pagamento_saida_tipo,
                id_periodicidade,
                id_saida_categoria,
                id_saida_prioridade,
                id_usuario_info,
                valor,
                id_ativo: true,
                id_info_ativo: true,
            }

            if(id_patrimonio_info){
                data.id_patrimonio_info = id_patrimonio_info
            }

            if(dthr_saida){
                data.dthr_saida = dthr_saida
            }

            const userFromId = await prisma.usuario_info.findUnique({
                include: {
                    usuario: true
                },
                where: {
                    id: userId
                }
            })

            if(!userFromId){
                throw new BadRequestError('Usuário não encontrado')
            }


            const result = await prisma.$transaction(async (tx) => {
                const createdSaida = await prisma.saida.create({
                    data: {
                        nome
                    }
                })

                if(!createdSaida){
                    throw new BadRequestError('Erro ao criar saída')
                }


                data.id_saida = createdSaida.id

                

                const createdSaidaInfo = await prisma.saida_info.create({
                    data: {
                        dthr_cadastro: data.dthr_cadastro,
                        id_ativo: data.id_ativo,
                        id_info_ativo: data.id_info_ativo,
                        valor: data.valor,
                        id_periodicidade: data.id_periodicidade,
                        id_pagamento_saida_tipo: data.id_pagamento_saida_tipo,
                        id_saida: data.id_saida,
                        id_saida_categoria: data.id_saida_categoria,
                        id_saida_prioridade: data.id_saida_prioridade,
                        id_usuario_info: data.id_usuario_info,
                        id_usuario_info_cadastro: data.id_usuario_info_cadastro
                    }
                })

                if(!createdSaidaInfo){
                    throw new BadRequestError('Erro ao criar Saida info')
                }


                try{
                    const {grupoFinanceiro, grupoFinanceiroUsuario} = await request.getMembership()

                    const usuarioAdmin = await prisma.grupo_financeiro_usuario.findFirst({
                        where:{
                            id_grupo_financeiro: grupoFinanceiro.id,
                            id_ativo: true,
                            role: 'ADMIN'
                        },
                        include: {
                            usuario_info_grupo_financeiro_usuario_id_usuario_infoTousuario_info: {
                                select: {
                                    id: true,
                                    email: true,
                                }
                            }
                        }
                    })

                    if(!usuarioAdmin){
                        throw new BadRequestError('Erro ao notificar admin')
                    }

                    const notificacao = await prisma.notificacao.create({
                        data: {
                            descricao: `O usuário ${userFromId.usuario.nome} cadastrou uma saída`,
                            dthr_cadastro: new Date(),
                            titulo: 'Saída registrada',
                            visto: false,
                            id_saida_info: createdSaidaInfo.id,
                            id_usuario_info: usuarioAdmin.usuario_info_grupo_financeiro_usuario_id_usuario_infoTousuario_info.id
                        }
                    })

                    if(!notificacao){
                        throw new BadRequestError('Erro ao notificar ADMIN')
                    }
                }catch(error){
                    return {createdSaida, createdSaidaInfo}
                }

                return {createdSaida, createdSaidaInfo}
            })

            return reply.status(200).send({
                saida: result.createdSaida,
                saidaInfo: result.createdSaidaInfo
            })

        }
    )
}