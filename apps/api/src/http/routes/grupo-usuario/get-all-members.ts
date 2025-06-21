
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { Decimal } from '../../../generated/prisma/runtime/library'
import { auth } from '../../middleware/auth'
import { userSchema } from '@finlife/auth/src/models/user'
import { defineAbilityFor, roleSchema } from '@finlife/auth'
import { getAllMembersId } from '../grupo-usuario/grupo-usuario-functions'
import type { patrimonio_info } from '../../../generated/prisma'

export async function getAllMembersGroup(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/grupo-financeiro/membros', {
            schema:{
                tags: ['Grupo Financeiro Usuario'],
                summary: 'Pega todos os usuários do grupo',
                security: [{bearerAuth: []}],
                response: {
                    201: z.object({
                        membros: z.array(z.object({
                            usuario_info_grupo_financeiro_usuario_id_usuario_infoTousuario_info: z.object({
                            email: z.string().email(),
                            usuario: z.object({
                                nome: z.string(),
                                sobrenome: z.string(),
                            }),
                            }),
                            id: z.number(),
                            id_ativo: z.boolean(),
                            dthr_cadastro: z.date(),
                            role: roleSchema,
                            id_usuario_info_cadastro: z.number(),
                            id_usuario_info: z.number(),
                            id_grupo_financeiro: z.number(),
                        })
                        ),
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

            const {grupoFinanceiro, grupoFinanceiroUsuario} = await request.getMembership()
            
            const authUser = userSchema.parse({
                id: userId,
                role: grupoFinanceiroUsuario.role
            })

            const auth = defineAbilityFor(authUser)

            if(auth.cannot('get', 'Member')){
                throw new BadRequestError('Você não tem permissão para realizar esta ação')
            }

            if(!grupoFinanceiro || !grupoFinanceiroUsuario){
                throw new BadRequestError('Erro ao procurar grupo financeiro')
            }

            const grupoMembros = await prisma.grupo_financeiro_usuario.findMany({
                where:{
                    id_ativo: true,
                    id_grupo_financeiro: grupoFinanceiro.id
                },
                include: {
                    usuario_info_grupo_financeiro_usuario_id_usuario_infoTousuario_info:{
                        select: {
                            email: true,
                            usuario: {
                                select: {
                                    nome: true,
                                    sobrenome: true
                                }
                            }
                        }
                    }
                }
            })

            if(!grupoMembros){
                throw new BadRequestError('Patrimônios não encontrados')
            }

            return reply.status(200).send({
                membros: grupoMembros
            })

        }
    )
}