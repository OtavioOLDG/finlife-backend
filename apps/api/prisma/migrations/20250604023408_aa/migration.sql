-- CreateTable
CREATE TABLE "entrada" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "entrada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entrada_categoria" (
    "id" SERIAL NOT NULL,
    "id_usuario_info_cadastro" INTEGER NOT NULL,
    "dthr_cadastro" TIMESTAMP(6) NOT NULL,
    "nome" TEXT NOT NULL,
    "id_ativo" BOOLEAN NOT NULL,
    "id_grupo_financeiro" INTEGER,
    "id_patrimonial" BOOLEAN NOT NULL,

    CONSTRAINT "entrada_categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entrada_info" (
    "id" SERIAL NOT NULL,
    "dthr_cadastro" TIMESTAMP(6) NOT NULL,
    "dthr_entrada" TIMESTAMP(6),
    "id_usuario_info_cadastro" INTEGER NOT NULL,
    "id_info_ativo" BOOLEAN NOT NULL,
    "id_ativo" BOOLEAN NOT NULL,
    "id_entrada" INTEGER NOT NULL,
    "id_entrada_categoria" INTEGER NOT NULL,
    "id_pagamento_entrada_tipo" INTEGER NOT NULL,
    "id_usuario_info" INTEGER NOT NULL,
    "id_periodicidade" INTEGER NOT NULL,
    "valor" DECIMAL(15,2) NOT NULL,
    "id_patrimonio_info" INTEGER,
    "comprovante" OID,

    CONSTRAINT "entrada_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupo_financeiro" (
    "id" SERIAL NOT NULL,
    "id_ativo" BOOLEAN NOT NULL,
    "dthr_cadastro" TIMESTAMP(6) NOT NULL,
    "id_usuario_info_cadastro" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "grupo_financeiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupo_financeiro_cargo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "id_admin" BOOLEAN NOT NULL,
    "id_ativo" BOOLEAN NOT NULL,
    "id_usuario_info_cadastro" INTEGER NOT NULL,
    "dthr_cadastro" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "grupo_financeiro_cargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupo_financeiro_usuario" (
    "id" SERIAL NOT NULL,
    "id_ativo" BOOLEAN NOT NULL,
    "dthr_cadastro" TIMESTAMP(6) NOT NULL,
    "id_usuario_info_cadastro" INTEGER NOT NULL,
    "id_usuario_info" INTEGER NOT NULL,
    "id_grupo_financeiro_cargo" INTEGER NOT NULL,
    "id_grupo_financeiro" INTEGER NOT NULL,

    CONSTRAINT "grupo_financeiro_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacao" (
    "id" SERIAL NOT NULL,
    "id_usuario_info" INTEGER NOT NULL,
    "dthr_cadastro" TIMESTAMP(6) NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "id_saida_info" INTEGER,
    "id_entrada_info" INTEGER,
    "visto" BOOLEAN NOT NULL,

    CONSTRAINT "notificacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamento_entrada_tipo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "dthr_cadastro" TIMESTAMP(6) NOT NULL,
    "id_usuario_info_cadastro" INTEGER NOT NULL,
    "id_ativo" BOOLEAN NOT NULL,
    "id_grupo_financeiro" INTEGER,

    CONSTRAINT "pagamento_entrada_tipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamento_saida_tipo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "dthr_cadastro" TIMESTAMP(6) NOT NULL,
    "id_usuario_info_cadastro" INTEGER NOT NULL,
    "id_ativo" BOOLEAN NOT NULL,
    "id_grupo_financeiro" INTEGER,

    CONSTRAINT "pagamento_saida_tipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patrimonio" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "valor_aquisicao" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "patrimonio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patrimonio_info" (
    "id" SERIAL NOT NULL,
    "dthr_cadastro" TIMESTAMP(6) NOT NULL,
    "id_ativo" BOOLEAN NOT NULL,
    "id_info_ativo" BOOLEAN NOT NULL,
    "id_usuario_info_cadastro" INTEGER NOT NULL,
    "id_patrimonio" INTEGER NOT NULL,
    "valor_mercado" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "patrimonio_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patrimonio_info_imagem" (
    "id" SERIAL NOT NULL,
    "id_usuario_info_cadastro" INTEGER NOT NULL,
    "dthr_cadastro" TIMESTAMP(6) NOT NULL,
    "imagem" OID NOT NULL,
    "id_patrimonio_info" INTEGER NOT NULL,

    CONSTRAINT "patrimonio_info_imagem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "periodicidade" (
    "id" SERIAL NOT NULL,
    "id_usuario_info_cadastro" INTEGER NOT NULL,
    "id_ativo" BOOLEAN NOT NULL,
    "dthr_cadastro" TIMESTAMP(6) NOT NULL,
    "nome" TEXT NOT NULL,
    "id_mensal" BOOLEAN NOT NULL,
    "id_anual" BOOLEAN NOT NULL,
    "id_unico" BOOLEAN NOT NULL,

    CONSTRAINT "periodicidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saida" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "saida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saida_categoria" (
    "id" SERIAL NOT NULL,
    "id_usuario_info_cadastro" INTEGER NOT NULL,
    "dthr_cadastro" TIMESTAMP(6) NOT NULL,
    "nome" TEXT NOT NULL,
    "id_ativo" BOOLEAN NOT NULL,
    "id_grupo_financeiro" INTEGER,
    "id_patrimonial" BOOLEAN NOT NULL,

    CONSTRAINT "saida_categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saida_info" (
    "id" SERIAL NOT NULL,
    "id_ativo" BOOLEAN NOT NULL,
    "dthr_cadastro" TIMESTAMP(6) NOT NULL,
    "dthr_saida" TIMESTAMP(6),
    "id_saida_categoria" INTEGER NOT NULL,
    "id_pagamento_saida_tipo" INTEGER NOT NULL,
    "id_usuario_info_cadastro" INTEGER NOT NULL,
    "id_saida" INTEGER NOT NULL,
    "id_info_ativo" BOOLEAN NOT NULL,
    "id_saida_prioridade" INTEGER NOT NULL,
    "id_usuario_info" INTEGER NOT NULL,
    "id_periodicidade" INTEGER NOT NULL,
    "valor" DECIMAL(15,2) NOT NULL,
    "id_patrimonio_info" INTEGER,
    "comprovante" OID,

    CONSTRAINT "saida_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saida_prioridade" (
    "id" SERIAL NOT NULL,
    "id_usuario_info_cadastro" INTEGER NOT NULL,
    "dthr_cadastro" TIMESTAMP(6) NOT NULL,
    "id_ativo" BOOLEAN NOT NULL,
    "nivel" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "saida_prioridade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "dthr_nascimento" DATE NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_info" (
    "id" SERIAL NOT NULL,
    "endereco" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "dthr_cadastro" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_ativo" BOOLEAN NOT NULL,
    "id_info_ativo" BOOLEAN NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "usuario_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_entrada_info_entrada" ON "entrada_info"("id_entrada");

-- CreateIndex
CREATE INDEX "idx_entrada_info_usuario" ON "entrada_info"("id_usuario_info");

-- CreateIndex
CREATE INDEX "idx_grupo_financeiro_usuario" ON "grupo_financeiro"("id_usuario_info_cadastro");

-- CreateIndex
CREATE INDEX "idx_gf_usuario_cadastro" ON "grupo_financeiro_usuario"("id_usuario_info_cadastro");

-- CreateIndex
CREATE INDEX "idx_gf_usuario_info" ON "grupo_financeiro_usuario"("id_usuario_info");

-- CreateIndex
CREATE INDEX "idx_patrimonio_info_patrimonio" ON "patrimonio_info"("id_patrimonio");

-- CreateIndex
CREATE INDEX "idx_saida_info_saida" ON "saida_info"("id_saida");

-- CreateIndex
CREATE INDEX "idx_saida_info_usuario" ON "saida_info"("id_usuario_info");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_cpf_key" ON "usuario"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_info_email_key" ON "usuario_info"("email");

-- CreateIndex
CREATE INDEX "idx_usuario_info_usuario" ON "usuario_info"("id_usuario");

-- AddForeignKey
ALTER TABLE "entrada_categoria" ADD CONSTRAINT "entrada_categoria_id_grupo_financeiro_fkey" FOREIGN KEY ("id_grupo_financeiro") REFERENCES "grupo_financeiro"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entrada_categoria" ADD CONSTRAINT "entrada_categoria_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entrada_info" ADD CONSTRAINT "entrada_info_id_entrada_categoria_fkey" FOREIGN KEY ("id_entrada_categoria") REFERENCES "entrada_categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entrada_info" ADD CONSTRAINT "entrada_info_id_entrada_fkey" FOREIGN KEY ("id_entrada") REFERENCES "entrada"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entrada_info" ADD CONSTRAINT "entrada_info_id_pagamento_entrada_tipo_fkey" FOREIGN KEY ("id_pagamento_entrada_tipo") REFERENCES "pagamento_entrada_tipo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entrada_info" ADD CONSTRAINT "entrada_info_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entrada_info" ADD CONSTRAINT "entrada_info_id_usuario_info_fkey" FOREIGN KEY ("id_usuario_info") REFERENCES "usuario_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grupo_financeiro" ADD CONSTRAINT "grupo_financeiro_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grupo_financeiro_cargo" ADD CONSTRAINT "grupo_financeiro_cargo_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grupo_financeiro_usuario" ADD CONSTRAINT "grupo_financeiro_usuario_id_grupo_financeiro_cargo_fkey" FOREIGN KEY ("id_grupo_financeiro_cargo") REFERENCES "grupo_financeiro_cargo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grupo_financeiro_usuario" ADD CONSTRAINT "grupo_financeiro_usuario_id_grupo_financeiro_fkey" FOREIGN KEY ("id_grupo_financeiro") REFERENCES "grupo_financeiro"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grupo_financeiro_usuario" ADD CONSTRAINT "grupo_financeiro_usuario_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grupo_financeiro_usuario" ADD CONSTRAINT "grupo_financeiro_usuario_id_usuario_info_fkey" FOREIGN KEY ("id_usuario_info") REFERENCES "usuario_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notificacao" ADD CONSTRAINT "notificacao_id_entrada_info_fkey" FOREIGN KEY ("id_entrada_info") REFERENCES "entrada_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notificacao" ADD CONSTRAINT "notificacao_id_saida_info_fkey" FOREIGN KEY ("id_saida_info") REFERENCES "saida_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notificacao" ADD CONSTRAINT "notificacao_id_usuario_info_fkey" FOREIGN KEY ("id_usuario_info") REFERENCES "usuario_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagamento_entrada_tipo" ADD CONSTRAINT "pagamento_entrada_tipo_id_grupo_financeiro_fkey" FOREIGN KEY ("id_grupo_financeiro") REFERENCES "grupo_financeiro"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagamento_entrada_tipo" ADD CONSTRAINT "pagamento_entrada_tipo_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagamento_saida_tipo" ADD CONSTRAINT "pagamento_saida_tipo_id_grupo_financeiro_fkey" FOREIGN KEY ("id_grupo_financeiro") REFERENCES "grupo_financeiro"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagamento_saida_tipo" ADD CONSTRAINT "pagamento_saida_tipo_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patrimonio_info" ADD CONSTRAINT "patrimonio_info_id_patrimonio_fkey" FOREIGN KEY ("id_patrimonio") REFERENCES "patrimonio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patrimonio_info" ADD CONSTRAINT "patrimonio_info_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patrimonio_info_imagem" ADD CONSTRAINT "patrimonio_info_imagem_id_patrimonio_info_fkey" FOREIGN KEY ("id_patrimonio_info") REFERENCES "patrimonio_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patrimonio_info_imagem" ADD CONSTRAINT "patrimonio_info_imagem_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "periodicidade" ADD CONSTRAINT "periodicidade_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_categoria" ADD CONSTRAINT "saida_categoria_id_grupo_financeiro_fkey" FOREIGN KEY ("id_grupo_financeiro") REFERENCES "grupo_financeiro"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_categoria" ADD CONSTRAINT "saida_categoria_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_info" ADD CONSTRAINT "saida_info_id_pagamento_saida_tipo_fkey" FOREIGN KEY ("id_pagamento_saida_tipo") REFERENCES "pagamento_saida_tipo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_info" ADD CONSTRAINT "saida_info_id_saida_categoria_fkey" FOREIGN KEY ("id_saida_categoria") REFERENCES "saida_categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_info" ADD CONSTRAINT "saida_info_id_saida_fkey" FOREIGN KEY ("id_saida") REFERENCES "saida"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_info" ADD CONSTRAINT "saida_info_id_saida_prioridade_fkey" FOREIGN KEY ("id_saida_prioridade") REFERENCES "saida_prioridade"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_info" ADD CONSTRAINT "saida_info_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_info" ADD CONSTRAINT "saida_info_id_usuario_info_fkey" FOREIGN KEY ("id_usuario_info") REFERENCES "usuario_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_prioridade" ADD CONSTRAINT "saida_prioridade_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_info" ADD CONSTRAINT "usuario_info_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
