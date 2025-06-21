-- AlterTable
ALTER TABLE "entrada_info" ADD COLUMN     "patrimonio_infoId" INTEGER;

-- AlterTable
ALTER TABLE "saida_info" ADD COLUMN     "patrimonio_infoId" INTEGER;

-- AddForeignKey
ALTER TABLE "entrada_info" ADD CONSTRAINT "entrada_info_patrimonio_infoId_fkey" FOREIGN KEY ("patrimonio_infoId") REFERENCES "patrimonio_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saida_info" ADD CONSTRAINT "saida_info_patrimonio_infoId_fkey" FOREIGN KEY ("patrimonio_infoId") REFERENCES "patrimonio_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
