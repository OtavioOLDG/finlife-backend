
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { Decimal } from '../../../generated/prisma/runtime/library'
import { auth } from '../../middleware/auth'
import { string } from 'zod/v4'

interface EntradaInfo{
    dthr_cadastro: Date,
    dthr_entrada?: Date,
    id_usuario_info_cadastro: number,
    id_info_ativo: boolean,
    id_ativo     : boolean,
    id_entrada               : number,
    id_entrada_categoria     : number,
    id_pagamento_entrada_tipo: number,
    id_usuario_info          : number,
    id_periodicidade         : number,
    valor : any,
    id_patrimonio_info?: number,
    comprovante       ?: number,
    patrimonio_infoId ?: number,
}

export async function createEntrada(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/entrada', {
            schema:{
                tags: ['Entrada'],
                summary: 'Cadastra uma nova entrada',
                security: [{bearerAuth: []}],
                body: z.object({
                    nome: z.string(),
                    dthr_entrada: z.date().nullish(),
                    id_entrada_categoria     : z.number(),
                    id_pagamento_entrada_tipo: z.number(),
                    id_usuario_info          : z.number(),
                    id_periodicidade         : z.number(),
                    valor : z.any(),
                    id_patrimonio_info: z.number().nullish(),
                    comprovante: z.number().nullish(),
                    patrimonio_infoId: z.number().nullish(),
                }),
                response: {
                    201: z.object({
                        entrada: z.object({
                            id: z.number(),
                            nome: z.string(),
                        }),
                        entradaInfo: z.object({
                            id: z.number(),
                            id_ativo: z.boolean(),
                            dthr_cadastro: z.date(),
                            id_usuario_info_cadastro: z.number(),
                            id_usuario_info: z.number(),
                            dthr_entrada: z.date().nullable(),
                            id_entrada_categoria: z.number(),
                            id_pagamento_entrada_tipo: z.number(),
                            id_periodicidade: z.number(),
                            valor: z.any(),
                            id_patrimonio_info: z.number().nullable(),
                            comprovante: z.number().nullable(),
                            patrimonio_infoId: z.number().nullable(),
                            id_info_ativo: z.boolean(),
                            id_entrada: z.number(),
                        })
                    }),
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()
            const {nome,id_periodicidade,id_usuario_info,valor,id_patrimonio_info,patrimonio_infoId,id_entrada_categoria,id_pagamento_entrada_tipo,comprovante,dthr_entrada} = request.body

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
                const createdEntrada = await prisma.entrada.create({
                    data: {
                        nome
                    }
                })

                if(!createdEntrada){
                    throw new BadRequestError('Erro ao criar saída')
                }

                const data : EntradaInfo = {
                    dthr_cadastro: new Date(),
                    id_usuario_info_cadastro: userId,
                    id_usuario_info,
                    valor,
                    id_ativo: true,
                    id_info_ativo: true,
                    id_entrada: createdEntrada.id,
                    id_entrada_categoria: id_entrada_categoria,
                    id_pagamento_entrada_tipo: id_pagamento_entrada_tipo,
                    id_periodicidade: id_periodicidade,
                }

                if(comprovante){
                    data.comprovante = comprovante
                }

                if(id_patrimonio_info){
                    data.id_patrimonio_info = id_patrimonio_info
                }

                if(patrimonio_infoId){
                    data.patrimonio_infoId = patrimonio_infoId
                }

                if(dthr_entrada){
                    data.dthr_entrada = dthr_entrada
                }


                const createdEntradaInfo = await prisma.entrada_info.create({
                    data: data
                })

                if(!createdEntradaInfo){
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
                            descricao: `O usuário ${userFromId.usuario.nome} cadastrou uma entrada`,
                            dthr_cadastro: new Date(),
                            titulo: 'Entrada registrada',
                            visto: false,
                            id_entrada_info: createdEntradaInfo.id,
                            id_usuario_info: usuarioAdmin.usuario_info_grupo_financeiro_usuario_id_usuario_infoTousuario_info.id
                        }
                    })

                    if(!notificacao){
                        throw new BadRequestError('Erro ao notificar ADMIN')
                    }
                }catch(error){
                    return {createdEntrada, createdEntradaInfo}
                }

                return {createdEntrada, createdEntradaInfo}
            })

            return reply.status(200).send({
                entrada: result.createdEntrada,
                entradaInfo: result.createdEntradaInfo
            })

        }
    )
}