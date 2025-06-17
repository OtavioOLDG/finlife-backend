
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { compare } from 'bcryptjs'
import { BadRequestError } from '../_errors/bad-request-error'

export async function loginAccount(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post('/users/login', {
            schema:{
                tags: ['Usuários'],
                summary: 'Fazer login do usuário',
                body: z.object({
                    email: z.string().email(),
                    senha: z.string()
                }),
                response: {
                    201: z.object({
                        token: z.string()
                    })
                }
            }
        },
        async(request, reply) => {
            const {email, senha } = request.body

            const userFromEmail = await prisma.usuario_info.findFirst({
                where: { 
                    email,
                    id_ativo: true,
                    id_info_ativo:true
                 }
            })

            console.log(userFromEmail)

            if(!userFromEmail){
                throw new BadRequestError('Credenciais inválidas')
            }

            const isPasswordCorrect = await compare(senha, userFromEmail.senha)

            if(!isPasswordCorrect){
                throw new BadRequestError('Credenciais inválidas')
            }

            const token = await reply.jwtSign({
                sub: userFromEmail.id
            }, {
                sign : {
                    expiresIn: '10m'
                }
            })

            return reply.status(200).send({ token })
        }
    )
}