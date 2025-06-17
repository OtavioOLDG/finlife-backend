import type { FastifyInstance } from "fastify";
import { UnauthorizedError } from "../routes/_errors/unauthorized-error";
import {fastifyPlugin} from 'fastify-plugin'
import { prisma } from "../../lib/prisma";
import { BadRequestError } from "../routes/_errors/bad-request-error";

export enum Cargos{
    ADMIN,
    MEMBRO
}

export const auth = fastifyPlugin(async(app: FastifyInstance) => {
    app.addHook('preHandler', async (request) => {
        request.getCurrentUserId = async () => {
            try {
                const { sub } = await request.jwtVerify<{sub: string}>()

                const userIdSub = parseInt(sub, 10)

                return userIdSub
            } catch(err){
                throw new UnauthorizedError('Usuário não autorizado')
            }
        }

        request.getMembership = async () => {
            const userId = await request.getCurrentUserId()

            const grupoFinanceiroUsuarioEncontrado = await prisma.grupo_financeiro_usuario.findFirst({
                where: {
                    id_usuario_info: userId,
                    id_ativo: true
                },
                include: {
                    grupo_financeiro: true
                }
            })

            if(!grupoFinanceiroUsuarioEncontrado){
                throw new BadRequestError('Você não faz parte desta organização')
            }

            const {grupo_financeiro: grupoFinanceiro, ...grupoFinanceiroUsuario} = grupoFinanceiroUsuarioEncontrado

            return {
                grupoFinanceiroUsuario,
                grupoFinanceiro
            }
        }
    })
})