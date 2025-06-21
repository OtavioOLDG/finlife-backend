import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { auth } from "../../middleware/auth";
import { prisma } from "../../../lib/prisma";
import { BadRequestError } from "../_errors/bad-request-error";


interface Saida {
    id_patrimonial: boolean,
    nome: string,
    id_grupo_financeiro?: number
}

export async function updateSaidaCategoria(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).patch('/saida/categorias/:id', {
            schema: {
                tags: ['Saída Categoria'],
                summary: 'Usuário cria uma categoria de saída',
                security: [{bearerAuth: []}],
                params: z.object({
                    id: z.coerce.number()
                }),                
                body: z.object({
                    nome: z.string(),
                    id_patrimonial: z.boolean(),
                    vincular_grupo: z.boolean(),
                },),
                response: {
                    201: z.object({
                        id: z.number(),
                        nome: z.string(),
                        dthr_cadastro: z.date(),
                        id_ativo: z.boolean(),
                        id_patrimonial: z.boolean(),
                        id_usuario_info_cadastro: z.number().nullable(),
                        id_grupo_financeiro: z.number().nullable()
                    }),
                }
            }
        },
        async (request, reply) => {
            const userId = await request.getCurrentUserId()
            const user = await prisma.usuario_info.findUnique({
                where: {
                    id: userId
                }
            })

            if(!user){
                throw new BadRequestError('Erro ao buscar usuário criador da categoria')
            }

            const {id} = request.params
            const {nome,vincular_grupo} = request.body

            const data : Saida = {
                id_patrimonial: false,
                nome: nome,
            }

            if(vincular_grupo){
                const {grupoFinanceiro} = await request.getMembership()
                data.id_grupo_financeiro = grupoFinanceiro.id
            } 

            const updateSaidaCategoria = await prisma.saida_categoria.update({
                select: {
                    id: true,
                    id_grupo_financeiro: true,
                    id_ativo: true,
                    id_patrimonial: true,
                    id_usuario_info_cadastro: true,
                    nome: true,
                    dthr_cadastro: true,
                },
                where: {
                    id,
                    id_ativo: true,
                    id_usuario_info_cadastro: userId
                },
                data: data
            })

            if(!updateSaidaCategoria){
                throw new BadRequestError('Erro ao atualizar categoria')
            }

            return reply.status(201).send(updateSaidaCategoria)
        }
    )
}