-- AlterTable
ALTER TABLE "saida_categoria" ADD COLUMN     "publico" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id_usuario_info_cadastro" DROP NOT NULL;
