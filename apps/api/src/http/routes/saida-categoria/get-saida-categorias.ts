import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { auth } from "../../middleware/auth";
import { prisma } from "../../../lib/prisma";
import { BadRequestError } from "../_errors/bad-request-error";

export async function getSaidaCategoria(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/saida/categorias', {
            schema: {
                tags: ['Saída Categoria'],
                summary: 'Usuário pega todoas as categorias de saída',
                security: [{bearerAuth: []}],
                response: {
                    201: z.array(z.object({
                        id: z.number(),
                        nome: z.string(),
                        dthr_cadastro: z.date(),
                        id_ativo: z.boolean(),
                        id_patrimonial: z.boolean(),
                        id_usuario_info_cadastro: z.number().nullable(),
                        id_grupo_financeiro: z.number().nullable()
                    })),
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

            const createdSaidaCategoria = await prisma.saida_categoria.findMany({
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
                    id_ativo: true,
                    id_usuario_info_cadastro : userId
                }
            })

            return reply.status(201).send(createdSaidaCategoria)
        }
    )
}