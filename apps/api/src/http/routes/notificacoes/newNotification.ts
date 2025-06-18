
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../../../lib/prisma'
import { BadRequestError } from '../_errors/bad-request-error'
import { auth } from '../../middleware/auth'
import { base64 } from 'zod/v4'

interface Notificacao {
    id_usuario_info: number
    dthr_cadastro: Date
    titulo: string
    descricao: string
    visto: boolean
    id_saida_info?: number
    id_entrada_info?: number
}

export async function newNotification(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/notification/:idUser', {
            schema:{
                tags: ['Notificação'],
                summary: 'Criar notificação',
                security: [{bearerAuth: []}],
                params: z.object({
                    idUser: z.coerce.number()
                }),
                body: z.object({
                    titulo: z.string().min(1, {message : 'Insira um título válido'}),
                    descricao: z.string().min(1, {message : 'Insira uma descrição válida'}),
                    id_saida_info: z.coerce.number().nullish(),
                    id_entrada_info: z.coerce.number().nullish()
                }),
                response: {
                    200: z.object({
                        notificacao: z.object({
                            id: z.number(),
                            dthr_cadastro: z.date(),
                            id_usuario_info: z.number(),
                            titulo: z.string(),
                            descricao: z.string(),
                            id_saida_info: z.number().nullable(),
                            id_entrada_info: z.number().nullable(),
                            visto: z.boolean(),
                        }) 
                    }),
                }
            }
        },
        async(request, reply) => {
            const {idUser} = request.params
            const {descricao, titulo, id_entrada_info, id_saida_info} = request.body

            const userFromId = await prisma.usuario_info.findUnique({
                where:{
                    id: idUser
                }
            })

            if(!userFromId){
                throw new BadRequestError('Usuário não encontrado')
            }

            const notificacao : Notificacao = {
                descricao,
                id_usuario_info: idUser,
                titulo,
                dthr_cadastro: new Date(),
                visto: false
            }

            
            if(id_entrada_info){
                const entradaInfoFromId = await prisma.entrada_info.findUnique({
                    where: {
                        id: id_entrada_info
                    }
                })

                if(!entradaInfoFromId){
                    throw new BadRequestError('Erro ao procurar dados de entrada')
                }

                notificacao.id_entrada_info = id_entrada_info
            }

            if(id_saida_info){
                const saidaInfoFromId = await prisma.saida_info.findUnique({
                    where: {
                        id: id_saida_info
                    }
                })

                if(!saidaInfoFromId){
                    throw new BadRequestError('Erro ao procurar dados de saída')
                }

                notificacao.id_saida_info = id_saida_info
            }

            const createdNotification = await prisma.notificacao.create({
                data: notificacao
            })

            if(!createdNotification){
                throw new BadRequestError('Erro ao criar notificação')
            }

            reply.status(200).send({notificacao: createdNotification})
        }
    )
}