import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { auth } from "../../middleware/auth";
import { prisma } from "../../../lib/prisma";
import { BadRequestError } from "../_errors/bad-request-error";

export async function getEntradaCategoria(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().register(auth).get('/entrada/categorias', {
            schema: {
                tags: ['Entrada Categoria'],
                summary: 'Pega as categorias de entrada do usuário',
                security: [{bearerAuth: []}],
                response: {
                    200: z.object({
                        entradasCategoriasPadrao: z.array(z.object({
                            id: z.number(),
                            nome: z.string(),
                            dthr_cadastro: z.date(),
                            id_ativo: z.boolean(),
                            id_patrimonial: z.boolean(),
                            id_usuario_info_cadastro: z.number().nullable(),
                            id_grupo_financeiro: z.number().nullable()
                        })),
                        entradasCategoriasUsuario: z.array(z.object({
                            id: z.number(),
                            nome: z.string(),
                            dthr_cadastro: z.date(),
                            id_ativo: z.boolean(),
                            id_patrimonial: z.boolean(),
                            id_usuario_info_cadastro: z.number().nullable(),
                            id_grupo_financeiro: z.number().nullable()
                        })),
                    })
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

            const entradasCategoriasPadrao = await prisma.entrada_categoria.findMany({
                select: {
                    id: true,
                    id_grupo_financeiro: true,
                    id_ativo: true,
                    id_patrimonial: true,
                    id_usuario_info_cadastro: true,
                    nome: true,
                    dthr_cadastro: true,
                },
                where :{
                    publico: true,
                    id_ativo:true,
                }
            })

            if(!entradasCategoriasPadrao){
                throw new BadRequestError('Falha ao carregar categorias de entradas padrão')
            }

            const entradasCategoriasUsuario = await prisma.entrada_categoria.findMany({
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
                    id_usuario_info_cadastro: userId,
                    id_ativo: true
                }
            })

            if(!entradasCategoriasUsuario){
                throw new BadRequestError('Falha ao carregar categorias de entradas do usuário')
            }

            return reply.status(200).send({
                entradasCategoriasPadrao,
                entradasCategoriasUsuario
            })
        }
    )
}