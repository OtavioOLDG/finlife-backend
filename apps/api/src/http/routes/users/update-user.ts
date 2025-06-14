
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import {z} from 'zod'
import { email } from 'zod/v4'
import { prisma } from '../../../lib/prisma'
import { timeStamp } from 'console'
import { equal } from 'assert'
import { compare, hash } from 'bcryptjs'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'

export async function updateUser(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).patch('/users/update', {
            schema:{
                tags: ['Usuários'],
                summary: 'Atualizar usuário existente',
                security: [{bearerAuth: []}],
                body: z.object({
                    nome: z.string().nonempty(),
                    sobrenome: z.string().nonempty(),
                    dthr_nascimento: z.preprocess((arg) => {
                            if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
                        },
                        z.date()),
                    endereco: z.string(),
                    email: z.string().email(),
                    senha: z.string(),
                }),
                response: {
                    201: z.object({
                        updatedUser: z.object({
                            nome: z.string(),
                            sobrenome: z.string(),
                            cpf: z.string(),
                            dthr_nascimento: z.preprocess((arg) => {
                                    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
                                },
                                z.date()),
                            id: z.number(),
                        }),
                        updatedUserInfo: z.object({
                            endereco: z.string(),
                            email: z.string(),
                            id: z.number(),
                            dthr_cadastro: z.preprocess((arg) => {
                                    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
                                },
                                z.date()),
                            id_ativo: z.boolean(),
                            id_info_ativo: z.boolean(),
                            id_usuario: z.number(),
                        })
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

            const emailReserva = userFromId?.email

            if(!emailReserva){
                throw new BadRequestError('Erro')
            }

            if(!userFromId){
                throw new BadRequestError('Falha ao procurar usuário')
            }

            const {dthr_nascimento,email,endereco,nome,senha,sobrenome} = request.body

            if(senha.length < 6 ){
                throw new BadRequestError('Senha muito curta')
            }

            const userWithSameEmail = await prisma.usuario_info.findFirst({
                where: {
                    email,
                    id_ativo: true
                }
            })

            if(userWithSameEmail){
                throw new BadRequestError('Usuário já cadastrado com o mesmo e-mail')
            }

            const isPasswordCorrect = await compare(senha, userFromId?.senha)

            if(isPasswordCorrect){
                throw new BadRequestError('Forneça outra senha')
            }

            const passwordHash = await hash(senha, 6)

            const result = await prisma.$transaction(async (tx) =>{
                const updatedUser = await tx.usuario.update({
                    where:{
                        id: userFromId.id_usuario
                    },
                    data: {
                        nome: nome,
                        sobrenome: sobrenome,
                        dthr_nascimento: dthr_nascimento
                    }
                }) 

                const createdUserInfo = await tx.usuario_info.create({
                    data: {
                        endereco: userFromId.endereco,
                        email: 'replace@test.com',
                        senha: userFromId.senha,
                        id_usuario: userFromId.id_usuario,
                        id_ativo: false,
                        id_info_ativo: false,
                    },
                }) 


                if(!createdUserInfo){
                    throw new BadRequestError('Erro ao atualizar usuário')
                }

                const updatedUserInfo = await tx.usuario_info.update({
                    where:{
                        id: userId
                    },
                    data: {
                        endereco: endereco,
                        email: email,
                        senha: passwordHash,
                        id_usuario: updatedUser.id,
                        id_ativo: true,
                        id_info_ativo: true,
                    },
                })


                // if(updatedUserInfo.email !== emailReserva){
                //     await prisma.usuario_info.update({
                //         where: {
                //             id: createdUserInfo.id
                //         },
                //         data :{
                //             email: emailReserva
                //         }
                //     })
                // }


                return { updatedUser, updatedUserInfo };
            })

            if (!result.updatedUser || !result.updatedUserInfo) {
                throw new BadRequestError('Erro ao atualizar')
            }
            

            return reply.status(201).send(result)
        }
    )
}