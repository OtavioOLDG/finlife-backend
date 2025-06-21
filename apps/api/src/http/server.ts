import { fastify } from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyJwt from "@fastify/jwt";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { createAccount } from "./routes/users/create-account";
import { loginAccount } from "./routes/users/login-account";
import { getProfile } from "./routes/users/get-user";
import { errorHandler } from "./error-handler";
import { env } from '@finlife/env';
import { createEntradaCategoria } from "./routes/entrada-categoria/create-entrada-categoria";
import { pegarToken } from "./routes/desenvolvimento/pegar-token";
import { createSaidaPrioridade } from "./routes/saida-prioridade/create-saida-prioridade";
import { pegarCargo } from "./routes/desenvolvimento/pegar-cargo";
import { createGrupoFinanceiro } from "./routes/grupo-financeiro/create-grupo-financeiro";
import { createConvite } from "./routes/convites/createConvite";
import { updateUser } from "./routes/users/update-user";
import { getAllUserInvites } from "./routes/convites/get-user-invites";
import { acceptInvite } from "./routes/convites/accept-invite";
import { declineInvite } from "./routes/convites/decline-invite";
import { createInviteEmail } from "./routes/convites/createInviteEmail";
import { getRoleOrg } from "./routes/cargos/get-role-org";
import { quitFromGroup } from "./routes/grupo-financeiro/quit-from-group";
import { createEquity } from "./routes/patrimonio/create-patrimonio";
import { newNotification } from "./routes/notificacoes/newNotification";
import { getAllUserNotifications } from "./routes/notificacoes/get-all-user-notifications";
import { getEntradaCategoria } from "./routes/entrada-categoria/getEntradasCategoria";
import { removeUser } from "./routes/users/remove-user";
import { getSaidaPrioridade } from "./routes/saida-prioridade/getSaidaPrioridade";
import { unInvite } from "./routes/convites/uninvite";
import { getALlInvites } from "./routes/convites/getAllInvites";
import { removePatrimonio } from "./routes/patrimonio/remove-patrimonio";
import { getAllEquityUser } from "./routes/patrimonio/get-all-patrimonio";
import { getAllEquityGroup } from "./routes/patrimonio/get-all-patrimonios-grupo";
import { getEquityById } from "./routes/patrimonio/get-patrimonio";
import { getAllMembersGroup } from "./routes/grupo-usuario/get-all-members";

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

// rotas desenvolvimento
app.register(pegarToken)
app.register(pegarCargo)

// rotas cargos
app.register(getRoleOrg)
app.register(quitFromGroup)

// rotas convites
app.register(createConvite)
app.register(getAllUserInvites)
app.register(acceptInvite)
app.register(declineInvite)
app.register(createInviteEmail)
app.register(unInvite)
app.register(getALlInvites)

// rotas entrada categoria
app.register(createEntradaCategoria)
app.register(getEntradaCategoria)

// rotas grupo financeiro
app.register(createGrupoFinanceiro)

// rotas grupo financeiro usuário
app.register(getAllMembersGroup)

// rotas notificação
app.register(newNotification)
app.register(getAllUserNotifications)

// rotas patrimônio
app.register(createEquity)
app.register(removePatrimonio)
app.register(getAllEquityUser)
app.register(getAllEquityGroup)
app.register(getEquityById)

// rotas usuários
app.register(createAccount)
app.register(loginAccount)
app.register(getProfile)
app.register(updateUser)
app.register(removeUser)

// rotas saida prioridade
app.register(createSaidaPrioridade)
app.register(getSaidaPrioridade)

app.listen({port: parseInt(env.SERVER_PORT)}).then(() => {
    console.log('HTTP Server is running')
})