/*
  Warnings:

  - Made the column `create_by` on table `checkin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `checkin` MODIFY `create_by` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `checkin` ADD CONSTRAINT `checkin_create_by_fkey` FOREIGN KEY (`create_by`) REFERENCES `user`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;
