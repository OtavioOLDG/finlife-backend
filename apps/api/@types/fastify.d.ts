import 'fastify'
import type { Cargos } from '../src/http/middleware/auth'
import type { z } from 'zod'
import { grupo_financeiro, grupo_financeiro_usuario } from '../src/generated/prisma'


declare module 'fastify' {
    export interface FastifyRequest {
        getCurrentUserId(): Promise<number>
        getMembership: () => Promise<{grupoFinanceiroUsuario: grupo_financeiro_usuario, grupoFinanceiro: grupo_financeiro}>
    }
}