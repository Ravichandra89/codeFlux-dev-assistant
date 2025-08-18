/*
  Warnings:

  - You are about to drop the column `namespace` on the `Document` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_namespace_fkey";

-- DropIndex
DROP INDEX "Document_namespace_idx";

-- DropIndex
DROP INDEX "StoreSettings_selectedRepoId_key";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "namespace",
ADD COLUMN     "namespaceId" TEXT NOT NULL DEFAULT 'default';

-- CreateIndex
CREATE INDEX "Document_namespaceId_idx" ON "Document"("namespaceId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_namespaceId_fkey" FOREIGN KEY ("namespaceId") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;
