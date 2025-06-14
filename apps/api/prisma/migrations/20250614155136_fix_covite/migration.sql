-- DropForeignKey
ALTER TABLE "convite" DROP CONSTRAINT "convite_usuario_destino_id_fkey";

-- AddForeignKey
ALTER TABLE "convite" ADD CONSTRAINT "convite_usuario_destino_id_fkey" FOREIGN KEY ("usuario_destino_id") REFERENCES "usuario_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
