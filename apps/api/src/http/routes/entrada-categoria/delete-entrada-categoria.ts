import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { auth } from "../../middleware/auth";
import { prisma } from "../../../lib/prisma";
import { BadRequestError } from "../_errors/bad-request-error";
import type { entrada } from "../../../generated/prisma";
import { boolean } from "zod/v4";

interface Entrada {
    nome?: string
    id_ativo?: boolean
    id_patrimonial?: boolean
    id_grupo_financeiro?: number
}

export async function deleteEntradaCategoria(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/entrada/categoria/:id', {
            schema: {
                tags: ['Entrada Categoria'],
                summary: 'Usuário remove uma categoria de entrada',
                security: [{bearerAuth: []}],
                params: z.object({
                    id: z.coerce.number()
                }),
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
                    id: userId,
                }
            })

            if(!user){
                throw new BadRequestError('Erro ao buscar usuário criador da categoria')
            }

            const {id} = request.params

            const entradaFound = await prisma.entrada_categoria.findFirst({
                where: {
                    id,
                    id_ativo: true,
                    id_usuario_info_cadastro: userId
                }
            })

            if(!entradaFound){
                throw new BadRequestError('Entrada não encontrada')
            }

            const deleteEntradaCategoria = await prisma.entrada_categoria.update({
                where: {
                    id
                },
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
                    id_ativo: false,
                }
            })

            return reply.status(201).send(deleteEntradaCategoria)
        }
    )
}