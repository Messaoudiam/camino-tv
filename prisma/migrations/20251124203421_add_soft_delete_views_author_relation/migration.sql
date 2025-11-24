/*
  Warnings:

  - Made the column `originalPrice` on table `deals` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "blog_posts" ADD COLUMN     "authorId" TEXT,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "deals" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ALTER COLUMN "originalPrice" SET NOT NULL;

-- CreateIndex
CREATE INDEX "blog_posts_authorId_idx" ON "blog_posts"("authorId");

-- CreateIndex
CREATE INDEX "deals_brand_idx" ON "deals"("brand");

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
