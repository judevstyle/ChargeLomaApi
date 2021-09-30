/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `user` (
    `uid` INTEGER NOT NULL AUTO_INCREMENT,
    `display_name` VARCHAR(191) NOT NULL,
    `type_user` VARCHAR(191) NOT NULL DEFAULT 'admin',
    `email` VARCHAR(191) NOT NULL,
    `tel` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191),
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(191),
    `create_by` VARCHAR(191),

    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image_ticket` (
    `uid` INTEGER NOT NULL,
    `ticket_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_no` VARCHAR(191) NOT NULL,
    `status_approve` VARCHAR(191) NOT NULL DEFAULT 'W',
    `status_msg` VARCHAR(191) NOT NULL,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(191),
    `create_by` VARCHAR(191),

    PRIMARY KEY (`ticket_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image_ticket_body` (
    `ticket_bd_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_id` INTEGER NOT NULL,
    `img_path` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ticket_bd_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favorite_station` (
    `fav_id` VARCHAR(191) NOT NULL,
    `uid` INTEGER NOT NULL,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(191),
    `create_by` VARCHAR(191),
    `st_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`fav_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `station` (
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

    PRIMARY KEY (`st_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `image_ticket` ADD CONSTRAINT `image_ticket_uid_fkey` FOREIGN KEY (`uid`) REFERENCES `user`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `image_ticket_body` ADD CONSTRAINT `image_ticket_body_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `image_ticket`(`ticket_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite_station` ADD CONSTRAINT `favorite_station_uid_fkey` FOREIGN KEY (`uid`) REFERENCES `user`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite_station` ADD CONSTRAINT `favorite_station_st_id_fkey` FOREIGN KEY (`st_id`) REFERENCES `station`(`st_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
