-- DropForeignKey
ALTER TABLE "entrada_info" DROP CONSTRAINT "entrada_info_id_entrada_fkey";

-- DropForeignKey
ALTER TABLE "grupo_financeiro_cargo" DROP CONSTRAINT "grupo_financeiro_cargo_id_usuario_info_cadastro_fkey";

-- DropForeignKey
ALTER TABLE "patrimonio_info" DROP CONSTRAINT "patrimonio_info_id_patrimonio_fkey";

-- DropForeignKey
ALTER TABLE "saida_info" DROP CONSTRAINT "saida_info_id_saida_fkey";

-- DropForeignKey
ALTER TABLE "usuario_info" DROP CONSTRAINT "usuario_info_id_usuario_fkey";

-- AddForeignKey
ALTER TABLE "entrada_info" ADD CONSTRAINT "entrada_info_id_entrada_fkey" FOREIGN KEY ("id_entrada") REFERENCES "entrada"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grupo_financeiro_cargo" ADD CONSTRAINT "grupo_financeiro_cargo_id_usuario_info_cadastro_fkey" FOREIGN KEY ("id_usuario_info_cadastro") REFERENCES "usuario_info"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patrimonio_info" ADD CONSTRAINT "patrimonio_info_id_patrimonio_fkey" FOREIGN KEY ("id_patrimonio") REFERENCES "patrimonio"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "saida_info" ADD CONSTRAINT "saida_info_id_saida_fkey" FOREIGN KEY ("id_saida") REFERENCES "saida"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "usuario_info" ADD CONSTRAINT "usuario_info_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
