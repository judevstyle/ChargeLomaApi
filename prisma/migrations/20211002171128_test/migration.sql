-- CreateTable
CREATE TABLE `user` (
    `uid` VARCHAR(191) NOT NULL,
    `display_name` VARCHAR(191) NOT NULL,
    `type_user` VARCHAR(191) NOT NULL DEFAULT 'admin',
    `email` VARCHAR(191) NOT NULL,
    `tel` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191),
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(191),
    `create_by` VARCHAR(191),
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image_ticket` (
    `uid` VARCHAR(191) NOT NULL,
    `ticket_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_no` VARCHAR(191) NOT NULL,
    `status_approve` VARCHAR(191) NOT NULL DEFAULT 'W',
    `status_msg` VARCHAR(191) NOT NULL,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(191),
    `create_by` VARCHAR(191),
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`ticket_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
    `create_by` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `stationDummySt_id` VARCHAR(191),

    PRIMARY KEY (`ck_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_img` (
    `id_img` INTEGER NOT NULL AUTO_INCREMENT,
    `st_id` VARCHAR(191),
    `ck_id` INTEGER NOT NULL,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `img_path` VARCHAR(191) NOT NULL,
    `update_by` VARCHAR(191),
    `create_by` VARCHAR(191),
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id_img`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image_ticket_body` (
    `ticket_bd_id` INTEGER NOT NULL AUTO_INCREMENT,
    `ticket_id` INTEGER NOT NULL,
    `img_path` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`ticket_bd_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favorite_station` (
    `fav_id` VARCHAR(191) NOT NULL,
    `uid` VARCHAR(191) NOT NULL,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(191),
    `create_by` VARCHAR(191),
    `st_id` VARCHAR(191) NOT NULL,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `stationDummySt_id` VARCHAR(191),

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
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `pv_id` INTEGER NOT NULL,
    `station_img` VARCHAR(191),

    PRIMARY KEY (`st_id`)
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
    `edit_status` VARCHAR(191) NOT NULL DEFAULT 'wait',
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `pv_id` INTEGER NOT NULL,

    PRIMARY KEY (`st_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `provider_master` (
    `pv_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `desv` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(191),
    `create_by` VARCHAR(191),

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
    `deleted` BOOLEAN NOT NULL DEFAULT false,

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
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`p_mapping_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plug_type_master` (
    `p_type_id` INTEGER NOT NULL AUTO_INCREMENT,
    `p_title` VARCHAR(191) NOT NULL,
    `p_icon` VARCHAR(191),
    `created_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_by` VARCHAR(191),
    `create_by` VARCHAR(191),
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`p_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `image_ticket` ADD CONSTRAINT `image_ticket_uid_fkey` FOREIGN KEY (`uid`) REFERENCES `user`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkin` ADD CONSTRAINT `checkin_st_id_fkey` FOREIGN KEY (`st_id`) REFERENCES `station`(`st_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkin` ADD CONSTRAINT `checkin_stationDummySt_id_fkey` FOREIGN KEY (`stationDummySt_id`) REFERENCES `station_dummy`(`st_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `checkin` ADD CONSTRAINT `checkin_create_by_fkey` FOREIGN KEY (`create_by`) REFERENCES `user`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_img` ADD CONSTRAINT `review_img_ck_id_fkey` FOREIGN KEY (`ck_id`) REFERENCES `checkin`(`ck_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_img` ADD CONSTRAINT `review_img_st_id_fkey` FOREIGN KEY (`st_id`) REFERENCES `station`(`st_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `image_ticket_body` ADD CONSTRAINT `image_ticket_body_ticket_id_fkey` FOREIGN KEY (`ticket_id`) REFERENCES `image_ticket`(`ticket_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite_station` ADD CONSTRAINT `favorite_station_uid_fkey` FOREIGN KEY (`uid`) REFERENCES `user`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite_station` ADD CONSTRAINT `favorite_station_st_id_fkey` FOREIGN KEY (`st_id`) REFERENCES `station`(`st_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite_station` ADD CONSTRAINT `favorite_station_stationDummySt_id_fkey` FOREIGN KEY (`stationDummySt_id`) REFERENCES `station_dummy`(`st_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `station` ADD CONSTRAINT `station_pv_id_fkey` FOREIGN KEY (`pv_id`) REFERENCES `provider_master`(`pv_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `station_dummy` ADD CONSTRAINT `station_dummy_pv_id_fkey` FOREIGN KEY (`pv_id`) REFERENCES `provider_master`(`pv_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plug_mapping` ADD CONSTRAINT `plug_mapping_st_id_fkey` FOREIGN KEY (`st_id`) REFERENCES `station`(`st_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plug_mapping` ADD CONSTRAINT `plug_mapping_p_type_id_fkey` FOREIGN KEY (`p_type_id`) REFERENCES `plug_type_master`(`p_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plug_mapping_dummy` ADD CONSTRAINT `plug_mapping_dummy_st_id_fkey` FOREIGN KEY (`st_id`) REFERENCES `station_dummy`(`st_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plug_mapping_dummy` ADD CONSTRAINT `plug_mapping_dummy_p_type_id_fkey` FOREIGN KEY (`p_type_id`) REFERENCES `plug_type_master`(`p_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
