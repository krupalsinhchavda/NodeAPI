-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 27, 2024 at 06:32 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.3.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dk`;

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE `city` (
  `id` int(11) NOT NULL,
  `cityname` varchar(255) NOT NULL,
  `countryId` int(11) NOT NULL,
  `population` int(11) NOT NULL,
  `createdOn` date NOT NULL,
  `ModifyOn` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`id`, `cityname`, `countryId`, `population`, `createdOn`, `ModifyOn`) VALUES
(1, 'New York', 1, 8175133, '2024-04-04', '0000-00-00'),
(3, 'Toronto', 2, 2731571, '2024-04-04', '0000-00-00'),
(4, 'London', 3, 8908081, '2024-04-04', '0000-00-00'),
(5, 'Ahmedabad', 6, 650000, '2024-04-12', '0000-00-00'),
(6, 'Surat', 6, 432000, '2024-04-12', '2024-04-13');

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE `country` (
  `id` int(11) NOT NULL,
  `countryname` varchar(255) DEFAULT NULL,
  `countrycode` varchar(3) DEFAULT NULL,
  `createdOn` date DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT NULL,
  `modifiedon` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `country`
--

INSERT INTO `country` (`id`, `countryname`, `countrycode`, `createdOn`, `IsActive`, `modifiedon`) VALUES
(1, 'United States', 'USA', '2024-04-06', 1, NULL),
(2, 'United Kingdom', 'UK', '2024-04-06', 1, NULL),
(3, 'Canada', 'CAN', '2024-04-06', 1, NULL),
(4, 'Australia', 'AUS', '2024-04-06', 1, NULL),
(5, 'Germany', 'GER', '2024-04-06', 1, NULL),
(6, 'BHARAT', 'IN', '2024-04-06', 1, '2024-04-06'),
(8, 'Afghanistan', 'AF', '2024-04-06', 1, NULL),
(9, 'Mayanmar', 'MN', '2024-04-10', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`name`, `address`) VALUES
('Company Inc', 'Highway 37'),
('John', 'Highway 71'),
('Drashti', 'Ahmedabad'),
('Amy', 'Apple st 652'),
('Hannah', 'Mountain 21'),
('Michael', 'Valley 345'),
('Sandy', 'Ocean blvd 2'),
('Betty', 'Green Grass 1'),
('Richard', 'Sky st 331'),
('Susan', 'One way 98'),
('Vicky', 'Yellow Garden 2'),
('Ben', 'Park Lane 38'),
('William', 'Central st 954'),
('Chuck', 'Main Road 989'),
('Viola', 'Sideway 1633'),
('krupalsinh', 'Ahmedabad'),
(NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `salesman`
--

CREATE TABLE `salesman` (
  `SalesmanID` int(11) NOT NULL,
  `FirstName` varchar(50) DEFAULT NULL,
  `LastName` varchar(50) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `ProfileImg` varchar(255) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `CityID` int(11) DEFAULT NULL,
  `State` char(2) DEFAULT NULL,
  `ZipCode` varchar(20) DEFAULT NULL,
  `HireDate` date DEFAULT NULL,
  `Commission` decimal(10,2) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT NULL,
  `ModifiedOn` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `salesman`
--

INSERT INTO `salesman` (`SalesmanID`, `FirstName`, `LastName`, `Email`, `Phone`, `ProfileImg`, `Address`, `CityID`, `State`, `ZipCode`, `HireDate`, `Commission`, `CreatedOn`, `ModifiedOn`) VALUES
(1, 'krupalsinh', 'chavda', 'krupalsinhchavda36143@gmail.com', '7600230620', 'uploads\\salesman\\075a686a-dc9b-4dae-a571-0c487f95376c\\1713696661397.jpg', 'Ahmedabad', 5, 'Gu', '382330', '2023-12-11', '18000.00', '2024-04-21 15:29:26', '2024-04-21 16:21:01');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `modifiedOn` date DEFAULT NULL,
  `createdOn` date DEFAULT NULL,
  `profilepic` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `IsActive`, `modifiedOn`, `createdOn`, `profilepic`, `reset_token`, `reset_token_expiry`) VALUES
(1, 'Krupalsinh', 'krupalsinhchavda36143@gmail.com', '$2a$10$7blwGLJ7wRPrbZyTMrKuGOe2zyIcFyjZxM9Ah1K47RwimIBx6B2le', 1, NULL, '2024-04-10', 'uploads\\profiles\\d3904c42-4595-410c-b4bf-636c89103869\\1713691622577.jpg', NULL, NULL),
(2, 'Drashtiji', 'drashtivaishnani25@gmail.com', '$2a$10$rnrNoZ28wBH7kYVgTypyneg1dk96FLOPixOkJdZusfNigkd8OLepO', 1, NULL, '2024-04-10', NULL, NULL, NULL),
(3, 'Divayraj', 'divyarajsnihsisodiya@gmail.com', '$2a$10$v839yZOKYyFT5lW2oz4HEe15mPSOW5GDGJY/vsg2/ovrozNOw0FiK', 1, NULL, '2024-04-22', NULL, '$2a$10$Qhs12kpvhMWbtc57idOCc.Eg05ZSQUTg9xmbvn8jyDDXJOlKUotRS', '2024-04-22 23:25:37');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`id`),
  ADD KEY `countryId` (`countryId`);

--
-- Indexes for table `country`
--
ALTER TABLE `country`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `salesman`
--
ALTER TABLE `salesman`
  ADD PRIMARY KEY (`SalesmanID`),
  ADD KEY `CityID` (`CityID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `city`
--
ALTER TABLE `city`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `country`
--
ALTER TABLE `country`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `salesman`
--
ALTER TABLE `salesman`
  MODIFY `SalesmanID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `city`
--
ALTER TABLE `city`
  ADD CONSTRAINT `city_ibfk_1` FOREIGN KEY (`countryId`) REFERENCES `country` (`id`);

--
-- Constraints for table `salesman`
--
ALTER TABLE `salesman`
  ADD CONSTRAINT `salesman_ibfk_1` FOREIGN KEY (`CityID`) REFERENCES `city` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
