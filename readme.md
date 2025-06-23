# FinLife – Gestão Financeira Pessoal, Familiar e Profissional

## Resumo

FinLife é uma plataforma web projetada para simplificar o controle de finanças pessoais, familiares e de pequenos negócios. O sistema permite o registro, categorização e consolidação de receitas, despesas e patrimônios, oferecendo painéis de análise com gráficos de evolução de saldo, distribuição percentual de gastos e alertas de vencimento. Desenvolvido com foco em usabilidade e desempenho, FinLife utiliza uma arquitetura cliente-servidor moderna para garantir segurança, escalabilidade e uma experiência fluida ao usuário.

## Funcionalidades

- **Cadastro de Usuários e Autenticação**  
  Registro e login seguros, com recuperação de senha via e-mail e controle de sessões por JWT.

- **Lançamentos Financeiros**  
  CRUD de entradas, saídas e patrimônios, com campos para valor, data, comprovante e notas adicionais.

- **Categorias e Tipos de Pagamento**  
  Criação de categorias customizadas e seleção de formas de pagamento (cartão, transferência, dinheiro etc.).

- **Periodicidade e Prioridade**  
  Configuração de lançamentos recorrentes (mensal, anual, único) e definição de prioridade para saídas críticas.

- **Grupos Financeiros Colaborativos**  
  Criação de grupos, convites de membros (aceitar/recusar), papéis de administrador e consolidação de lançamentos coletivos.

- **Dashboards Analíticos**  
  Visão geral com indicadores-chave (saldo atual, metas, participação de categoria) e gráficos interativos.

- **Notificações Contextuais**  
  Alertas sobre vencimento de contas, estouro de orçamento e progresso de metas via e-mail e sistema interno.

- **Exclusão e Correção de Lançamentos**  
  Possibilidade de remover registros errôneos, mantendo histórico de alterações para auditoria.

## Tecnologias Utilizadas

- **Frontend**  
  - Next.js (React)  
  - TypeScript  
  - Tailwind CSS  

- **Backend**  
  - Node.js  
  - Fastify  
  - Prisma ORM  
  - Zod (validação de esquemas)  

- **Banco de Dados**  
  - PostgreSQL  

- **Autenticação & Autorização**  
  - JSON Web Tokens (JWT)  
  - Cookies seguras e CORS configurado com @fastify/cors  

- **Envio de E-mails**  
  - Nodemailer (SMTP)

- **Documentação da API**  
  - Swagger (OpenAPI)  

- **Gerenciamento de Dependências**  
  - pnpm  

- **Deploy & CI/CD**  
  - Vercel (frontend) 
  - GitHub Actions para testes e linting  

## Links Importantes

- **Diagrama de Caso de Uso**  
  [Casos de uso](https://miro.com/app/board/uXjVIlu3EuI=/?share_link_id=142613026777)  
- **Histórias de Usuário**  
  [Miro Board – User Stories](https://miro.com/app/board/uXjVIlu7S9k=/?share_link_id=531229549898)  
- **Diagrama de Classes**  
  [Google Docs](https://docs.google.com/document/d/1FXgwqV_8-pH1Po8WIB9tXPwww4vOPF9eppjxQYNiZfk/edit?usp=sharing)  
- **Protótipo de Interface**  
  [Figma – FinLife UI](https://www.figma.com/design/CeBSBMO7GZ3Dy7tO3JltBe/FinLife?node-id=0-1&t=70AvK61Lo0IRvH0F-1)  
- **Matriz de Rastreabilidade**  
  [Google Sheets](https://docs.google.com/spreadsheets/d/1CDMzlwXZCNnG7dz8DZwCC_IXwZ0mjjfsBBgIlziMgJY/edit?usp=sharing) 
- **Regras de Negócio**  
  [Google Docs](https://docs.google.com/document/d/1OOxGUkHQ4Y-eeu99FjhLJdpIc7QMqEL3HWRGNNtck40/edit?usp=sharing)
- **Rotas da API**  
  [Google Docs](https://docs.google.com/document/d/1-X8BR-9iw01J2jaTLTOHhzBhkZP-Z4BW8XRDm4tz9dY/edit?usp=sharing)

## Conclusão

FinLife oferece uma solução completa para quem busca controle financeiro de maneira simples, colaborativa e visualmente agradável. Ao centralizar lançamentos, metas e relatórios em um só lugar, o usuário ganha visibilidade e autonomia para tomar decisões conscientes, reduzir desperdícios e planejar o futuro. Com uma arquitetura moderna e boas práticas de engenharia de software, o projeto está preparado para evoluir com novos módulos preditivos, integrações bancárias e melhorias contínuas na experiência do usuário.

