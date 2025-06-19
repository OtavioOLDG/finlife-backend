import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { auth } from "../../middleware/auth";
import { prisma } from "../../../lib/prisma";
import { BadRequestError } from "../_errors/bad-request-error";

export async function createEntradaCategoria(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).post('/entrada/categorias', {
            schema: {
                tags: ['Entrada Categoria'],
                summary: 'Usuário cria uma categoria de entrada',
                security: [{bearerAuth: []}],
                body: z.object({
                    nome: z.string(),
                    id_grupo_financeiro: z.coerce.number().nullish(),
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

            const {nome} = request.body

            const createdEntradaCategoria = await prisma.entrada_categoria.create({
                select: {
                    id: true,
                    id_grupo_financeiro: true,
                    id_ativo: true,
                    id_patrimonial: true,
                    id_usuario_info_cadastro: true,
                    nome: true,
                    dthr_cadastro: true,
                },
                data: {
                    id_ativo: true,
                    id_patrimonial: false,
                    id_usuario_info_cadastro: user.id,
                    nome: nome,
                    dthr_cadastro: new Date(),
                    publico: false
                }
            })

            return reply.status(201).send(createdEntradaCategoria)
        }
    )
}