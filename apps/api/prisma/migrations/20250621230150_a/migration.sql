-- AlterTable
ALTER TABLE "pagamento_entrada_tipo" ADD COLUMN     "publico" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id_usuario_info_cadastro" DROP NOT NULL;

-- AlterTable
ALTER TABLE "pagamento_saida_tipo" ADD COLUMN     "publico" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id_usuario_info_cadastro" DROP NOT NULL;
