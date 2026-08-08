-- 1. إنشاء قاعدة البيانات
CREATE DATABASE IF NOT EXISTS `perfume_store`;
USE `perfume_store`;

-- 2. إنشاء جدول العطور (products)
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2) NOT NULL,
  `category` VARCHAR(100) DEFAULT 'عطور نيش',
  `image` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. إنشاء جدول الطلبات (orders)
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `address` TEXT NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `items` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. إضافة عطور افتراضية (مبدئية)
INSERT INTO `products` (`name`, `description`, `price`) VALUES
('عطر عود ملكي', 'عطر نيش فاخر بمكونات العود الساحرة والمسك', 350.00),
('عطر روز الفاخر', 'نغمات الورد والياسمين مع الفانيليا الدافئة', 280.00),
('عطر ليدر نايت', 'جلد فاخر مع لمسات العنبر والأخشاب النادرة', 420.00);
-- 5. جدول حسابات الزبائن (Users)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `governorate` VARCHAR(100) NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `street` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);