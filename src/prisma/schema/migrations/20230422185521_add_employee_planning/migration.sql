-- CreateEnum
CREATE TYPE "Day" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateTable
CREATE TABLE "EmployeePlanning" (
    "employeeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeePlanning_pkey" PRIMARY KEY ("employeeId")
);

-- CreateTable
CREATE TABLE "WorkTime" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "startHour" INTEGER NOT NULL,
    "endHour" "Day" NOT NULL,
    "startMinute" INTEGER NOT NULL,
    "endMinute" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkTime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmployeePlanning_employeeId_key" ON "EmployeePlanning"("employeeId");

-- AddForeignKey
ALTER TABLE "EmployeePlanning" ADD CONSTRAINT "EmployeePlanning_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkTime" ADD CONSTRAINT "WorkTime_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EmployeePlanning"("employeeId") ON DELETE CASCADE ON UPDATE CASCADE;
