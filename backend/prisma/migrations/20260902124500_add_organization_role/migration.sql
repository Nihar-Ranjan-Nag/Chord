-- Add organization accounts while keeping existing STUDENT data intact.
ALTER TABLE `User` MODIFY `role` ENUM('STUDENT', 'ORGANIZATION', 'ADMIN', 'SUPER_ADMIN') NOT NULL DEFAULT 'STUDENT';
