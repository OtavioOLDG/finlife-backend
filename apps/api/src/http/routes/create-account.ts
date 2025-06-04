
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import {z} from 'zod'
import { email } from 'zod/v4'
import { prisma } from '../../lib/prisma'
import { timeStamp } from 'console'
import { equal } from 'assert'
import { hash } from 'bcryptjs'

export async function createAccount(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post('/users', {
            schema:{
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
                    senha: z.string().min(6),
                })
            }
        },
        async(request, reply) => {
            const {cpf,dthr_nascimento,email,endereco,nome,senha,sobrenome} = request.body

            // const userWithSameEmail = await prisma.usuario_info.findFirst({
            //     where: {
            //         email
            //     }
            // })

            // if(userWithSameEmail){
            //     throw new Error('Usuário já cadastrado com o mesmo e-mail')
            // }

            const passwordHash = await hash(senha, 6)

            prisma.$transaction(async (tx) =>{
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

                if(!createdUser){
                    reply.status(404).send()
                }
            })

            

            return reply.status(201).send()
        }
    )
}