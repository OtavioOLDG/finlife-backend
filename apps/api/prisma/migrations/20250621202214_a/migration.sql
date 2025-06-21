-- AlterTable
ALTER TABLE "notificacao" ADD COLUMN     "patrimonio_infoId" INTEGER;

-- AddForeignKey
ALTER TABLE "notificacao" ADD CONSTRAINT "notificacao_patrimonio_infoId_fkey" FOREIGN KEY ("patrimonio_infoId") REFERENCES "patrimonio_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
