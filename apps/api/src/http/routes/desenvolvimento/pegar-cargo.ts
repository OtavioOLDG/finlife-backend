
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { auth } from '../../middleware/auth'
import { prisma } from '../../../lib/prisma'
import { roleSchema } from '@finlife/auth'
import { BadRequestError } from '../_errors/bad-request-error'
import { Role } from '../../../generated/prisma'

export async function pegarCargo(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/dev/cargo', {
            schema:{
                tags: ['Desenvolvimento'],
                summary: 'Pegar token',
                security: [{bearerAuth: []}],
                response: {
                    201: z.object({
                        role: roleSchema
                    })
                }
            }
        },
        async(request, reply) => {
            const userId = await request.getCurrentUserId()

            const membroEmOrganizacoes = await prisma.grupo_financeiro_usuario.findMany({
                where: {
                    id_usuario_info: userId
                }
            })

            // Base para autenticação
            // const authUser = userSchema.parse({
            //     id: userId,
            //     role: Role.CONVIDADO
            // })

            // console.log(authUser)

            // if(!authUser){
            //     throw new BadRequestError('aa')
            // }
            // const teste = defineAbilityFor(authUser)
            // console.log("Passou aqui 1 \n\n")
            // console.log(teste)

            // console.log(teste.can('create', 'Invite'))

            if(!membroEmOrganizacoes){
                
                // const {can} = defineAbilityFor(authUser)

                // if(can('manage','all')){
                //     return reply.status(200).send({role: Role.CONVIDADO})
                // }

                throw new BadRequestError('Erro ao procurar cargos')
            }
            if(membroEmOrganizacoes.length <= 0){
                return reply.status(200).send({role: Role.CONVIDADO})
            }

            for(let i = 0; i < membroEmOrganizacoes.length; i++){
                if(membroEmOrganizacoes[i].role = Role.ADMIN){
                    // const authUser = userSchema.parse({
                    //     id: userId,
                    //     role: Role.ADMIN
                    // })
                    // const {can} = defineAbilityFor(authUser)

                    // if(can('manage','all')){
                    //     return reply.status(200).send({role: Role.ADMIN})
                    // }

                    return reply.status(200).send({role: Role.ADMIN})
                }
            }


            // const authUser = userSchema.parse({
            //     id: userId,
            //     role: Role.MEMBRO
            // })
            // const {can} = defineAbilityFor(authUser)

            // if(can('manage','all')){
            //     return reply.status(200).send({role: Role.MEMBRO})
            // }
            return reply.status(200).send({role: Role.MEMBRO})
        }
    )
}