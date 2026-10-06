-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('ACTIVE', 'TRIAL', 'CHURNED');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "status" "CustomerStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'General',
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE';
