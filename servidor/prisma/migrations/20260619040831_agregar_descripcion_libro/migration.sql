/*
  Warnings:

  - You are about to alter the column `correo` on the `usuario` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - A unique constraint covering the columns `[correo]` on the table `usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "libro" ADD COLUMN     "descripcion" TEXT;

-- AlterTable
ALTER TABLE "usuario" ADD COLUMN     "password_hash" VARCHAR(255),
ALTER COLUMN "correo" SET DATA TYPE VARCHAR(150);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");
