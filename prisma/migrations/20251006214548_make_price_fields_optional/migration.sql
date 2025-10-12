-- AlterTable
ALTER TABLE "deals" ALTER COLUMN "originalPrice" DROP NOT NULL,
ALTER COLUMN "discountPercentage" SET DEFAULT 0;
