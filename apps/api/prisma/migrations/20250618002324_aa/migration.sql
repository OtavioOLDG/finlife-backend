-- DropForeignKey
ALTER TABLE "entrada_categoria" DROP CONSTRAINT "entrada_categoria_id_grupo_financeiro_fkey";

-- DropForeignKey
ALTER TABLE "entrada_categoria" DROP CONSTRAINT "entrada_categoria_id_usuario_info_cadastro_fkey";

-- DropForeignKey
ALTER TABLE "entrada_info" DROP CONSTRAINT "entrada_info_id_entrada_categoria_fkey";

-- DropForeignKey
ALTER TABLE "entrada_info" DROP CONSTRAINT "entrada_info_id_entrada_fkey";

-- DropForeignKey
ALTER TABLE "entrada_info" DROP CONSTRAINT "entrada_info_id_pagamento_entrada_tipo_fkey";

-- DropForeignKey
ALTER TABLE "entrada_info" DROP CONSTRAINT "entrada_info_id_usuario_info_cadastro_fkey";

-- DropForeignKey
ALTER TABLE "entrada_info" DROP CONSTRAINT "entrada_info_id_usuario_info_fkey";

-- DropForeignKey
ALTER TABLE "grupo_financeiro" DROP CONSTRAINT "grupo_financeiro_id_usuario_info_cadastro_fkey";

-- DropForeignKey
ALTER TABLE "grupo_financeiro_usuario" DROP CONSTRAINT "grupo_financeiro_usuario_id_grupo_financeiro_fkey";

-- DropForeignKey
ALTER TABLE "grupo_financeiro_usuario" DROP CONSTRAINT "grupo_financeiro_usuario_id_usuario_info_cadastro_fkey";

-- DropForeignKey
ALTER TABLE "grupo_financeiro_usuario" DROP CONSTRAINT "grupo_financeiro_usuario_id_usuario_info_fkey";

-- DropForeignKey
ALTER TABLE "notificacao" DROP CONSTRAINT "notificacao_id_entrada_info_fkey";

-- DropForeignKey
ALTER TABLE "notificacao" DROP CONSTRAINT "notificacao_id_saida_info_fkey";

-- DropForeignKey
ALTER TABLE "notificacao" DROP CONSTRAINT "notificacao_id_usuario_info_fkey";

-- DropForeignKey
ALTER TABLE "pagamento_entrada_tipo" DROP CONSTRAINT "pagamento_entrada_tipo_id_grupo_financeiro_fkey";

-- DropForeignKey
ALTER TABLE "pagamento_entrada_tipo" DROP CONSTRAINT "pagamento_entrada_tipo_id_usuario_info_cadastro_fkey";

-- DropForeignKey
ALTER TABLE "pagamento_saida_tipo" DROP CONSTRAINT "pagamento_saida_tipo_id_grupo_financeiro_fkey";

-- DropForeignKey
ALTER TABLE "pagamento_saida_tipo" DROP CONSTRAINT "pagamento_saida_tipo_id_usuario_info_cadastro_fkey";

-- DropForeignKey
ALTER TABLE "patrimonio_info" DROP CONSTRAINT "patrimonio_info_id_patrimonio_fkey";

-- DropForeignKey
ALTER TABLE "patrimonio_info" DROP CONSTRAINT "patrimonio_info_id_usuario_info_cadastro_fkey";

-- DropForeignKey
ALTER TABLE "patrimonio_info_imagem" DROP CONSTRAINT "patrimonio_info_imagem_id_patrimonio_info_fkey";

-- DropForeignKey
ALTER TABLE "patrimonio_info_imagem" DROP CONSTRAINT "patrimonio_info_imagem_id_usuario_info_cadastro_fkey";

-- DropForeignKey
ALTER TABLE "periodicidade" DROP CONSTRAINT "periodicidade_id_usuario_info_cadastro_fkey";

-- DropForeignKey
ALTER TABLE "saida_categoria" DROP CONSTRAINT "saida_categoria_id_grupo_financeiro_fkey";

-- DropForeignKey
ALTER TABLE "saida_categoria" DROP CONSTRAINT "saida_categoria_id_usuario_info_cadastro_fkey";

-- DropForeignKey
ALTER TABLE "saida_info" DROP CONSTRAINT "saida_info_id_pagamento_saida_tipo_fkey";

-- DropForeignKey
ALTER TABLE "saida_info" DROP CONSTRAINT "saida_info_id_saida_categoria_fkey";

-- DropForeignKey
ALTER TABLE "saida_info" DROP CONSTRAINT "saida_info_id_saida_fkey";

-- DropForeignKey
ALTER TABLE "saida_info" DROP CONSTRAINT "saida_info_id_saida_prioridade_fkey";

-- DropForeignKey
ALTER TABLE "saida_info" DROP CONSTRAINT "saida_info_id_usuario_info_cadastro_fkey";

-- DropForeignKey
ALTER TABLE "saida_info" DROP CONSTRAINT "saida_info_id_usuario_info_fkey";

-- DropForeignKey
ALTER TABLE "saida_prioridade" DROP CONSTRAINT "saida_prioridade_id_usuario_info_cadastro_fkey";

-- DropForeignKey
ALTER TABLE "usuario_info" DROP CONSTRAINT "usuario_info_id_usuario_fkey";

-- AddForeignKey
ALTER TABLE "entrada_categoria" ADD CONSTRAINT "entrada_categoria_id_grupo_financeiro_fkey" FOREIGN KEY ("id_grupo_financeiro") REFERENCES "grupo_financeiro"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entrada_categoria" ADD CONSTRAINT "entrada_categoria_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entrada_info" ADD CONSTRAINT "entrada_info_id_entrada_categoria_fkey" FOREIGN KEY ("id_entrada_categoria") REFERENCES "entrada_categoria"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entrada_info" ADD CONSTRAINT "entrada_info_id_entrada_fkey" FOREIGN KEY ("id_entrada") REFERENCES "entrada"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entrada_info" ADD CONSTRAINT "entrada_info_id_pagamento_entrada_tipo_fkey" FOREIGN KEY ("id_pagamento_entrada_tipo") REFERENCES "pagamento_entrada_tipo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entrada_info" ADD CONSTRAINT "entrada_info_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "entrada_info" ADD CONSTRAINT "entrada_info_id_usuario_info_fkey" FOREIGN KEY ("id_usuario_info") REFERENCES "usuario_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grupo_financeiro" ADD CONSTRAINT "grupo_financeiro_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grupo_financeiro_usuario" ADD CONSTRAINT "grupo_financeiro_usuario_id_grupo_financeiro_fkey" FOREIGN KEY ("id_grupo_financeiro") REFERENCES "grupo_financeiro"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grupo_financeiro_usuario" ADD CONSTRAINT "grupo_financeiro_usuario_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grupo_financeiro_usuario" ADD CONSTRAINT "grupo_financeiro_usuario_id_usuario_info_fkey" FOREIGN KEY ("id_usuario_info") REFERENCES "usuario_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notificacao" ADD CONSTRAINT "notificacao_id_entrada_info_fkey" FOREIGN KEY ("id_entrada_info") REFERENCES "entrada_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notificacao" ADD CONSTRAINT "notificacao_id_saida_info_fkey" FOREIGN KEY ("id_saida_info") REFERENCES "saida_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notificacao" ADD CONSTRAINT "notificacao_id_usuario_info_fkey" FOREIGN KEY ("id_usuario_info") REFERENCES "usuario_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagamento_entrada_tipo" ADD CONSTRAINT "pagamento_entrada_tipo_id_grupo_financeiro_fkey" FOREIGN KEY ("id_grupo_financeiro") REFERENCES "grupo_financeiro"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagamento_entrada_tipo" ADD CONSTRAINT "pagamento_entrada_tipo_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagamento_saida_tipo" ADD CONSTRAINT "pagamento_saida_tipo_id_grupo_financeiro_fkey" FOREIGN KEY ("id_grupo_financeiro") REFERENCES "grupo_financeiro"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "pagamento_saida_tipo" ADD CONSTRAINT "pagamento_saida_tipo_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patrimonio_info" ADD CONSTRAINT "patrimonio_info_id_patrimonio_fkey" FOREIGN KEY ("id_patrimonio") REFERENCES "patrimonio"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patrimonio_info" ADD CONSTRAINT "patrimonio_info_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patrimonio_info_imagem" ADD CONSTRAINT "patrimonio_info_imagem_id_patrimonio_info_fkey" FOREIGN KEY ("id_patrimonio_info") REFERENCES "patrimonio_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patrimonio_info_imagem" ADD CONSTRAINT "patrimonio_info_imagem_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "periodicidade" ADD CONSTRAINT "periodicidade_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_categoria" ADD CONSTRAINT "saida_categoria_id_grupo_financeiro_fkey" FOREIGN KEY ("id_grupo_financeiro") REFERENCES "grupo_financeiro"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_categoria" ADD CONSTRAINT "saida_categoria_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_info" ADD CONSTRAINT "saida_info_id_pagamento_saida_tipo_fkey" FOREIGN KEY ("id_pagamento_saida_tipo") REFERENCES "pagamento_saida_tipo"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_info" ADD CONSTRAINT "saida_info_id_saida_categoria_fkey" FOREIGN KEY ("id_saida_categoria") REFERENCES "saida_categoria"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_info" ADD CONSTRAINT "saida_info_id_saida_fkey" FOREIGN KEY ("id_saida") REFERENCES "saida"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_info" ADD CONSTRAINT "saida_info_id_saida_prioridade_fkey" FOREIGN KEY ("id_saida_prioridade") REFERENCES "saida_prioridade"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_info" ADD CONSTRAINT "saida_info_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_info" ADD CONSTRAINT "saida_info_id_usuario_info_fkey" FOREIGN KEY ("id_usuario_info") REFERENCES "usuario_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_prioridade" ADD CONSTRAINT "saida_prioridade_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_info" ADD CONSTRAINT "usuario_info_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
