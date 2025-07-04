
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'
import { defineAbilityFor, roleSchema } from '@finlife/auth'
import { userSchema } from '@finlife/auth/src/models/user'

export async function createInviteEmail(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/grupo-financeiro/convite-por-email', {
            schema:{
                tags: ['Convite'],
                summary: 'Convidar usuário para organização',
                security: [{bearerAuth: []}],
                body: z.object({
                    cargo: roleSchema,
                    usuarioDestinoEmail: z.string().email()
                }),
                response: {
                    200: z.object({
                        cargo: roleSchema,
                        id: z.number(),
                        grupo_financeiro_usuarioId: z.number(),
                        usuarioDestinoId: z.number(),
                        grupoFinanceiroId: z.number(),
                    }),
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()
            const {cargo, usuarioDestinoEmail} = request.body

            const usuarioDestino = await prisma.usuario_info.findFirst({
                where:{
                    email: usuarioDestinoEmail,
                    id_ativo: true,
                    id_info_ativo:true
                }
            })

            if(!usuarioDestino){
                throw new BadRequestError('Erro ao buscar usuário por email')
            }

            const {grupoFinanceiro, grupoFinanceiroUsuario} = await request.getMembership()

            const authUser = userSchema.parse({
                id: userId,
                role: grupoFinanceiroUsuario.role
            })

            const auth = defineAbilityFor(authUser)

            if(auth.cannot('create', 'Convite')){
                throw new BadRequestError('Você não tem permissão para realizar esta ação')
            }

            if(!grupoFinanceiro || !grupoFinanceiroUsuario){
                throw new BadRequestError('Erro ao procurar grupo financeiro')
            }

            const conviteAchado = await prisma.convite.findFirst({
                where: {
                    grupoFinanceiroId: grupoFinanceiro.id,
                    usuarioDestinoId: usuarioDestino.id,
                    pendente: true
                }
            })

            if(conviteAchado){
                throw new BadRequestError('Convite já enviado para esta pessoa')
            }

            const memboJaExistente = await prisma.grupo_financeiro_usuario.findFirst({
                where: {
                    id_usuario_info: usuarioDestino.id,
                    id_grupo_financeiro: grupoFinanceiro.id,
                    id_ativo: true
                }
            })

            if(memboJaExistente){
                throw new BadRequestError('O usuário já faz parte da organização')
            }
            
            const conviteCriado = await prisma.convite.create({
                data: {
                    cargo: roleSchema.parse(cargo),
                    grupo_financeiro_usuarioId: grupoFinanceiroUsuario.id,  // o id da tabela grupo_financeiro_usuario  
                    usuarioDestinoId: usuarioDestino.id,      // o id da tabela usuario_info
                    grupoFinanceiroId: grupoFinanceiro.id,
                    pendente: true,
                    recusado: true,
                }
            })
            

            if(!conviteCriado){
                throw new BadRequestError('Usuário não encontrado')
            }

            reply.status(200).send(conviteCriado)
        }
    )
}