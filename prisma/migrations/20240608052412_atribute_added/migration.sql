-- AlterTable
ALTER TABLE "pcuser" ADD COLUMN     "gender" TEXT,
ADD COLUMN     "phonenumber" TEXT,
ALTER COLUMN "serialnumber" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "gender" TEXT,
ADD COLUMN     "status" TEXT;

-- CreateTable
CREATE TABLE "staff" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "pcowner" TEXT NOT NULL,

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "staff_userId_key" ON "staff"("userId");
