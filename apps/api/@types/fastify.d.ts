import 'fastify'
import type { Cargos } from '../src/http/middleware/auth'

declare module 'fastify' {
    export interface FastifyRequest {
        getCurrentUserId(): Promise<number>
        getMembership: (orgId: number) => Promise<Cargos>
    }
}