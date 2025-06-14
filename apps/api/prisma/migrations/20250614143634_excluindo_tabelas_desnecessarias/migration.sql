/*
  Warnings:

  - You are about to drop the column `id_grupo_financeiro_cargo` on the `grupo_financeiro_usuario` table. All the data in the column will be lost.
  - You are about to drop the `grupo_financeiro_cargo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "grupo_financeiro_cargo" DROP CONSTRAINT "grupo_financeiro_cargo_id_usuario_info_cadastro_fkey";

-- DropForeignKey
ALTER TABLE "grupo_financeiro_usuario" DROP CONSTRAINT "grupo_financeiro_usuario_id_grupo_financeiro_cargo_fkey";

-- AlterTable
ALTER TABLE "grupo_financeiro_usuario" DROP COLUMN "id_grupo_financeiro_cargo";

-- DropTable
DROP TABLE "grupo_financeiro_cargo";
