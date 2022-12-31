-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 08, 2020 at 08:26 AM
-- Server version: 5.7.30-0ubuntu0.18.04.1
-- PHP Version: 7.2.24-0ubuntu0.18.04.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hr_anjum`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendances`
--

CREATE TABLE `attendances` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `attendance_date` date DEFAULT NULL,
  `punch_in` time DEFAULT NULL,
  `punch_out` time DEFAULT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `note` varchar(255) DEFAULT '',
  `status` enum('accepted','rejected','pending') DEFAULT 'accepted',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `attendances`
--

INSERT INTO `attendances` (`id`, `employee_id`, `company_id`, `attendance_date`, `punch_in`, `punch_out`, `latitude`, `longitude`, `note`, `status`, `created_at`, `updated_at`) VALUES
(3, 4, 2, '2020-04-17', '04:20:56', NULL, '80.56', '70.98', '', 'rejected', '2020-04-17 04:20:56', '2020-04-17 04:20:56'),
(4, 4, 2, '2020-04-17', '04:21:01', NULL, '80.56', '70.98', '', 'accepted', '2020-04-17 04:21:01', '2020-04-17 04:21:01'),
(5, 4, 2, '2020-04-17', '04:21:04', NULL, '80.56', '70.98', '', 'accepted', '2020-04-17 04:21:04', '2020-04-17 04:21:04'),
(6, 4, 2, '2020-04-17', '04:22:13', NULL, '80.56', '70.98', '', 'accepted', '2020-04-17 04:22:13', '2020-04-17 04:22:13'),
(7, 4, 2, '2020-04-17', '04:22:16', NULL, '80.56', '70.98', '', 'rejected', '2020-04-17 04:22:16', '2020-04-17 04:22:16'),
(8, 4, 2, '2020-04-17', '04:22:19', NULL, '80.56', '70.98', '', 'accepted', '2020-04-17 04:22:19', '2020-04-17 04:22:19'),
(26, 4, 2, '2020-04-20', '14:04:08', '14:04:08', '24.2481135', '89.915046', '', 'rejected', '2020-04-20 14:04:08', '2020-04-20 14:04:08'),
(27, 4, 2, '2020-04-28', '11:19:00', '11:19:00', '31.9594292', '35.8627831', '', 'accepted', '2020-04-28 11:18:59', '2020-04-28 11:18:59'),
(28, 4, 2, '2020-05-01', '20:31:40', '20:31:40', '31.745591', '35.8051313', '', 'accepted', '2020-05-01 20:31:40', '2020-05-01 20:31:40'),
(29, 31, 2, '2020-05-01', '21:28:31', '21:28:31', '31.745591', '35.8051313', '', 'accepted', '2020-05-01 21:28:30', '2020-05-01 21:28:30'),
(30, 4, 2, '2020-05-05', '05:27:22', '05:27:22', '24.2481135', '89.915046', '', 'pending', '2020-05-05 05:27:22', '2020-05-05 05:27:22'),
(31, 4, 2, '2020-05-07', '09:33:53', '11:21:41', '24.2480911', '89.9150175', '', 'pending', '2020-05-07 09:33:52', '2020-05-07 09:33:52');

-- --------------------------------------------------------

--
-- Table structure for table `banks`
--

CREATE TABLE `banks` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `banks`
--

INSERT INTO `banks` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'City Bank', '2020-04-05 12:48:49', '2020-04-05 12:48:49'),
(2, 'Dutch Bangla Bank', '2020-04-05 12:49:04', '2020-04-05 12:49:04');

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` int(11) NOT NULL,
  `bank_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `bank_id`, `name`, `created_at`, `updated_at`) VALUES
(1, 1, 'Bashundhara', '2020-04-05 12:49:19', '2020-04-05 12:49:19'),
(2, 2, 'Uttara', '2020-04-05 12:49:31', '2020-04-05 12:49:31');

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name_en` varchar(255) DEFAULT NULL,
  `name_ar` varchar(255) DEFAULT NULL,
  `contact_person_name_en` varchar(255) DEFAULT NULL,
  `contact_person_name_ar` varchar(255) DEFAULT NULL,
  `phone_no` varchar(255) DEFAULT NULL,
  `bank_iban` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `social_security_number` varchar(255) DEFAULT NULL,
  `work_start_time` time DEFAULT NULL,
  `work_end_time` time DEFAULT NULL,
  `license_start_date` date DEFAULT NULL,
  `license_end_date` date DEFAULT NULL,
  `users_limit` int(11) DEFAULT NULL,
  `branches_limit` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `user_id`, `name_en`, `name_ar`, `contact_person_name_en`, `contact_person_name_ar`, `phone_no`, `bank_iban`, `image`, `social_security_number`, `work_start_time`, `work_end_time`, `license_start_date`, `license_end_date`, `users_limit`, `branches_limit`, `created_at`, `updated_at`) VALUES
(2, 1, 'Sayouri company ', 'السيوري ', 'habib', 'addfd', '014855574589', NULL, '1588521357559_56596.jpg', '44855', NULL, NULL, '2020-05-06', '2020-05-30', NULL, NULL, '2020-04-01 08:25:16', '2020-04-01 08:25:16'),
(3, 29, 'Ammar co', 'Ammar co', NULL, NULL, '01254', NULL, '1588007509760_18969.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-04-13 00:58:19', '2020-04-13 00:58:19'),
(5, 31, 'Habib Corporation as', 'Habib Corporation', 'Rahman', 'Habibur', '014589657aaa', '1254', '1587650925839_87154.jpg', '4', '10:00:00', '19:30:00', NULL, NULL, NULL, NULL, '2020-04-14 04:35:06', '2020-04-14 04:35:06'),
(6, 33, 'shapa ind.', 'shapa ind.', NULL, NULL, '01992696978', '1254', NULL, '4587', '21:00:00', '18:00:00', NULL, NULL, NULL, NULL, '2020-04-16 12:43:24', '2020-04-16 12:43:24'),
(8, 40, 'jahangir', 'jahangir ', 'habib', 'habbi', '01992696978', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-04-23 06:08:44', '2020-04-23 06:08:44');

-- --------------------------------------------------------

--
-- Table structure for table `company_branches`
--

CREATE TABLE `company_branches` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `branch_name` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `company_branches`
--

INSERT INTO `company_branches` (`id`, `company_id`, `branch_name`, `street`, `area`, `city`, `latitude`, `longitude`, `created_at`, `updated_at`) VALUES
(1, 2, 'ka', 'Kalachandpur', 'Notun Bazar', 'Dhaka', '14', '15', '2020-04-16 11:25:37', '2020-04-16 11:25:37'),
(2, 2, 'Norda Shakhaa', 'ajij shorok', 'Vatara', 'Dhaka', '23.58', '84.56', '2020-04-16 11:59:46', '2020-04-16 11:59:46');

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Bangladesh', '2020-04-05 12:30:10', '2020-04-05 12:30:10'),
(2, 'Jordan', '2020-04-05 12:30:21', '2020-04-05 12:30:21');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `supervisor_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `company_id`, `supervisor_id`, `name`, `created_at`, `updated_at`) VALUES
(1, 2, 4, 'IT Department', '2020-04-22 06:24:29', '2020-04-22 06:24:29'),
(2, 2, 4, 'Teaching Department s', '2020-04-22 06:57:48', '2020-04-22 06:57:48'),
(6, 2, 21, 'Engineering Department', '2020-04-23 15:14:57', '2020-04-23 15:14:57');

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

CREATE TABLE `designations` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `designations`
--

INSERT INTO `designations` (`id`, `company_id`, `name`, `created_at`, `updated_at`) VALUES
(1, 2, 'Engineer', '2020-04-22 07:51:11', '2020-04-22 07:51:11'),
(11, 2, 'Manager', '2020-04-22 08:09:25', '2020-04-22 08:09:25'),
(12, 2, 'Salesman', '2020-04-22 08:09:26', '2020-04-22 08:09:26'),
(13, 2, 'CEO', '2020-04-24 18:59:43', '2020-04-24 18:59:43'),
(15, 2, 'a', '2020-04-24 19:00:07', '2020-04-24 19:00:07'),
(16, 2, 'b', '2020-04-24 19:00:09', '2020-04-24 19:00:09'),
(17, 2, 'c', '2020-04-24 19:00:10', '2020-04-24 19:00:10'),
(18, 2, 'd', '2020-04-24 19:00:12', '2020-04-24 19:00:12');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `first_name_en` varchar(255) DEFAULT NULL,
  `second_name_en` varchar(255) DEFAULT NULL,
  `third_name_en` varchar(255) DEFAULT NULL,
  `first_name_ar` varchar(255) DEFAULT NULL,
  `second_name_ar` varchar(255) DEFAULT NULL,
  `third_name_ar` varchar(255) DEFAULT NULL,
  `family_name_en` varchar(255) DEFAULT NULL,
  `family_name_ar` varchar(255) DEFAULT NULL,
  `phone_no` varchar(255) DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `marital_status` enum('Married','Unmarried') DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `job_title` varchar(255) DEFAULT NULL,
  `salary` varchar(255) DEFAULT NULL,
  `bank_iban` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `social_security_number` varchar(255) DEFAULT NULL,
  `work_start_time` time DEFAULT NULL,
  `work_end_time` time DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `start_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `user_id`, `company_id`, `first_name_en`, `second_name_en`, `third_name_en`, `first_name_ar`, `second_name_ar`, `third_name_ar`, `family_name_en`, `family_name_ar`, `phone_no`, `gender`, `marital_status`, `street`, `area`, `city`, `department`, `job_title`, `salary`, `bank_iban`, `image`, `social_security_number`, `work_start_time`, `work_end_time`, `dob`, `start_date`, `created_at`, `updated_at`) VALUES
(4, 3, 2, 'Debashish', 'Saha', 'Pranta', 'Debashish', 'Saha', 'Pranta', NULL, NULL, '015213075107aaa', 'Male', NULL, NULL, NULL, NULL, 'Engineer', 'Software Engineer', '50000', '4444', '1587880748106_42436.jpg', NULL, NULL, NULL, '1970-02-01', '2020-04-23 10:50:05', '2020-04-02 11:07:33', '2020-04-02 11:07:33'),
(20, 24, 2, 'Abu', 'Taleb', 'Sumon', 'Abu', 'Taleb', 'Sumon', NULL, NULL, '01992353525', 'Male', 'Married', 'Ajirj shorok', 'Khilket', 'Dhaka', 'Engineering', 'engineer', '100000', '4497', '1588007360071_31543.jpg', '4587', '09:00:00', '18:00:00', '1990-04-04', '2020-04-23 10:50:05', '2020-04-11 21:25:41', '2020-04-11 21:25:41'),
(21, 25, 2, 'Rahat', 'Mia', 'Khan', 'Rahat', 'Mia', 'Khan', NULL, NULL, '01992696978', 'Male', 'Unmarried', 'jhh', NULL, NULL, 'Engineering', 'engineer', '100000', '1254', '1587126588984_28816.jpg', '1245', '09:00:00', '18:00:00', '1993-04-04', '2020-04-23 10:50:05', '2020-04-11 21:38:52', '2020-04-11 21:38:52'),
(27, 36, 2, 'abdullah', 'al', 'hasan', 'abdullah', 'al', 'hasan', NULL, NULL, '01992696978', 'Male', '', 'Kalachandpur', 'Notun Bazar', 'Dhaka', 'Engineering', 'engineer', '1000005', '1254', NULL, '4587', '09:30:00', '18:00:00', '1998-01-01', '2020-04-23 10:50:05', '2020-04-17 08:55:08', '2020-04-17 08:55:08'),
(29, 39, 2, 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', '01992696978', 'Male', 'Married', 'a', 'a', 'a', NULL, NULL, '100000', '1254', NULL, '4587', '09:00:00', '17:00:00', '2020-04-13', '2020-03-31 18:00:00', '2020-04-23 05:14:33', '2020-04-23 05:14:33'),
(30, 41, 2, 'omar', 'mohammad', 'nahar', 'عمر', 'محمد', 'نهار', 'Daham', 'الدهام', '0796230037', 'Male', 'Married', NULL, NULL, NULL, NULL, NULL, '1500', NULL, '1587785460258_34441.png', NULL, '09:00:00', '17:00:00', '1981-02-17', '2006-12-31 22:00:00', '2020-04-25 03:30:06', '2020-04-25 03:30:06'),
(31, 42, 2, 'Amenah', 'Omar', 'Nahar', 'امينة', 'عمر', 'محمد', 'Daham', 'الدهام', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1588368029700_18089.jpg', NULL, '09:00:00', '17:00:00', NULL, '2020-05-01 21:13:07', '2020-05-01 21:13:07', '2020-05-01 21:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `employee_available_leave_numbers`
--

CREATE TABLE `employee_available_leave_numbers` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `leave_type_id` int(11) NOT NULL,
  `available_leaves` int(11) NOT NULL DEFAULT '0',
  `is_individual` enum('1','0') NOT NULL DEFAULT '0',
  `accepted_leave_number` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employee_available_leave_numbers`
--

INSERT INTO `employee_available_leave_numbers` (`id`, `employee_id`, `company_id`, `leave_type_id`, `available_leaves`, `is_individual`, `accepted_leave_number`, `created_at`, `updated_at`) VALUES
(2, 3, 2, 2, 10, '0', 0, '2020-04-05 14:03:01', '2020-04-05 14:03:01'),
(7, 3, 2, 14, 4, '0', 0, '2020-04-12 15:45:46', '2020-04-12 15:45:46'),
(8, 3, 2, 8, 100, '0', 0, '2020-04-12 15:46:21', '2020-04-12 15:46:21'),
(9, 3, 2, 15, 29, '0', 0, '2020-04-12 15:48:13', '2020-04-12 15:48:13'),
(10, 3, 2, 0, 0, '0', 0, '2020-04-12 15:48:15', '2020-04-12 15:48:15'),
(11, 3, 2, 16, 7, '0', 0, '2020-04-12 15:48:44', '2020-04-12 15:48:44'),
(12, 3, 2, 13, 7, '0', 0, '2020-04-12 15:49:46', '2020-04-12 15:49:46'),
(13, 3, 2, 7, 1000000, '0', 0, '2020-04-12 22:24:59', '2020-04-12 22:24:59'),
(14, 21, 2, 17, 2, '0', 0, '2020-04-13 19:52:00', '2020-04-13 19:52:00'),
(15, 20, 2, 1, 10, '0', 0, '2020-04-15 13:02:13', '2020-04-15 13:02:13'),
(16, 20, 2, 18, 7, '0', 0, '2020-04-16 07:34:25', '2020-04-16 07:34:25'),
(17, 0, 2, 0, 0, '0', 0, '2020-04-16 09:55:07', '2020-04-16 09:55:07'),
(18, 26, 2, 17, 10, '0', 0, '2020-04-17 08:42:25', '2020-04-17 08:42:25'),
(21, 20, 2, 9, 1, '0', 0, '2020-04-19 12:01:05', '2020-04-19 12:01:05'),
(22, 20, 2, 19, 1, '0', 0, '2020-04-19 12:51:44', '2020-04-19 12:51:44'),
(23, 20, 2, 11, 7, '0', 0, '2020-04-19 12:53:51', '2020-04-19 12:53:51'),
(24, 20, 2, 22, 20, '0', 0, '2020-04-19 13:05:18', '2020-04-19 13:05:18'),
(25, 20, 2, 2, 1, '0', 0, '2020-04-19 13:08:02', '2020-04-19 13:08:02'),
(26, 20, 2, 24, 200, '0', 0, '2020-04-19 13:12:30', '2020-04-19 13:12:30'),
(31, 4, 2, 1, 11, '0', 0, '2020-04-23 17:46:58', '2020-04-23 17:46:58'),
(32, 4, 2, 41, 0, '0', 0, '2020-05-07 17:12:11', '2020-05-07 17:12:11'),
(33, 4, 2, 40, 6, '0', 0, '2020-05-07 17:12:11', '2020-05-07 17:12:11'),
(34, 4, 2, 43, 0, '0', 0, '2020-05-07 17:12:11', '2020-05-07 17:12:11'),
(35, 4, 2, 44, 10, '0', 0, '2020-05-07 17:12:11', '2020-05-07 17:12:11'),
(36, 4, 2, 45, 0, '0', 0, '2020-05-07 17:12:11', '2020-05-07 17:12:11'),
(37, 4, 2, 46, 0, '0', 0, '2020-05-07 17:12:11', '2020-05-07 17:12:11'),
(38, 20, 2, 47, 0, '0', 0, '2020-05-08 08:11:08', '2020-05-08 08:11:08'),
(39, 20, 2, 48, 0, '0', 0, '2020-05-08 08:11:08', '2020-05-08 08:11:08'),
(40, 20, 2, 49, 0, '0', 0, '2020-05-08 08:11:08', '2020-05-08 08:11:08');

-- --------------------------------------------------------

--
-- Table structure for table `employee_company_branches`
--

CREATE TABLE `employee_company_branches` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `company_branch_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employee_company_branches`
--

INSERT INTO `employee_company_branches` (`id`, `employee_id`, `company_branch_id`, `created_at`, `updated_at`) VALUES
(1, 4, 2, '2020-05-04 18:15:28', '2020-05-04 18:15:28'),
(2, 21, 1, '2020-05-04 18:16:23', '2020-05-04 18:16:23');

-- --------------------------------------------------------

--
-- Table structure for table `employee_departments`
--

CREATE TABLE `employee_departments` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `department_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employee_departments`
--

INSERT INTO `employee_departments` (`id`, `employee_id`, `department_id`, `created_at`, `updated_at`) VALUES
(1, 29, 1, '2020-04-23 05:14:33', '2020-04-23 05:14:33'),
(2, 4, 2, '2020-04-23 14:42:16', '2020-04-23 14:42:16'),
(3, 30, 1, '2020-04-25 03:30:06', '2020-04-25 03:30:06'),
(4, 31, 1, '2020-05-01 21:13:07', '2020-05-01 21:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `employee_designations`
--

CREATE TABLE `employee_designations` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `designation_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employee_designations`
--

INSERT INTO `employee_designations` (`id`, `employee_id`, `designation_id`, `created_at`, `updated_at`) VALUES
(1, 29, 1, '2020-04-23 05:14:33', '2020-04-23 05:14:33'),
(2, 4, 12, '2020-04-23 14:42:28', '2020-04-23 14:42:28'),
(3, 30, 1, '2020-04-25 03:30:06', '2020-04-25 03:30:06'),
(4, 31, 11, '2020-05-01 21:13:07', '2020-05-01 21:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `employee_leave_requests`
--

CREATE TABLE `employee_leave_requests` (
  `id` int(11) NOT NULL,
  `employee_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `leave_type_id` int(11) NOT NULL,
  `start_date_time` datetime DEFAULT NULL,
  `end_date_time` datetime DEFAULT NULL,
  `note` text,
  `image` varchar(255) DEFAULT NULL,
  `status` enum('accepted','rejected','pending') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `employee_leave_requests`
--

INSERT INTO `employee_leave_requests` (`id`, `employee_id`, `company_id`, `leave_type_id`, `start_date_time`, `end_date_time`, `note`, `image`, `status`, `created_at`, `updated_at`) VALUES
(15, 4, 2, 7, '2020-04-26 00:00:00', '2020-04-26 00:00:00', '', '1587874599043_29815.JPG', 'accepted', '2020-04-26 04:16:39', '2020-04-26 04:16:39'),
(16, 4, 2, 19, '2020-04-26 00:00:00', '2020-04-26 00:00:00', '', NULL, 'accepted', '2020-04-26 04:45:11', '2020-04-26 04:45:11'),
(18, 4, 2, 3, '2020-04-28 14:05:00', '2020-04-28 14:05:00', '', NULL, 'rejected', '2020-04-28 11:21:17', '2020-04-28 11:21:17'),
(19, 4, 2, 3, '2020-04-28 14:05:00', '2020-04-28 14:05:00', '', NULL, 'accepted', '2020-04-28 11:21:17', '2020-04-28 11:21:17'),
(20, 4, 2, 9, '2020-05-01 02:48:00', '2020-05-01 04:48:00', '', NULL, 'accepted', '2020-05-01 21:03:28', '2020-05-01 21:03:28'),
(21, 31, 2, 11, '2020-05-02 00:23:00', '2020-07-29 00:23:00', '', NULL, 'accepted', '2020-05-01 21:25:37', '2020-05-01 21:25:37'),
(23, 4, 2, 2, '2020-05-05 11:44:00', '2020-05-06 11:44:00', '', '1588659364495_40767.JPG', 'rejected', '2020-05-05 06:16:04', '2020-05-05 06:16:04'),
(24, 4, 2, 3, '2020-05-05 11:44:00', '2020-05-05 11:44:00', '', '1588659390793_89007.HEIC', 'accepted', '2020-05-05 06:16:30', '2020-05-05 06:16:30'),
(26, 4, 2, 16, '2020-05-05 20:10:00', '2020-05-05 20:10:00', '', '1588688101476_22252.JPG', 'rejected', '2020-05-05 14:15:01', '2020-05-05 14:15:01'),
(27, 4, 2, 40, '2020-05-08 11:01:00', '2020-05-08 11:01:00', '', '1588915291728_11556.JPG', 'rejected', '2020-05-08 05:21:31', '2020-05-08 05:21:31'),
(28, 4, 2, 40, '2020-05-08 11:01:00', '2020-05-08 11:01:00', '', '1588915309122_15150.JPG', 'rejected', '2020-05-08 05:21:49', '2020-05-08 05:21:49'),
(29, 4, 2, 40, '2020-05-08 11:01:00', '2020-05-08 11:01:00', '', '1588915376612_34984.JPG', 'rejected', '2020-05-08 05:22:56', '2020-05-08 05:22:56'),
(32, 4, 2, 40, '2020-05-08 11:01:00', '2020-05-08 11:01:00', '', NULL, 'pending', '2020-05-08 05:39:21', '2020-05-08 05:39:21'),
(33, 4, 2, 40, '2020-05-08 11:01:00', '2020-05-08 11:01:00', '', NULL, 'pending', '2020-05-08 05:48:30', '2020-05-08 05:48:30'),
(34, 4, 2, 40, '2020-05-08 10:48:00', '2020-05-08 10:48:00', '', NULL, 'pending', '2020-05-08 05:56:36', '2020-05-08 05:56:36'),
(35, 4, 2, 40, '2020-05-08 10:48:00', '2020-05-08 10:48:00', '', NULL, 'rejected', '2020-05-08 05:57:03', '2020-05-08 05:57:03'),
(36, 4, 2, 45, '2020-05-08 13:10:00', '2020-05-08 13:10:00', '', NULL, 'rejected', '2020-05-08 07:20:19', '2020-05-08 07:20:19'),
(37, 4, 2, 40, '2020-05-08 13:10:00', '2020-05-08 13:10:00', '', '1588922444866_33095.JPG', 'accepted', '2020-05-08 07:20:44', '2020-05-08 07:20:44'),
(40, 4, 2, 45, '2020-05-08 13:37:00', '2020-05-08 13:37:00', '', '1588923831836_93233.jpg', 'accepted', '2020-05-08 07:43:51', '2020-05-08 07:43:51'),
(41, 4, 2, 45, '2020-05-08 13:10:00', '2020-05-08 13:10:00', '', '1588923897575_66606.jpg', 'accepted', '2020-05-08 07:44:57', '2020-05-08 07:44:57'),
(42, 4, 2, 45, '2020-05-08 14:12:00', '2020-05-08 14:12:00', 'Asdf', NULL, 'pending', '2020-05-08 08:14:03', '2020-05-08 08:14:03');

-- --------------------------------------------------------

--
-- Table structure for table `leave_types`
--

CREATE TABLE `leave_types` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `type` enum('leave','vacation') NOT NULL,
  `available_number` int(11) NOT NULL DEFAULT '0',
  `is_active` enum('1','0') NOT NULL COMMENT '1 for active, 0 for inactive',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `leave_types`
--

INSERT INTO `leave_types` (`id`, `company_id`, `name`, `type`, `available_number`, `is_active`, `created_at`, `updated_at`) VALUES
(2, 0, 'Business Leave', 'leave', 0, '', '2020-03-30 12:58:18', '2020-03-30 12:58:18'),
(3, 0, 'Personal Leave', 'leave', 0, '', '2020-03-30 12:58:31', '2020-03-30 12:58:31'),
(4, 0, 'Maternity Leave', 'leave', 0, '', '2020-03-30 12:58:52', '2020-03-30 12:58:52'),
(5, 0, 'Unpaid Leave', 'leave', 0, '', '2020-03-30 12:59:02', '2020-03-30 12:59:02'),
(6, 0, 'Marriage Leave', 'leave', 0, '', '2020-03-30 12:59:20', '2020-03-30 12:59:20'),
(7, 0, 'Patternity Leave', 'leave', 0, '', '2020-03-30 12:59:43', '2020-03-30 12:59:43'),
(8, 0, 'Death Leave', 'leave', 0, '1', '2020-04-12 14:21:47', '2020-04-12 14:21:47'),
(9, 0, 'Death Leave', 'leave', 0, '1', '2020-04-12 14:21:56', '2020-04-12 14:21:56'),
(10, 0, '', 'leave', 0, '1', '2020-04-12 14:31:34', '2020-04-12 14:31:34'),
(11, 0, 'ali leave', 'leave', 0, '1', '2020-04-12 14:33:42', '2020-04-12 14:33:42'),
(12, 0, 'shapa leave', 'leave', 0, '1', '2020-04-12 14:40:59', '2020-04-12 14:40:59'),
(13, 0, 'ma leave', 'leave', 0, '1', '2020-04-12 14:42:17', '2020-04-12 14:42:17'),
(14, 0, 'baba leave', 'leave', 0, '1', '2020-04-12 14:43:36', '2020-04-12 14:43:36'),
(15, 0, 'salsabil leave', 'leave', 0, '1', '2020-04-12 14:45:06', '2020-04-12 14:45:06'),
(16, 0, 'rani barai', 'leave', 0, '1', '2020-04-12 14:46:02', '2020-04-12 14:46:02'),
(17, 0, 'pohela boishakh leave', 'leave', 0, '1', '2020-04-13 19:51:41', '2020-04-13 19:51:41'),
(18, 0, 'habbi', 'leave', 0, '1', '2020-04-16 07:34:17', '2020-04-16 07:34:17'),
(19, 0, 'shakil leave', 'leave', 0, '1', '2020-04-18 13:57:00', '2020-04-18 13:57:00'),
(20, 0, 'h123', 'leave', 0, '1', '2020-04-19 11:49:11', '2020-04-19 11:49:11'),
(21, 0, 'habib', 'leave', 0, '1', '2020-04-19 11:56:04', '2020-04-19 11:56:04'),
(22, 0, 'aaa', 'leave', 0, '1', '2020-04-19 13:00:36', '2020-04-19 13:00:36'),
(23, 0, 'aaaaaaaaaa', 'leave', 0, '1', '2020-04-19 13:04:51', '2020-04-19 13:04:51'),
(24, 0, '123', 'leave', 0, '1', '2020-04-19 13:12:20', '2020-04-19 13:12:20'),
(25, 0, '', 'leave', 0, '1', '2020-04-19 13:23:43', '2020-04-19 13:23:43'),
(26, 0, 'habib', 'leave', 0, '1', '2020-04-19 13:25:35', '2020-04-19 13:25:35'),
(27, 0, 'kohli', 'leave', 0, '1', '2020-04-21 11:52:32', '2020-04-21 11:52:32'),
(28, 0, 'gorib', 'leave', 0, '1', '2020-04-21 11:53:16', '2020-04-21 11:53:16'),
(29, 0, 'aa', 'leave', 0, '1', '2020-04-21 11:57:58', '2020-04-21 11:57:58'),
(30, 0, 'Death Leave', 'leave', 0, '1', '2020-04-21 12:20:40', '2020-04-21 12:20:40'),
(31, 0, 'Vanilla leave', 'leave', 0, '1', '2020-04-21 12:37:00', '2020-04-21 12:37:00'),
(32, 0, 'i', 'leave', 0, '1', '2020-04-21 12:39:03', '2020-04-21 12:39:03'),
(33, 0, '45', 'leave', 0, '1', '2020-04-21 12:40:41', '2020-04-21 12:40:41'),
(40, 2, 'Paternity Leave', 'vacation', 6, '1', '2020-04-24 06:48:01', '2020-04-24 06:48:01'),
(41, 2, 'Maternity leave', 'vacation', 0, '1', '2020-04-24 18:40:49', '2020-04-24 18:40:49'),
(43, 2, 'Sick Leave', 'vacation', 0, '1', '2020-04-24 19:47:09', '2020-04-24 19:47:09'),
(44, 2, 'Annual Vacation ', 'vacation', 10, '1', '2020-04-27 05:31:52', '2020-04-27 05:31:52'),
(45, 2, 'Very sick leave ( Leave)', 'leave', 0, '1', '2020-05-05 06:57:53', '2020-05-05 06:57:53'),
(46, 2, 'Sick leave (Vacation)', 'leave', 0, '1', '2020-05-05 06:59:11', '2020-05-05 06:59:11'),
(47, 2, 'debashish leave', 'vacation', 0, '1', '2020-05-08 07:49:15', '2020-05-08 07:49:15'),
(48, 2, 'Deba ', 'vacation', 0, '1', '2020-05-08 07:50:35', '2020-05-08 07:50:35'),
(49, 2, 'Ddkf', 'vacation', 0, '1', '2020-05-08 07:53:16', '2020-05-08 07:53:16');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_type_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `otp` varchar(255) DEFAULT 'yteqper57485894iflcdfhsdf',
  `device_id` varchar(255) DEFAULT NULL,
  `latitude` varchar(255) DEFAULT NULL,
  `longitude` varchar(255) DEFAULT NULL,
  `is_active` enum('1','0') DEFAULT '1' COMMENT '1 for active, 0 for inactive',
  `online_status` enum('online','offline') DEFAULT 'offline',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_type_id`, `username`, `email`, `password`, `otp`, `device_id`, `latitude`, `longitude`, `is_active`, `online_status`, `created_at`, `updated_at`) VALUES
(1, 2, 'bshabib', 'habiburr.bs23@gmail.com', '$2a$08$PWeAmwsq7hClxhm1AmYCluDClYe1wwO9ljuj4a7rrDSQiDkFkmO22', '$2a$08$yARxIxkhbBgnzispQXu7CONRYBhTEpfOe4bBC8i2tBPsZl.zquVYO', NULL, NULL, NULL, '1', '', '2020-04-01 08:23:37', '2020-04-01 08:23:37'),
(3, 1, 'pranta', 'debasishsahapranta@gmail.com', '$2a$08$F6IS27rC80CB4dEmpxNufeyRWXYr9E28hPq7zjwekrN20rn6ndt2e', '$2a$08$dn7Su//qJBV/5toRNdkkee7XtvzKM0oYB1YR1r0KGakyBONLrxOnK', 'erjEituKWkZHnkrMBgJDYJ:APA91bG3EP6FqoJG0cHd8oxhnf5y_FLrx9InElKYk6JMIgk_s-JFQA6hltsz7lO_h_-2nweUHI_Sftdw7nBEfqBsuPXqHgx3EGsWfqNS6yIU1s8YZFqciq4R-1rvTJA_gw4w8zxRr4CX', NULL, NULL, '1', '', '2020-04-01 14:24:55', '2020-04-01 14:24:55'),
(24, 1, 'abutaleb', 'abutaleb@gmail.com', '12345678', 'yteqper57485894iflcdfhsdf', NULL, NULL, NULL, '1', 'online', '2020-04-11 21:25:41', '2020-04-11 21:25:41'),
(25, 1, 'rahat', 'rahat@gmail.com', '$2a$08$TH6PSHJYPPlM2Fdfr2so9uvr4bnkX9NFQbam5TKoeTHws5gqv6Jya', 'yteqper57485894iflcdfhsdf', NULL, NULL, NULL, '1', 'offline', '2020-04-11 21:38:52', '2020-04-11 21:38:52'),
(26, 3, 'omar', 'omar@gmail.com', '$2a$08$bCjyLLUinTuTJcvifcVwKeNnGYXFOZtXVPG2zHRFx6yol9GadFWZu', 'yteqper57485894iflcdfhsdf', NULL, NULL, NULL, '1', 'offline', '2020-04-12 23:29:38', '2020-04-12 23:29:38'),
(29, 2, 'ammar', 'ammar@gmail.com', '$2a$08$zAprPDXg9yPvZigO7k72aerJtnEyqOuK4u/zt4D1RHhI4trP8ppAG', 'yteqper57485894iflcdfhsdf', NULL, NULL, NULL, '1', 'offline', '2020-04-13 00:58:19', '2020-04-13 00:58:19'),
(31, 2, 'habibandco', 'habib@gmail.com', '$2a$08$cbBBIhi/DWSiHUoQWUOHaOfeLUC9w2SojEKMhC/XgFP69CEjon25q', 'yteqper57485894iflcdfhsdf', NULL, NULL, NULL, '1', 'offline', '2020-04-14 04:35:06', '2020-04-14 04:35:06'),
(33, 2, 'shapa', 'shapa@gmail.com', '$2a$08$aCviOgXI9urdAtd01ASHcu/e42pmsNbWmgD6vYyTK/SHo9QirNkvq', 'yteqper57485894iflcdfhsdf', NULL, NULL, NULL, '1', 'offline', '2020-04-16 12:43:24', '2020-04-16 12:43:24'),
(36, 1, 'abdullah', 'abdullah@gmail.com', '$2a$08$NKb51Aagb4OrGB8WUl5MTOuG2/PtJZ4yVdv3bZQQM5IgF8d3guULO', 'yteqper57485894iflcdfhsdf', NULL, NULL, NULL, '1', 'offline', '2020-04-17 08:55:08', '2020-04-17 08:55:08'),
(39, 1, 'uits_habib', 'habiburrahman3089@gmail.com', '$2a$08$5Ky/4pVYf0dRTDW8U1H4JOWRwO3bL4a4WPeDiYiVEM7rm0tCSQr/e', 'yteqper57485894iflcdfhsdf', NULL, NULL, NULL, '1', 'offline', '2020-04-23 05:14:33', '2020-04-23 05:14:33'),
(40, 2, 'jahangir', 'a@gmail.com', '$2a$08$c9SVAtixby1keqHG0t1rYepXMJCP47Ie7ECH3zJY2xDVM2sbqRE1i', 'yteqper57485894iflcdfhsdf', NULL, NULL, NULL, '0', 'offline', '2020-04-23 06:08:44', '2020-04-23 06:08:44'),
(41, 1, 'Omar.Daham', 'fuconess@gmail.com', '$2a$08$tlLf8AEmhtQBbO9b60jZDe7KDbG..F5j8baSe6qLXPuq0WT4/Flvm', '$2a$08$Cj.cq9d0.8n8qZ25HGvM2et2CvhMoXxaBs9fPQjyp.3uVuMOtjiDq', NULL, NULL, NULL, '1', 'offline', '2020-04-25 03:30:06', '2020-04-25 03:30:06'),
(42, 1, 'amenah', 'fuconess@gmail.com', '$2a$08$LrIu9fha0N4gjsnSZB.lMur/QVAjMZV68QZP9HubIp3AaLQQxraoG', 'yteqper57485894iflcdfhsdf', NULL, NULL, NULL, '1', 'offline', '2020-05-01 21:13:07', '2020-05-01 21:13:07');

-- --------------------------------------------------------

--
-- Table structure for table `user_bank_branches`
--

CREATE TABLE `user_bank_branches` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `bank_id` int(11) NOT NULL,
  `branch_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_bank_branches`
--

INSERT INTO `user_bank_branches` (`id`, `user_id`, `bank_id`, `branch_id`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 1, '2020-04-05 12:49:58', '2020-04-05 12:49:58'),
(2, 3, 1, 2, '2020-04-05 12:50:12', '2020-04-05 12:50:12'),
(4, 24, 2, 2, '2020-04-11 21:25:41', '2020-04-11 21:25:41'),
(5, 25, 1, 2, '2020-04-11 21:38:52', '2020-04-11 21:38:52'),
(6, 30, 1, 1, '2020-04-13 00:59:40', '2020-04-13 00:59:40'),
(7, 31, 1, 1, '2020-04-14 04:35:06', '2020-04-14 04:35:06'),
(8, 32, 1, 1, '2020-04-14 04:43:02', '2020-04-14 04:43:02'),
(9, 33, 1, 1, '2020-04-16 12:43:24', '2020-04-16 12:43:24'),
(10, 34, 1, 1, '2020-04-17 08:37:57', '2020-04-17 08:37:57'),
(11, 35, 1, 1, '2020-04-17 08:41:59', '2020-04-17 08:41:59'),
(12, 36, 1, 2, '2020-04-17 08:55:08', '2020-04-17 08:55:08'),
(13, 39, 1, 1, '2020-04-23 05:14:33', '2020-04-23 05:14:33'),
(14, 41, 1, 1, '2020-04-25 03:30:06', '2020-04-25 03:30:06');

-- --------------------------------------------------------

--
-- Table structure for table `user_countries`
--

CREATE TABLE `user_countries` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_countries`
--

INSERT INTO `user_countries` (`id`, `user_id`, `country_id`, `created_at`, `updated_at`) VALUES
(1, 2, 1, '2020-04-05 12:30:53', '2020-04-05 12:30:53'),
(2, 3, 1, '2020-04-05 12:31:16', '2020-04-05 12:31:16'),
(4, 24, 2, '2020-04-11 21:25:41', '2020-04-11 21:25:41'),
(5, 25, 1, '2020-04-11 21:38:52', '2020-04-11 21:38:52'),
(6, 30, 2, '2020-04-13 00:59:40', '2020-04-13 00:59:40'),
(7, 31, 2, '2020-04-14 04:35:06', '2020-04-14 04:35:06'),
(8, 32, 1, '2020-04-14 04:43:02', '2020-04-14 04:43:02'),
(9, 33, 1, '2020-04-16 12:43:24', '2020-04-16 12:43:24'),
(10, 34, 1, '2020-04-17 08:37:57', '2020-04-17 08:37:57'),
(11, 35, 2, '2020-04-17 08:41:59', '2020-04-17 08:41:59'),
(12, 36, 2, '2020-04-17 08:55:08', '2020-04-17 08:55:08'),
(13, 39, 1, '2020-04-23 05:14:33', '2020-04-23 05:14:33'),
(14, 40, 1, '2020-04-23 06:08:44', '2020-04-23 06:08:44'),
(15, 1, 2, '2020-04-23 10:20:02', '2020-04-23 10:20:02');

-- --------------------------------------------------------

--
-- Table structure for table `user_types`
--

CREATE TABLE `user_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_active` enum('1','0') NOT NULL COMMENT '1 for active, 0 for inactive',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_types`
--

INSERT INTO `user_types` (`id`, `name`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'employee', '', '2020-04-01 08:21:40', '2020-04-01 08:21:40'),
(2, 'company admin', '', '2020-04-01 08:21:56', '2020-04-01 08:21:56'),
(3, 'admin', '', '2020-04-01 08:22:11', '2020-04-01 08:22:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `banks`
--
ALTER TABLE `banks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `company_branches`
--
ALTER TABLE `company_branches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `designations`
--
ALTER TABLE `designations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_available_leave_numbers`
--
ALTER TABLE `employee_available_leave_numbers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_company_branches`
--
ALTER TABLE `employee_company_branches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_departments`
--
ALTER TABLE `employee_departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_designations`
--
ALTER TABLE `employee_designations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_leave_requests`
--
ALTER TABLE `employee_leave_requests`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `leave_types`
--
ALTER TABLE `leave_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_bank_branches`
--
ALTER TABLE `user_bank_branches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_countries`
--
ALTER TABLE `user_countries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_types`
--
ALTER TABLE `user_types`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT for table `banks`
--
ALTER TABLE `banks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `company_branches`
--
ALTER TABLE `company_branches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `designations`
--
ALTER TABLE `designations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;
--
-- AUTO_INCREMENT for table `employee_available_leave_numbers`
--
ALTER TABLE `employee_available_leave_numbers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
--
-- AUTO_INCREMENT for table `employee_company_branches`
--
ALTER TABLE `employee_company_branches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `employee_departments`
--
ALTER TABLE `employee_departments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `employee_designations`
--
ALTER TABLE `employee_designations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `employee_leave_requests`
--
ALTER TABLE `employee_leave_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
--
-- AUTO_INCREMENT for table `leave_types`
--
ALTER TABLE `leave_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
--
-- AUTO_INCREMENT for table `user_bank_branches`
--
ALTER TABLE `user_bank_branches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT for table `user_countries`
--
ALTER TABLE `user_countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT for table `user_types`
--
ALTER TABLE `user_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
