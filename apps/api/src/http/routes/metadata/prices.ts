
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'
import { string } from 'zod/v4'
import { Decimal } from '@prisma/client/runtime/library'
import dayjs from 'dayjs'

export async function metadata(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/metadata', {
            schema:{
                tags: ['Metadata'],
                summary: 'Informações para a dashboard',
                security: [{bearerAuth: []}],
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()

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

            

            let gastoTotal = 0
            let gastoDoMes = 0

            
            const gastosTotal = await prisma.saida_info.findMany({
                where: {
                    id_ativo: true,
                    id_info_ativo: true,
                    id_usuario_info: userId
                }
            })

            const inicioDoMes = dayjs().startOf('month').toDate();  // Ex: 2025-06-01T00:00:00.000Z
            const fimDoMes    = dayjs().endOf('month').toDate();    // Ex: 2025-06-30T23:59:59.999Z

            const gastosDoMes = await prisma.saida_info.findMany({
                where: {
                    id_ativo: true,
                    id_info_ativo: true,
                    id_usuario_info: userId,
                    dthr_saida: {
                        gte: inicioDoMes,
                        lte: fimDoMes,
                    },
                },
            });

            for(let i = 0; i< gastosTotal.length; i++){
                const aux = new Decimal(gastosTotal[i].valor)
                gastoTotal = gastoTotal + aux.toNumber()
            }

            for(let j = 0; j< gastosDoMes.length; j++){
                const aux = new Decimal(gastosDoMes[j].valor)
                gastoDoMes = gastoDoMes + aux.toNumber()
            }


            let entradasTotais = 0
            let entradasMes = 0

            const entTot = await prisma.entrada_info.findMany({
                where: {
                    id_ativo: true,
                    id_info_ativo: true,
                    id_usuario_info: userId
                }
            })

            const entMes = await prisma.entrada_info.findMany({
                where: {
                    id_ativo: true,
                    id_info_ativo: true,
                    id_usuario_info: userId,
                    dthr_entrada: {
                        gte: inicioDoMes,
                        lte: fimDoMes,
                    }
                }
            })


            for(let i = 0; i< entTot.length; i++){
                const aux = new Decimal(entTot[i].valor)
                entradasTotais = entradasTotais + aux.toNumber()
            }

            for(let i = 0; i< entMes.length; i++){
                const aux = new Decimal(entMes[i].valor)
                entradasMes = entradasMes + aux.toNumber()
            }
            


            let groupOutcomesTotal = 0
            let groupOutcomesMonth = 0

            let groupIncomesTotal = 0
            let groupIncomesMonth = 0

            try{    
                const {grupoFinanceiro, grupoFinanceiroUsuario} = await request.getMembership()
                
                if(grupoFinanceiroUsuario.role !== 'ADMIN'){
                    throw new BadRequestError('Você não possui autorização')
                }

                const entradasGrupo = await prisma.entrada_info.findMany({
                    where: {
                        id_ativo: true,
                        usuario_info_entrada_info_id_usuario_infoTousuario_info: {
                            id_ativo:true,
                            id_info_ativo: true,
                            grupo_financeiro: {
                                some: {
                                    id: grupoFinanceiro.id,
                                    grupo_financeiro_usuario: {
                                        some: {
                                            id_ativo: true,
                                            id_grupo_financeiro: grupoFinanceiro.id
                                        }
                                    }

                                }
                            }
                        }
                    }
                })

                const entradasGrupoMes = await prisma.entrada_info.findMany({
                    where: {
                        id_ativo: true,
                        dthr_entrada: {
                            gte: inicioDoMes,
                            lte: fimDoMes,
                        },
                        usuario_info_entrada_info_id_usuario_infoTousuario_info: {
                            id_ativo:true,
                            id_info_ativo: true,
                            grupo_financeiro: {
                                some: {
                                    id: grupoFinanceiro.id,
                                    grupo_financeiro_usuario: {
                                        some: {
                                            id_ativo: true,
                                            id_grupo_financeiro: grupoFinanceiro.id
                                        }
                                    }

                                }
                            }
                        }
                    }
                })


                for(let i = 0; i< entradasGrupo.length; i++){
                    const aux = new Decimal(entradasGrupo[i].valor)
                    groupIncomesTotal = groupIncomesTotal + aux.toNumber()
                }

                for(let i = 0; i< entradasGrupoMes.length; i++){
                    const aux = new Decimal(entradasGrupoMes[i].valor)
                    groupIncomesMonth = groupIncomesMonth + aux.toNumber()
                }
                


                const gastosGrupoT = await prisma.saida_info.findMany({
                    where:{
                        id_ativo: true,
                        usuario_info_saida_info_id_usuario_infoTousuario_info: {
                            id_ativo:true,
                            id_info_ativo: true,
                            grupo_financeiro: {
                                some: {
                                    id: grupoFinanceiro.id,
                                    grupo_financeiro_usuario: {
                                        some: {
                                            id_ativo: true,
                                            id_grupo_financeiro: grupoFinanceiro.id
                                        }
                                    }

                                }
                            }
                        }
                    }
                })

                const gastosGrupoMes = await prisma.saida_info.findMany({
                    where:{
                        id_ativo: true,
                        dthr_saida: {
                            gte: inicioDoMes,
                            lte: fimDoMes,
                        },
                        usuario_info_saida_info_id_usuario_infoTousuario_info: {
                            id_ativo:true,
                            id_info_ativo: true,
                            grupo_financeiro: {
                                some: {
                                    id: grupoFinanceiro.id,
                                    grupo_financeiro_usuario: {
                                        some: {
                                            id_ativo: true,
                                            id_grupo_financeiro: grupoFinanceiro.id
                                        }
                                    }

                                }
                            }
                        }
                    }
                })
                
                for(let o = 0; o< gastosGrupoT.length; o++){
                    const aux = new Decimal(gastosGrupoT[o].valor)
                    groupOutcomesTotal = groupOutcomesTotal + aux.toNumber()
                }

                for(let o = 0; o< gastosGrupoMes.length; o++){
                    const aux = new Decimal(gastosGrupoMes[o].valor)
                    groupOutcomesMonth = groupOutcomesMonth + aux.toNumber()
                }
            } catch(err){
                return reply.status(200).send({
                    gastoTotal,
                    gastoDoMes,
                    entradasTotais,
                    entradasMes,
                })
            }


            return reply.status(200).send({
                gastoTotal,
                gastoDoMes,
                entradasTotais,
                entradasMes,
                gastosTotaisDoGrupo: groupOutcomesTotal,
                gastosTotaisDoGrupoMes: groupOutcomesMonth,
                entradasTotaisGrupo: groupIncomesTotal,
                entradasTotaisGrupoMes: groupIncomesMonth
            })
        }
    )
}