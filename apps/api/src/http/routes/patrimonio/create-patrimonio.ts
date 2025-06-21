
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { Decimal } from '../../../generated/prisma/runtime/library'
import { auth } from '../../middleware/auth'

export async function createEquity(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/patrimonio', {
            schema:{
                tags: ['Patrimônio'],
                summary: 'Cadastra novo patrimônio',
                security: [{bearerAuth: []}],
                body: z.object({
                    nome: z.string().nonempty(),
                    valor_aquisicao: z.coerce.number(),
                    valor_mercado: z.coerce.number()
                }),
                response: {
                    201: z.object({
                        patrimonioCriado: z.object({
                            id: z.number(),
                            nome: z.string(),
                            valor_aquisicao: z.any(),
                        }),
                        pratrimonioInfoCriado: z.object({
                            id: z.number(),
                            dthr_cadastro: z.date(),
                            id_ativo: z.boolean(),
                            id_info_ativo: z.boolean(),
                            id_usuario_info_cadastro: z.number(),
                            valor_mercado: z.any(),
                            id_patrimonio: z.number(),
                        }),
                        valorizacaoEmReais: z.string(),
                        valorizacaoEmPorCentagem: z.string()
                    }),
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()
            const {nome, valor_aquisicao, valor_mercado} = request.body


            const userFromId = await prisma.usuario_info.findUnique({
                include:{
                    usuario : true
                },
                where: {
                    id: userId
                }
            })

            if(!userFromId){
                throw new BadRequestError('Usuário não encontrado')
            }

            const result = await prisma.$transaction(async (tx) =>{
                const createdPatrimonio = await tx.patrimonio.create({
                    data: {
                        nome: nome,
                        valor_aquisicao: valor_aquisicao
                    }
                }) 

                const createdPatrimonioInfo = await tx.patrimonio_info.create({
                    data: {
                        dthr_cadastro: new Date(),
                        id_ativo: true,
                        id_info_ativo: true,
                        valor_mercado: valor_mercado,
                        id_patrimonio: createdPatrimonio.id,
                        id_usuario_info_cadastro: userId
                    }
                })

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
                            descricao: `O usuário ${userFromId.usuario.nome} cadastrou o patrimônio ${createdPatrimonio.nome}`,
                            dthr_cadastro: new Date(),
                            titulo: 'Saída registrada',
                            visto: false,
                            patrimonio_infoId: createdPatrimonioInfo.id,
                            id_usuario_info: usuarioAdmin.usuario_info_grupo_financeiro_usuario_id_usuario_infoTousuario_info.id
                        }
                    })

                    if(!notificacao){
                        throw new BadRequestError('Erro ao notificar ADMIN')
                    }
                }catch(err){
                    return { createdPatrimonio, createdPatrimonioInfo };
                }  

                return { createdPatrimonio, createdPatrimonioInfo };
            })


            if(!result.createdPatrimonio || !result.createdPatrimonioInfo){
                throw new BadRequestError('Erro ao criar patrimônio')
            }

            const valorMercado: Decimal = result.createdPatrimonioInfo.valor_mercado
            const valorAquisicao: Decimal = result.createdPatrimonio.valor_aquisicao

            const valorDaValorização = valorMercado.toNumber() - valorAquisicao.toNumber()

            const valorizacaoEmPorCento = (valorDaValorização/valorAquisicao.toNumber()) * 100

            return reply.status(200).send({
                patrimonioCriado: result.createdPatrimonio,
                pratrimonioInfoCriado: result.createdPatrimonioInfo,
                valorizacaoEmReais: `Seu patrimônio valorizou R$ ${valorDaValorização}`,
                valorizacaoEmPorCentagem: `Seu patrimônio valorizou ${valorizacaoEmPorCento}%`
            })

        }
    )
}