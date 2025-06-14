-- CreateTable
CREATE TABLE "convite" (
    "id" SERIAL NOT NULL,
    "cargo" "Role" NOT NULL,
    "grupo_financeiro_usuarioId" INTEGER NOT NULL,
    "usuario_destino_id" INTEGER NOT NULL,
    "grupo_financiero_id" INTEGER NOT NULL,

    CONSTRAINT "convite_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "convite" ADD CONSTRAINT "convite_grupo_financiero_id_fkey" FOREIGN KEY ("grupo_financiero_id") REFERENCES "grupo_financeiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convite" ADD CONSTRAINT "convite_usuario_destino_id_fkey" FOREIGN KEY ("usuario_destino_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convite" ADD CONSTRAINT "convite_grupo_financeiro_usuarioId_fkey" FOREIGN KEY ("grupo_financeiro_usuarioId") REFERENCES "grupo_financeiro_usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
