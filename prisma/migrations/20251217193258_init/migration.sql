-- CreateTable
CREATE TABLE "Maquina" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "temperatura" DOUBLE PRECISION NOT NULL,
    "ligada" BOOLEAN NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Maquina_pkey" PRIMARY KEY ("id")
);
