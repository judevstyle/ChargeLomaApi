/*
  Warnings:

  - You are about to drop the `ProviderMaster` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `station` DROP FOREIGN KEY `station_pv_id_fkey`;

-- DropForeignKey
ALTER TABLE `station_dummy` DROP FOREIGN KEY `station_dummy_pv_id_fkey`;

-- DropTable
DROP TABLE `ProviderMaster`;

-- CreateTable
CREATE TABLE `provider_master` (
    `pv_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `desv` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(191),
    `create_by` VARCHAR(191),

    PRIMARY KEY (`pv_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `station` ADD CONSTRAINT `station_pv_id_fkey` FOREIGN KEY (`pv_id`) REFERENCES `provider_master`(`pv_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `station_dummy` ADD CONSTRAINT `station_dummy_pv_id_fkey` FOREIGN KEY (`pv_id`) REFERENCES `provider_master`(`pv_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
