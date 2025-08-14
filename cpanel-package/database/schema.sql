-- LoanBondhu Database Schema for cPanel hosting
-- MySQL Database Structure

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(15) NOT NULL UNIQUE,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') DEFAULT 'user',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`),
  KEY `role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Members table
CREATE TABLE IF NOT EXISTS `members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `member_id` varchar(20) NOT NULL UNIQUE,
  `name` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text,
  `nid_number` varchar(20) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `join_date` date NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `member_id` (`member_id`),
  KEY `user_id` (`user_id`),
  KEY `phone` (`phone`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Loans table
CREATE TABLE IF NOT EXISTS `loans` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` int(11) NOT NULL,
  `loan_id` varchar(20) NOT NULL UNIQUE,
  `amount` decimal(12,2) NOT NULL,
  `interest_rate` decimal(5,2) NOT NULL,
  `installment_amount` decimal(12,2) NOT NULL,
  `total_installments` int(11) NOT NULL,
  `paid_installments` int(11) DEFAULT 0,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('active','completed','defaulted') DEFAULT 'active',
  `purpose` varchar(255) DEFAULT NULL,
  `guarantor_name` varchar(100) DEFAULT NULL,
  `guarantor_phone` varchar(15) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `loan_id` (`loan_id`),
  KEY `member_id` (`member_id`),
  KEY `status` (`status`),
  FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Repayments table
CREATE TABLE IF NOT EXISTS `repayments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `loan_id` int(11) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `payment_date` date NOT NULL,
  `installment_number` int(11) NOT NULL,
  `late_fee` decimal(12,2) DEFAULT 0.00,
  `payment_method` enum('cash','bank','mobile') DEFAULT 'cash',
  `receipt_number` varchar(50) DEFAULT NULL,
  `notes` text,
  `collected_by` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `loan_id` (`loan_id`),
  KEY `payment_date` (`payment_date`),
  KEY `collected_by` (`collected_by`),
  FOREIGN KEY (`loan_id`) REFERENCES `loans` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`collected_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Savings table
CREATE TABLE IF NOT EXISTS `savings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `member_id` int(11) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `transaction_type` enum('deposit','withdrawal') NOT NULL,
  `transaction_date` date NOT NULL,
  `balance_after` decimal(12,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `receipt_number` varchar(50) DEFAULT NULL,
  `processed_by` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `member_id` (`member_id`),
  KEY `transaction_date` (`transaction_date`),
  KEY `processed_by` (`processed_by`),
  FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Income/Expense table
CREATE TABLE IF NOT EXISTS `income_expense` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('income','expense') NOT NULL,
  `category` varchar(100) NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `description` text,
  `transaction_date` date NOT NULL,
  `receipt_number` varchar(50) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `type` (`type`),
  KEY `category` (`category`),
  KEY `transaction_date` (`transaction_date`),
  KEY `created_by` (`created_by`),
  FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Worker Salary table
CREATE TABLE IF NOT EXISTS `worker_salary` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `worker_name` varchar(100) NOT NULL,
  `position` varchar(100) NOT NULL,
  `salary_amount` decimal(12,2) NOT NULL,
  `pay_date` date NOT NULL,
  `month_year` varchar(7) NOT NULL,
  `bonus` decimal(12,2) DEFAULT 0.00,
  `deduction` decimal(12,2) DEFAULT 0.00,
  `net_pay` decimal(12,2) NOT NULL,
  `payment_method` enum('cash','bank','mobile') DEFAULT 'cash',
  `notes` text,
  `paid_by` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pay_date` (`pay_date`),
  KEY `month_year` (`month_year`),
  KEY `paid_by` (`paid_by`),
  FOREIGN KEY (`paid_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sessions table for user authentication
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) NOT NULL,
  `user_id` int(11) NOT NULL,
  `expires_at` timestamp NOT NULL,
  `data` text,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`),
  KEY `user_id` (`user_id`),
  KEY `expires_at` (`expires_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user
INSERT IGNORE INTO `users` (`phone`, `name`, `email`, `password`, `role`) VALUES 
('01650074073', 'Admin User', 'admin@loanbondhu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Create indexes for better performance
CREATE INDEX idx_loans_member_status ON `loans` (`member_id`, `status`);
CREATE INDEX idx_repayments_loan_date ON `repayments` (`loan_id`, `payment_date`);
CREATE INDEX idx_savings_member_date ON `savings` (`member_id`, `transaction_date`);
CREATE INDEX idx_income_expense_date_type ON `income_expense` (`transaction_date`, `type`);
