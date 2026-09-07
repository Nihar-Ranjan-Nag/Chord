-- Normalize the role enum to exactly USER, ORGANIZATION, ADMIN without losing existing accounts.
ALTER TABLE `User` MODIFY `role` ENUM('STUDENT','USER','ORGANIZATION','ADMIN','SUPER_ADMIN') NOT NULL DEFAULT 'USER';
UPDATE `User` SET `role`='USER' WHERE `role`='STUDENT';
UPDATE `User` SET `role`='ADMIN' WHERE `role`='SUPER_ADMIN';
ALTER TABLE `User` MODIFY `role` ENUM('USER','ORGANIZATION','ADMIN') NOT NULL DEFAULT 'USER';

CREATE TABLE `Book` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(191) NOT NULL,
  `author` VARCHAR(191) NULL,
  `isbn` VARCHAR(191) NULL,
  `description` TEXT NULL,
  `coverUrl` VARCHAR(191) NULL,
  `depositAmount` DECIMAL(10,2) NOT NULL,
  `stock` INTEGER NOT NULL DEFAULT 1,
  `status` ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `createdById` INTEGER NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `Book_status_title_idx`(`status`,`title`),
  INDEX `Book_createdById_idx`(`createdById`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `BookBorrow` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `borrowCode` VARCHAR(191) NOT NULL,
  `bookId` INTEGER NOT NULL,
  `userId` INTEGER NOT NULL,
  `status` ENUM('BORROWED','RETURN_REQUESTED','RETURNED','DID_NOT_RETURN','CANCELLED') NOT NULL DEFAULT 'BORROWED',
  `paymentStatus` ENUM('PAID','REFUNDED','FORFEITED') NOT NULL DEFAULT 'PAID',
  `paidAmount` DECIMAL(10,2) NOT NULL,
  `refundAmount` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `borrowedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `dueAt` DATETIME(3) NULL,
  `returnRequestedAt` DATETIME(3) NULL,
  `returnedAt` DATETIME(3) NULL,
  `reviewedById` INTEGER NULL,
  `note` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `BookBorrow_borrowCode_key`(`borrowCode`),
  INDEX `BookBorrow_userId_status_idx`(`userId`,`status`),
  INDEX `BookBorrow_bookId_status_idx`(`bookId`,`status`),
  INDEX `BookBorrow_status_createdAt_idx`(`status`,`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `Book` ADD CONSTRAINT `Book_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `BookBorrow` ADD CONSTRAINT `BookBorrow_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `BookBorrow` ADD CONSTRAINT `BookBorrow_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `BookBorrow` ADD CONSTRAINT `BookBorrow_reviewedById_fkey` FOREIGN KEY (`reviewedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
