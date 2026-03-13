/*
  Warnings:

  - You are about to drop the column `visible` on the `menulink` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `blogpost` ADD COLUMN `keywords` VARCHAR(191) NULL,
    ADD COLUMN `metaDesc` TEXT NULL,
    ADD COLUMN `metaTitle` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `clientreview` ADD COLUMN `category` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `globalsettings` ADD COLUMN `address` TEXT NULL;

-- AlterTable
ALTER TABLE `herosection` ADD COLUMN `overlayOpacity` INTEGER NOT NULL DEFAULT 40;

-- AlterTable
ALTER TABLE `menulink` DROP COLUMN `visible`,
    ADD COLUMN `icon` VARCHAR(191) NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `isExternal` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `parentId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `portfolioitem` ADD COLUMN `categoryId` VARCHAR(191) NULL,
    ADD COLUMN `description` TEXT NULL,
    ADD COLUMN `isSuccessStory` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `liveUrl` VARCHAR(191) NULL,
    ADD COLUMN `repoUrl` VARCHAR(191) NULL,
    ADD COLUMN `stack` VARCHAR(191) NULL,
    MODIFY `category` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `seoconfig` ADD COLUMN `canonicalUrl` VARCHAR(191) NULL,
    ADD COLUMN `focusKeyword` VARCHAR(191) NULL,
    ADD COLUMN `ogDesc` TEXT NULL,
    ADD COLUMN `ogTitle` VARCHAR(191) NULL,
    ADD COLUMN `robotsFollow` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `robotsIndex` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `schemaType` VARCHAR(191) NOT NULL DEFAULT 'Organization',
    ADD COLUMN `twitterCard` VARCHAR(191) NOT NULL DEFAULT 'summary_large_image',
    ADD COLUMN `twitterDesc` TEXT NULL,
    ADD COLUMN `twitterImage` VARCHAR(191) NULL,
    ADD COLUMN `twitterTitle` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `statitem` ADD COLUMN `section` VARCHAR(191) NOT NULL DEFAULT 'results';

-- CreateTable
CREATE TABLE `PortfolioCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SocialLink` (
    `id` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CaseStudy` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `views` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `youtubeId` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `visible` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WebProject` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `client` VARCHAR(191) NULL,
    `techStack` JSON NOT NULL,
    `liveUrl` VARCHAR(191) NULL,
    `repoUrl` VARCHAR(191) NULL,
    `thumbnail` VARCHAR(191) NULL,
    `images` JSON NULL,
    `features` JSON NULL,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `WebProject_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FormSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `formType` VARCHAR(191) NOT NULL,
    `source` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `whatsapp` VARCHAR(191) NULL,
    `company` VARCHAR(191) NULL,
    `message` TEXT NULL,
    `metadata` JSON NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'new',
    `priority` VARCHAR(191) NOT NULL DEFAULT 'normal',
    `adminNotes` TEXT NULL,
    `scheduledDate` DATETIME(3) NULL,
    `scheduledTime` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `respondedAt` DATETIME(3) NULL,

    INDEX `FormSubmission_formType_idx`(`formType`),
    INDEX `FormSubmission_status_idx`(`status`),
    INDEX `FormSubmission_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NotificationSetting` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `emailEnabled` BOOLEAN NOT NULL DEFAULT false,
    `smtpHost` VARCHAR(191) NULL,
    `smtpPort` INTEGER NOT NULL DEFAULT 587,
    `smtpUser` VARCHAR(191) NULL,
    `smtpPass` VARCHAR(191) NULL,
    `adminEmail` VARCHAR(191) NULL,
    `enabledForms` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PortfolioItem` ADD CONSTRAINT `PortfolioItem_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `PortfolioCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuLink` ADD CONSTRAINT `MenuLink_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `MenuLink`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
