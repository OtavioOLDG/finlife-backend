import type { FastifyInstance } from "fastify";
import { ZodError } from "zod/v4";
import { BadRequestError } from "./routes/_errors/bad-request-error";
import { UnauthorizedError } from "./routes/_errors/unauthorized-error";

type FastityErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastityErrorHandler = (error, request, reply) => {
    if(error instanceof ZodError){
        return reply.status(400).send({
            message: 'Erro desconhecido/ZodError',
            error: error.flatten().fieldErrors
        })
    }
    if(error instanceof BadRequestError){
        return reply.status(400).send({
            message: error.message,
        })
    }
    if(error instanceof UnauthorizedError){
        return reply.status(401).send({
            message: error.message,
        })
    }

    return reply.status(500).send({message: 'Erro interno'})
}