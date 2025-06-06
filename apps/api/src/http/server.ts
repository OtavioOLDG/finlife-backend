import { FastifyInstance, fastify } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyJwt from "@fastify/jwt";
import { jsonSchemaTransform,serializerCompiler,validatorCompiler,ZodTypeProvider } from "fastify-type-provider-zod";
import { createAccount } from "./routes/users/create-account";
import { loginAccount } from "./routes/users/login-account";
import { getProfile } from "./routes/users/get-user";
import { errorHandler } from "./error-handler";
import { env } from '@finlife/env'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'FinLife',
      description: 'Backend service',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  transform: jsonSchemaTransform,

});

app.setErrorHandler(errorHandler)

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
})
app.register(fastifyCors)
app.register(fastifyJwt, {
    secret : env.JWT_SECRET
})

// rotas usuários
app.register(createAccount)
app.register(loginAccount)
app.register(getProfile)

app.listen({port: parseInt(env.SERVER_PORT)}).then(() => {
    console.log('HTTP Server is running')
})