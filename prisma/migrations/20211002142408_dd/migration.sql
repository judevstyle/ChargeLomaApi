/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `favorite_station` DROP FOREIGN KEY `favorite_station_uid_fkey`;

-- DropForeignKey
ALTER TABLE `image_ticket` DROP FOREIGN KEY `image_ticket_uid_fkey`;

-- AlterTable
ALTER TABLE `favorite_station` MODIFY `uid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `image_ticket` MODIFY `uid` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `review_img` ADD COLUMN `st_id` VARCHAR(191);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `uid` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`uid`);

-- AddForeignKey
ALTER TABLE `image_ticket` ADD CONSTRAINT `image_ticket_uid_fkey` FOREIGN KEY (`uid`) REFERENCES `user`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_img` ADD CONSTRAINT `review_img_st_id_fkey` FOREIGN KEY (`st_id`) REFERENCES `station`(`st_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite_station` ADD CONSTRAINT `favorite_station_uid_fkey` FOREIGN KEY (`uid`) REFERENCES `user`(`uid`) ON DELETE RESTRICT ON UPDATE CASCADE;
