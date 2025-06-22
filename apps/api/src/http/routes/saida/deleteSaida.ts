
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { Decimal } from '../../../generated/prisma/runtime/library'
import { auth } from '../../middleware/auth'
import { string } from 'zod/v4'

export async function deleteSaida(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/saida/:id', {
            schema:{
                tags: ['Saída'],
                summary: 'Deleta uma saída',
                security: [{bearerAuth: []}],
                params: z.object({
                    id: z.coerce.number()
                }),
                response: {
                    201: z.object({
                        message: z.string()
                    })
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()
            const {id} = request.params

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

            const saidaFound = await prisma.saida_info.findFirst({
                where: {
                    id: id,
                    id_ativo: true,
                    id_info_ativo: true,
                    OR: [
                        { id_usuario_info_cadastro: userId },
                        { id_usuario_info: userId },
                    ],
                }
            })

            if(!saidaFound){
                throw new BadRequestError('Erro ao achar saída')
            }


            const result = await prisma.$transaction(async (tx) => {
                const createdSaidaInfo = await prisma.saida_info.update({
                    where:{
                        id
                    },                    
                    data: {
                        id_ativo: false,
                        id_info_ativo: false
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
                            descricao: `O usuário ${userFromId.usuario.nome} deletou uma saída`,
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
                    return {createdSaidaInfo}
                }

                return {createdSaidaInfo}
            })

            return reply.status(200).send({
                message: 'Saída deletada'
            })

        }
    )
}