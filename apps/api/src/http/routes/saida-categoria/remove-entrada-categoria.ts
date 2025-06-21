import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { auth } from "../../middleware/auth";
import { prisma } from "../../../lib/prisma";
import { BadRequestError } from "../_errors/bad-request-error";

export async function removeSaidaCategoria(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).delete('/saida/categorias/:id', {
            schema: {
                tags: ['Saída Categoria'],
                summary: 'Usuário remove uma categoria de saída',
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
                    id: userId
                }
            })

            if(!user){
                throw new BadRequestError('Erro ao buscar usuário criador da categoria')
            }

            const {id} = request.params

            const deletedSaidaCategoria = await prisma.saida_categoria.update({
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
                data: {
                    id_ativo: false
                }
            })

            if(!deletedSaidaCategoria){
                throw new BadRequestError('Erro ao atualizar categoria')
            }

            return reply.status(201).send(deletedSaidaCategoria)
        }
    )
}