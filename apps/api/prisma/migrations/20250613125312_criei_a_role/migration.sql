/*
  Warnings:

  - Added the required column `role` to the `grupo_financeiro_usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEMBRO', 'CONVIDADO');

-- AlterTable
ALTER TABLE "grupo_financeiro_usuario" ADD COLUMN     "role" "Role" NOT NULL;
