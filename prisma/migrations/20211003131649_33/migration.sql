/*
  Warnings:

  - You are about to drop the column `stationDummySt_id` on the `favorite_station` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `favorite_station` DROP FOREIGN KEY `favorite_station_stationDummySt_id_fkey`;

-- AlterTable
ALTER TABLE `favorite_station` DROP COLUMN `stationDummySt_id`;
