
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import {z} from 'zod'
import { email } from 'zod/v4'
import { prisma } from '../../../lib/prisma'
import { timeStamp } from 'console'
import { equal } from 'assert'
import { hash } from 'bcryptjs'
import { BadRequestError } from '../_errors/bad-request-error'

export async function createAccount(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post('/users', {
            schema:{
                tags: ['Usuários'],
                summary: 'Criar novo usuário',
                body: z.object({
                    nome: z.string().nonempty(),
                    sobrenome: z.string().nonempty(),
                    cpf: z.string().nonempty(),
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
                        createdUser: z.object({
                            nome: z.string(),
                            sobrenome: z.string(),
                            cpf: z.string(),
                            dthr_nascimento: z.preprocess((arg) => {
                                    if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
                                },
                                z.date()),
                            id: z.number(),
                        }),
                        createdUserInfo: z.object({
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
            

            const {cpf,dthr_nascimento,email,endereco,nome,senha,sobrenome} = request.body

            if(senha.length < 6 ){
                throw new BadRequestError('Senha muito curta')
            }

            const userWithSameEmail = await prisma.usuario_info.findFirst({
                where: {
                    email
                }
            })

            if(userWithSameEmail){
                throw new BadRequestError('Usuário já cadastrado com o mesmo e-mail')
            }

            const userWithSameCPF = await prisma.usuario.findFirst({
                where: {
                    cpf
                }
            })

            if(userWithSameCPF){
                throw new BadRequestError('Usuário já cadastrado com o mesmo CPF')
            }

            const passwordHash = await hash(senha, 6)

            const result = await prisma.$transaction(async (tx) =>{
                const createdUser = await tx.usuario.create({
                    data: {
                        nome: nome,
                        sobrenome: sobrenome,
                        cpf: cpf,
                        dthr_nascimento: dthr_nascimento
                    }
                }) 
                const createdUserInfo = await tx.usuario_info.create({
                    data: {
                        endereco: endereco,
                        email: email,
                        senha: passwordHash,
                        id_usuario: createdUser.id,
                        id_ativo: true,
                        id_info_ativo: true
                    }
                })

                return { createdUser, createdUserInfo };
            })

            if (!result.createdUser || !result.createdUserInfo) {
                reply.status(404).send();
            }
            

            return reply.status(201).send(result)
        }
    )
}