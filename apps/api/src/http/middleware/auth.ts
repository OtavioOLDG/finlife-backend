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

        request.getMembership = async (orgId: number) => {
            try{
                const userId = await request.getCurrentUserId()
                const membership = await prisma.grupo_financeiro_usuario.findFirst({
                    select: {
                        id_grupo_financeiro_cargo: true
                    },
                    where: {
                        id_grupo_financeiro: orgId,
                        id_usuario_info: userId
                    }
                })

                const cargo = await prisma.grupo_financeiro_cargo.findUnique({
                    where: {
                        id: membership?.id_grupo_financeiro_cargo
                    }
                })

                if(cargo?.id_admin === true){
                    return Cargos.ADMIN
                }


                return Cargos.MEMBRO
            } catch (err){
                throw new BadRequestError('Erro de autenticação de filiação')
            }
        }
    })
})