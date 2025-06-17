
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { compare, hash } from 'bcryptjs'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'

interface UserMaster{
    nome?: string
    sobrenome?: string
    dthr_nascimento?: Date
}

interface UserIterface{
    id_ativo: boolean
    dthr_cadastro: Date
    endereco?: string
    email?: string
    senha?: string
    id_info_ativo: boolean
    id_usuario: number
}

export async function updateUser(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).patch('/users/update', {
            schema:{
                tags: ['Usuários'],
                summary: 'Atualizar usuário existente',
                security: [{bearerAuth: []}],
                body: z.object({
                    nome: z.string().nullish(),
                    sobrenome: z.string().nullish(),
                    dthr_nascimento: z.preprocess((arg) => {
                            if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
                        },
                        z.date()).nullish(),
                    endereco: z.string().nullish(),
                    email: z.string().email().nullish(),
                    senha: z.string().nullish(),
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

            if(
                !dthr_nascimento &&
                !email &&
                !endereco &&
                !nome &&
                !senha &&
                !sobrenome
            ){
                throw new BadRequestError('Ao menos um dos campos deve ser fornecido para realizar esta ação')
            }

            const userFromUpdateInformations : UserIterface = {id_ativo: false,
                id_info_ativo: false,
                id_usuario: userFromId.id_usuario,
                dthr_cadastro: new Date()
            }

            if(email) {
                const userWithSameEmail = await prisma.usuario_info.findFirst({
                    where: {
                        email,
                        id_ativo: true
                    }
                })

                if(userWithSameEmail && email !== userFromId.email){
                    throw new BadRequestError('Usuário já cadastrado com o mesmo e-mail')
                }
                userFromUpdateInformations.email = email
            }

            if(endereco) {
                userFromUpdateInformations.endereco = endereco
            }

            if(senha) {
                if(senha.length < 6){
                    throw new BadRequestError('Senha muito curta')
                }

                const isPasswordCorrect = await compare(senha, userFromId?.senha)

                if(isPasswordCorrect){
                    throw new BadRequestError('Forneça outra senha')
                }

                const passwordHash = await hash(senha, 6)
                userFromUpdateInformations.senha = passwordHash
            }

            console.log(userFromUpdateInformations)

            const userMaster : UserMaster = {}

            if(dthr_nascimento){
                userMaster.dthr_nascimento = dthr_nascimento
            }

            if(nome){
                userMaster.nome = nome
            }

            if(sobrenome){
                userMaster.sobrenome = sobrenome
            }

            const result = await prisma.$transaction(async (tx) =>{
                const updatedUser = await tx.usuario.update({
                    where:{
                        id: userFromId.id_usuario
                    },
                    data: userMaster
                }) 

                const createdUserInfo = await tx.usuario_info.create({
                    data: {
                        endereco: userFromId.endereco,
                        email: userFromId.email,
                        senha: userFromId.senha,
                        id_usuario: userFromId.id_usuario,
                        id_ativo: false,
                        id_info_ativo: false,
                    },
                }) 

                console.log(createdUserInfo)

                if(!createdUserInfo){
                    throw new BadRequestError('Erro ao atualizar usuário')
                }

                const updatedUserInfo = await tx.usuario_info.update({
                    where:{
                        id: userId
                    },
                    data: userFromUpdateInformations,
                })

                return { updatedUser, updatedUserInfo };
            })

            if (!result.updatedUser || !result.updatedUserInfo) {
                throw new BadRequestError('Erro ao atualizar')
            }
            

            return reply.status(201).send(result)
        }
    )
}