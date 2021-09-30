/*
  Warnings:

  - Added the required column `pv_id` to the `station` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `favorite_station` ADD COLUMN `stationDummySt_id` VARCHAR(191);

-- AlterTable
ALTER TABLE `station` ADD COLUMN `pv_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `checkin` (
    `ck_id` INTEGER NOT NULL AUTO_INCREMENT,
    `st_id` VARCHAR(191) NOT NULL,
    `comment` VARCHAR(191),
    `isCharge` BOOLEAN,
    `car_serve` VARCHAR(191),
    `power` DOUBLE NOT NULL,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(191),
    `create_by` VARCHAR(191),
    `stationDummySt_id` VARCHAR(191),

    PRIMARY KEY (`ck_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_img` (
    `id_img` INTEGER NOT NULL AUTO_INCREMENT,
    `ck_id` INTEGER NOT NULL,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(191),
    `create_by` VARCHAR(191),

    PRIMARY KEY (`id_img`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `station_dummy` (
    `st_id` VARCHAR(191) NOT NULL,
    `station_name_th` VARCHAR(191) NOT NULL,
    `station_name_en` VARCHAR(191),
    `station_desc` VARCHAR(191),
    `addr_th` VARCHAR(191),
    `addr_en` VARCHAR(191),
    `lat` DOUBLE,
    `lng` DOUBLE,
    `type_service` VARCHAR(191) NOT NULL DEFAULT 'public',
    `is24hr` BOOLEAN NOT NULL,
    `servicetime_open` VARCHAR(191),
    `servicetime_close` VARCHAR(191),
    `is_service_charge` BOOLEAN NOT NULL,
    `service_rate` DOUBLE,
    `status_approve` VARCHAR(191) NOT NULL DEFAULT 'W',
    `status_msg` VARCHAR(191),
    `station_status` INTEGER NOT NULL DEFAULT 1,
    `note` VARCHAR(191),
    `power` DOUBLE,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(191),
    `create_by` VARCHAR(191),
    `pv_id` INTEGER NOT NULL,

    PRIMARY KEY (`st_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProviderMaster` (
    `pv_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `desv` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`pv_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plug_mapping` (
    `p_mapping_id` INTEGER NOT NULL AUTO_INCREMENT,
    `st_id` VARCHAR(191) NOT NULL,
    `qty` INTEGER NOT NULL,
    `power` VARCHAR(191),
    `p_type_id` INTEGER NOT NULL,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(191),
    `create_by` VARCHAR(191),

    PRIMARY KEY (`p_mapping_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plug_mapping_dummy` (
    `p_mapping_id` INTEGER NOT NULL AUTO_INCREMENT,
    `st_id` VARCHAR(191) NOT NULL,
    `qty` INTEGER NOT NULL,
    `power` VARCHAR(191),
    `p_type_id` INTEGER NOT NULL,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(191),
    `create_by` VARCHAR(191),

    PRIMARY KEY (`p_mapping_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plug_type_master` (
    `p_type_id` INTEGER NOT NULL AUTO_INCREMENT,
    `p_title` VARCHAR(191) NOT NULL,
    `p_icon` VARCHAR(191) NOT NULL,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(191),
    `create_by` VARCHAR(191),

    PRIMARY KEY (`p_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `checkin` ADD CONSTRAINT `checkin_st_id_fkey` FOREIGN KEY (`st_id`) REFERENCES `station`(`st_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkin` ADD CONSTRAINT `checkin_stationDummySt_id_fkey` FOREIGN KEY (`stationDummySt_id`) REFERENCES `station_dummy`(`st_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_img` ADD CONSTRAINT `review_img_ck_id_fkey` FOREIGN KEY (`ck_id`) REFERENCES `checkin`(`ck_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite_station` ADD CONSTRAINT `favorite_station_stationDummySt_id_fkey` FOREIGN KEY (`stationDummySt_id`) REFERENCES `station_dummy`(`st_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `station` ADD CONSTRAINT `station_pv_id_fkey` FOREIGN KEY (`pv_id`) REFERENCES `ProviderMaster`(`pv_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `station_dummy` ADD CONSTRAINT `station_dummy_pv_id_fkey` FOREIGN KEY (`pv_id`) REFERENCES `ProviderMaster`(`pv_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plug_mapping` ADD CONSTRAINT `plug_mapping_st_id_fkey` FOREIGN KEY (`st_id`) REFERENCES `station`(`st_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plug_mapping` ADD CONSTRAINT `plug_mapping_p_type_id_fkey` FOREIGN KEY (`p_type_id`) REFERENCES `plug_type_master`(`p_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plug_mapping_dummy` ADD CONSTRAINT `plug_mapping_dummy_st_id_fkey` FOREIGN KEY (`st_id`) REFERENCES `station_dummy`(`st_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plug_mapping_dummy` ADD CONSTRAINT `plug_mapping_dummy_p_type_id_fkey` FOREIGN KEY (`p_type_id`) REFERENCES `plug_type_master`(`p_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
