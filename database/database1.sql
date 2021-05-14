-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: qlchitieu
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `ID` varchar(100) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Username` varchar(30) DEFAULT NULL,
  `Password` varchar(1000) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `ActivatedDate` date NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `ID` varchar(100) NOT NULL,
  `Name` varchar(1000) NOT NULL,
  `IsDefault` tinyint(1) NOT NULL,
  `WalletID` varchar(100) DEFAULT NULL,
  `IconID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_Categories_Wallets` (`WalletID`),
  KEY `FK_Categories_Icons` (`IconID`),
  CONSTRAINT `FK_Categories_Icons` FOREIGN KEY (`IconID`) REFERENCES `icons` (`ID`),
  CONSTRAINT `FK_Categories_Wallets` FOREIGN KEY (`WalletID`) REFERENCES `wallets` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('1','Học tập',1,NULL,'1'),('2','Ăn uống',1,NULL,'2'),('dc1ed162-4ed9-49a6-90f9-6859c7f95ec8','Bánh kẹo',0,'0d20c650-902a-11eb-a75b-051e7845d661','2');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `ID` varchar(100) NOT NULL,
  `Name` varchar(1000) NOT NULL,
  `StartDate` datetime DEFAULT NULL,
  `NextDate` datetime DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `Status` int DEFAULT NULL,
  `Value` int DEFAULT NULL,
  `ExpectingAmount` float DEFAULT NULL,
  `TotalAmount` float DEFAULT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `WalletID` varchar(100) DEFAULT NULL,
  `CategoryID` varchar(100) DEFAULT NULL,
  `EventTypeID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_Events_EventTypes` (`EventTypeID`),
  KEY `FK_Events_Wallets` (`WalletID`),
  KEY `FK_Events_Categories` (`CategoryID`),
  CONSTRAINT `FK_Events_Categories` FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`ID`),
  CONSTRAINT `FK_Events_EventTypes` FOREIGN KEY (`EventTypeID`) REFERENCES `eventtypes` (`ID`),
  CONSTRAINT `FK_Events_Wallets` FOREIGN KEY (`WalletID`) REFERENCES `wallets` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES ('08132a35-bb5d-482b-9d55-043ff93c45bf','1','2021-04-10 22:34:48',NULL,'2021-04-18',0,0,-1000,0,NULL,'0d20c650-902a-11eb-a75b-051e7845d661','2','1'),('1','Nợ','2021-03-29 00:00:00','2021-03-30 00:00:00','2021-04-11',0,3,-500000,0,NULL,'0d20c650-902a-11eb-a75b-051e7845d661','1','2'),('115728f1-246a-4818-9275-2d94c83146bf','2','2021-04-10 22:34:59',NULL,NULL,0,0,-1000,0,NULL,'0d20c650-902a-11eb-a75b-051e7845d661','2','1'),('174d2529-f8a4-42e9-81ae-724d1977ff84','Minh','2021-04-10 00:00:00',NULL,'2021-04-30',0,10,-11000,0,NULL,'0d20c650-902a-11eb-a75b-051e7845d661','1','1'),('2','Tiền điện','2021-03-29 00:00:00','2021-03-30 00:00:00','2021-04-29',0,15,-400000,-1200000,NULL,'0d20c650-902a-11eb-a75b-051e7845d661','2','3'),('2fbb0aeb-4330-40c4-b690-de7a6c25a332','minh','2021-04-18 22:06:54',NULL,'2021-04-18',0,13,100011,0,NULL,'0d20c650-902a-11eb-a75b-051e7845d661','1','3'),('3','Tiền nước','2021-03-29 00:00:00','2021-03-30 00:00:00','2021-04-10',0,14,-400000,-800000,NULL,'0d20c650-902a-11eb-a75b-051e7845d661','2','2'),('3b8539bc-27d1-4236-81ac-69f74c087729','dă','2021-04-10 00:00:00',NULL,'2021-04-18',0,0,-1000,0,NULL,'0d20c650-902a-11eb-a75b-051e7845d661','2','1'),('5076fb38-3f5b-4d97-93fc-6895d81af8a3','awd','2021-04-18 23:29:57','2021-04-19 00:00:00',NULL,1,0,1000,0,'1231231','0d20c650-902a-11eb-a75b-051e7845d661','2','1'),('89b1f3d7-6868-4cfc-8206-bf6b1bdecfb5','123','2021-04-18 23:25:59','2021-05-13 00:00:00','2022-04-18',1,12,1000110,0,NULL,'0d20c650-902a-11eb-a75b-051e7845d661','1','3'),('9c5433a0-4049-4758-a5c6-7670cb06b235','123','2021-04-18 23:46:15','2021-04-19 00:00:00','2021-04-18',0,0,-1000,0,'124124214124','0d20c650-902a-11eb-a75b-051e7845d661','2','1'),('cf9ad7b6-ac71-47dc-a604-e71146b854d7','quang minh','2021-04-18 23:23:48','2021-06-01 00:00:00',NULL,1,5,-1000,0,NULL,'0d20c650-902a-11eb-a75b-051e7845d661','2','4'),('dbda6b45-590c-4bd5-aff0-ceb19e8a6188','','2021-04-10 00:00:00',NULL,NULL,0,0,-1000,0,NULL,'0d20c650-902a-11eb-a75b-051e7845d661','2','1');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventtypes`
--

DROP TABLE IF EXISTS `eventtypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventtypes` (
  `ID` varchar(100) NOT NULL,
  `Name` varchar(100) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventtypes`
--

LOCK TABLES `eventtypes` WRITE;
/*!40000 ALTER TABLE `eventtypes` DISABLE KEYS */;
INSERT INTO `eventtypes` VALUES ('1','Hằng ngày'),('2','Hằng tuần'),('3','Hằng tháng'),('4','Hằng năm');
/*!40000 ALTER TABLE `eventtypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `icons`
--

DROP TABLE IF EXISTS `icons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `icons` (
  `ID` varchar(100) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Color` varchar(7) DEFAULT NULL,
  `BackgroundColor` varchar(7) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `icons`
--

LOCK TABLES `icons` WRITE;
/*!40000 ALTER TABLE `icons` DISABLE KEYS */;
INSERT INTO `icons` VALUES ('1','school','#FFFFFF','#1DAF1A'),('2','fastfood','#FFFFFF','#FF2626');
/*!40000 ALTER TABLE `icons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `ID` varchar(100) NOT NULL,
  `Details` varchar(100) DEFAULT NULL,
  `DateNotified` datetime DEFAULT NULL,
  `IsRead` tinyint(1) DEFAULT NULL,
  `UserID` varchar(100) DEFAULT NULL,
  `TeamID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_Notifications_Teams` (`UserID`),
  CONSTRAINT `FK_Notifications_Teams` FOREIGN KEY (`UserID`) REFERENCES `teams` (`ID`),
  CONSTRAINT `FK_Notifications_Users` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resetrequests`
--

DROP TABLE IF EXISTS `resetrequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resetrequests` (
  `ID` varchar(100) NOT NULL,
  `UserID` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `IsSuccessful` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_ResetRequests_Users` (`UserID`),
  CONSTRAINT `FK_ResetRequests_Users` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resetrequests`
--

LOCK TABLES `resetrequests` WRITE;
/*!40000 ALTER TABLE `resetrequests` DISABLE KEYS */;
/*!40000 ALTER TABLE `resetrequests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `ID` varchar(100) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `MaxUsers` float NOT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `CreatedDate` date DEFAULT NULL,
  `AvatarURL` varchar(1000) DEFAULT NULL,
  `WalletID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_Teams_Wallets` (`WalletID`),
  CONSTRAINT `FK_Teams_Wallets` FOREIGN KEY (`WalletID`) REFERENCES `wallets` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams_has_users`
--

DROP TABLE IF EXISTS `teams_has_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams_has_users` (
  `UserID` varchar(100) NOT NULL,
  `TeamID` varchar(100) NOT NULL,
  `Role` int DEFAULT NULL,
  `Status` int DEFAULT NULL,
  PRIMARY KEY (`UserID`,`TeamID`),
  KEY `FK_Teams_Has_Users_Team` (`TeamID`),
  CONSTRAINT `FK_Teams_Has_Users_Team` FOREIGN KEY (`TeamID`) REFERENCES `teams` (`ID`),
  CONSTRAINT `FK_Teams_Has_Users_Users` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams_has_users`
--

LOCK TABLES `teams_has_users` WRITE;
/*!40000 ALTER TABLE `teams_has_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `teams_has_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactionhistories`
--

DROP TABLE IF EXISTS `transactionhistories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactionhistories` (
  `ID` varchar(100) NOT NULL,
  `Money` float NOT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `DateAdded` datetime DEFAULT NULL,
  `DateModified` datetime DEFAULT NULL,
  `EventID` varchar(100) DEFAULT NULL,
  `CategoryID` varchar(100) DEFAULT NULL,
  `WalletID` varchar(100) DEFAULT NULL,
  `UserID` varchar(100) DEFAULT NULL,
  `TransactionID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_TransactionHistories_Transactions` (`TransactionID`),
  CONSTRAINT `FK_TransactionHistories_Transactions` FOREIGN KEY (`TransactionID`) REFERENCES `transactions` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactionhistories`
--

LOCK TABLES `transactionhistories` WRITE;
/*!40000 ALTER TABLE `transactionhistories` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactionhistories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactionimages`
--

DROP TABLE IF EXISTS `transactionimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactionimages` (
  `ID` varchar(100) NOT NULL,
  `URL` varchar(1000) DEFAULT NULL,
  `TransactionID` varchar(100) DEFAULT NULL,
  `DateAdded` datetime DEFAULT NULL,
  `PublicID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_TransactionImages_Transactions` (`TransactionID`),
  CONSTRAINT `FK_TransactionImages_Transactions` FOREIGN KEY (`TransactionID`) REFERENCES `transactions` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactionimages`
--

LOCK TABLES `transactionimages` WRITE;
/*!40000 ALTER TABLE `transactionimages` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactionimages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `ID` varchar(100) NOT NULL,
  `Money` float NOT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `DateAdded` datetime DEFAULT NULL,
  `DateModified` datetime DEFAULT NULL,
  `EventID` varchar(100) DEFAULT NULL,
  `CategoryID` varchar(100) DEFAULT NULL,
  `WalletID` varchar(100) DEFAULT NULL,
  `UserID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_Transactions_Categories` (`CategoryID`),
  KEY `FK_Transactions_Events` (`EventID`),
  KEY `FK_Transactions_Wallets` (`WalletID`),
  KEY `FK_Transactions_Users` (`UserID`),
  CONSTRAINT `FK_Transactions_Categories` FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`ID`),
  CONSTRAINT `FK_Transactions_Events` FOREIGN KEY (`EventID`) REFERENCES `events` (`ID`),
  CONSTRAINT `FK_Transactions_Users` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`),
  CONSTRAINT `FK_Transactions_Wallets` FOREIGN KEY (`WalletID`) REFERENCES `wallets` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES ('0100a455-0b06-4a2b-98cc-bb7007ec6e93',-10001200,'','2021-04-04 23:36:13','2021-04-04 23:36:13',NULL,'2','0d20c650-902a-11eb-a75b-051e7845d661','046a17a0-902a-11eb-a75b-051e7845d661'),('04b6eaf3-1f3b-4993-a7e3-34656f8563ea',200000,'Nhận tiền ăn vặt tháng 3 từ mẹ','2021-03-29 08:00:49','2021-03-29 08:01:34',NULL,'2','0d20c650-902a-11eb-a75b-051e7845d661','046a17a0-902a-11eb-a75b-051e7845d661'),('6694e725-1ae8-4bc3-bdd8-802310950b80',-1000,'aa','2021-03-29 08:01:59','2021-03-29 08:01:59',NULL,'dc1ed162-4ed9-49a6-90f9-6859c7f95ec8','0d20c650-902a-11eb-a75b-051e7845d661','046a17a0-902a-11eb-a75b-051e7845d661'),('eac47857-2b78-446f-a3da-ac05d0636afa',-100022,'Mua dụng cụ học tập cho học kì 2','2021-03-29 08:00:28','2021-03-29 08:00:28',NULL,'1','0d20c650-902a-11eb-a75b-051e7845d661','046a17a0-902a-11eb-a75b-051e7845d661');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `ID` varchar(100) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Username` varchar(30) DEFAULT NULL,
  `Password` varchar(1000) DEFAULT NULL,
  `Email` varchar(100) NOT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `AvatarURL` varchar(1000) DEFAULT NULL,
  `ActivatedDate` date DEFAULT NULL,
  `WalletID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_Users_Wallets` (`WalletID`),
  CONSTRAINT `FK_Users_Wallets` FOREIGN KEY (`WalletID`) REFERENCES `wallets` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('046a17a0-902a-11eb-a75b-051e7845d661','admin','admin','$2a$10$eOJ7p0X0Lva0KcqbB3im1usbd.zPFxSFIeuaeqVWlFgFZUuJ8h5Da','masa23vn@gmail.com',NULL,NULL,'2021-03-29','0d20c650-902a-11eb-a75b-051e7845d661');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallets` (
  `ID` varchar(100) NOT NULL,
  `TotalCount` float DEFAULT NULL,
  `CurrentIncomeCount` float DEFAULT NULL,
  `CurrentSpentCount` float DEFAULT NULL,
  `DateModified` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallets`
--

LOCK TABLES `wallets` WRITE;
/*!40000 ALTER TABLE `wallets` DISABLE KEYS */;
INSERT INTO `wallets` VALUES ('0d20c650-902a-11eb-a75b-051e7845d661',-9902250,0,0,'2021-03-29 07:59:44');
/*!40000 ALTER TABLE `wallets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-19  0:40:35
