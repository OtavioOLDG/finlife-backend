-- AlterTable
ALTER TABLE "convite" ADD COLUMN     "pendente" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "recusado" BOOLEAN NOT NULL DEFAULT false;
