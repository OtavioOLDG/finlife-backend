
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { Decimal } from '../../../generated/prisma/runtime/library'
import { auth } from '../../middleware/auth'
import { string } from 'zod/v4'

export async function getAllSaidaGroup(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/saidas/grupo', {
            schema:{
                tags: ['Saída'],
                summary: 'Pega todas as saídas do grupo',
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

            const {grupoFinanceiro, grupoFinanceiroUsuario} = await request.getMembership()
            
            if(grupoFinanceiroUsuario.role !== 'ADMIN'){
                throw new BadRequestError('Você não possui autorização')
            }

            const foundSaidas = await prisma.saida_info.findMany({
                include: {
                    usuario_info_saida_info_id_usuario_info_cadastroTousuario_info: {
                        select: {
                            usuario : {
                                select: {
                                    nome: true,
                                    cpf: true,
                                }
                            },
                            email: true,
                            id: true,
                        }
                    },
                    saida:{
                        select:{
                            nome: true
                        }
                    },
                    patrimonio:{
                        select:{
                            patrimonio:{
                                select:{
                                    nome: true
                                }
                            }
                        }
                    }
                },
                where: {
                    id_ativo: true,
                    usuario_info_saida_info_id_usuario_info_cadastroTousuario_info:{
                        grupo_financeiro_usuario_grupo_financeiro_usuario_id_usuario_infoTousuario_info:{
                            some: {
                                id_grupo_financeiro: grupoFinanceiro.id
                            }
                        }
                    }
                }
            })


            return reply.status(200).send({
                saidas: foundSaidas
            })

        }
    )
}