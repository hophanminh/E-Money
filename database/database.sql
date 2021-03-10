CREATE DATABASE  IF NOT EXISTS `qlchitieu` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `qlchitieu`;
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
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `ID` varchar(100) NOT NULL,
  `Name` varchar(1000) NOT NULL,
  `StartDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `Status` int DEFAULT NULL,
  `Value` int DEFAULT NULL,
  `ExpectingRage` float DEFAULT NULL,
  `CurrentIncomeCount` float DEFAULT NULL,
  `CurrentSpentCount` float DEFAULT NULL,
  `WalletID` varchar(100) DEFAULT NULL,
  `EventTypeID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_Events_EventTypes` (`EventTypeID`),
  KEY `FK_Events_Wallet` (`WalletID`),
  CONSTRAINT `FK_Events_EventTypes` FOREIGN KEY (`EventTypeID`) REFERENCES `eventtypes` (`ID`),
  CONSTRAINT `FK_Events_Wallet` FOREIGN KEY (`WalletID`) REFERENCES `wallet` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
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
/*!40000 ALTER TABLE `eventtypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exchanges`
--

DROP TABLE IF EXISTS `exchanges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exchanges` (
  `ID` varchar(100) NOT NULL,
  `Money` float NOT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `DateAdded` datetime DEFAULT NULL,
  `DateModified` datetime DEFAULT NULL,
  `EventID` varchar(100) DEFAULT NULL,
  `ExchangeTypeID` varchar(100) DEFAULT NULL,
  `WalletID` varchar(100) DEFAULT NULL,
  `UserID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_Exchanges_ExchangeTypes` (`ExchangeTypeID`),
  KEY `FK_Exchanges_Events` (`EventID`),
  KEY `FK_Exchanges_Wallet` (`WalletID`),
  KEY `FK_Exchanges_Users` (`UserID`),
  CONSTRAINT `FK_Exchanges_Events` FOREIGN KEY (`EventID`) REFERENCES `events` (`ID`),
  CONSTRAINT `FK_Exchanges_ExchangeTypes` FOREIGN KEY (`ExchangeTypeID`) REFERENCES `exchangetypes` (`ID`),
  CONSTRAINT `FK_Exchanges_Users` FOREIGN KEY (`UserID`) REFERENCES `users` (`ID`),
  CONSTRAINT `FK_Exchanges_Wallet` FOREIGN KEY (`WalletID`) REFERENCES `wallet` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exchanges`
--

LOCK TABLES `exchanges` WRITE;
/*!40000 ALTER TABLE `exchanges` DISABLE KEYS */;
INSERT INTO `exchanges` VALUES ('263b104e-7d5c-4897-b1da-f3aece1b7e87',1000,'1213','2021-03-05 17:47:37','2021-03-05 17:47:37',NULL,'2','976a4670-7d8c-11eb-bf95-73b5fd1e2f13','01161550-7d8c-11eb-bf95-73b5fd1e2f13'),('3fd05640-c26a-4b55-9617-49403ae0c5f0',10001,'minh','2021-03-05 17:43:05','2021-03-05 17:43:05',NULL,'2','976a4670-7d8c-11eb-bf95-73b5fd1e2f13','01161550-7d8c-11eb-bf95-73b5fd1e2f13'),('6373f968-af05-4e42-b0bb-df5ca171b53f',1,'','2021-03-05 16:23:31','2021-03-05 16:23:31',NULL,'1','976a4670-7d8c-11eb-bf95-73b5fd1e2f13','01161550-7d8c-11eb-bf95-73b5fd1e2f13'),('82bbabdf-b989-4033-a916-7c06970d9930',4,'','2021-03-05 16:24:04','2021-03-05 16:24:04',NULL,'1','976a4670-7d8c-11eb-bf95-73b5fd1e2f13','01161550-7d8c-11eb-bf95-73b5fd1e2f13'),('e312e075-a00c-4bdf-bde0-80776495c4af',10001200,'minh 123','2021-03-01 17:22:00','2021-03-01 17:22:00',NULL,'1','976a4670-7d8c-11eb-bf95-73b5fd1e2f13','01161550-7d8c-11eb-bf95-73b5fd1e2f13'),('f289cbce-31bb-4003-bc28-511b017f01f5',2,'','2021-03-05 16:23:58','2021-03-05 16:23:58',NULL,'1','976a4670-7d8c-11eb-bf95-73b5fd1e2f13','01161550-7d8c-11eb-bf95-73b5fd1e2f13');
/*!40000 ALTER TABLE `exchanges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exchangeshistory`
--

DROP TABLE IF EXISTS `exchangeshistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exchangeshistory` (
  `ID` varchar(100) NOT NULL,
  `Money` float NOT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `DateAdded` datetime DEFAULT NULL,
  `DateModified` datetime DEFAULT NULL,
  `EventID` varchar(100) DEFAULT NULL,
  `ExchangeTypeID` varchar(100) DEFAULT NULL,
  `WalletID` varchar(100) DEFAULT NULL,
  `UserID` varchar(100) DEFAULT NULL,
  `ExchangeID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_ExchangesHistory_Exchanges` (`ExchangeID`),
  CONSTRAINT `FK_ExchangesHistory_Exchanges` FOREIGN KEY (`ExchangeID`) REFERENCES `exchanges` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exchangeshistory`
--

LOCK TABLES `exchangeshistory` WRITE;
/*!40000 ALTER TABLE `exchangeshistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `exchangeshistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exchangetypes`
--

DROP TABLE IF EXISTS `exchangetypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exchangetypes` (
  `ID` varchar(100) NOT NULL,
  `Name` varchar(1000) NOT NULL,
  `IsDefault` tinyint(1) NOT NULL,
  `WalletID` varchar(100) DEFAULT NULL,
  `IconName` varchar(1000) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_ExchangeTypes_Wallet` (`WalletID`),
  CONSTRAINT `FK_ExchangeTypes_Wallet` FOREIGN KEY (`WalletID`) REFERENCES `wallet` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exchangetypes`
--

LOCK TABLES `exchangetypes` WRITE;
/*!40000 ALTER TABLE `exchangetypes` DISABLE KEYS */;
INSERT INTO `exchangetypes` VALUES ('1','Ăn uống',1,NULL,'food'),('2','Học tập',2,NULL,'book');
/*!40000 ALTER TABLE `exchangetypes` ENABLE KEYS */;
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
  `WalletID` varchar(100) DEFAULT NULL,
  `AvatarURL` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_Teams_Wallet` (`WalletID`),
  CONSTRAINT `FK_Teams_Wallet` FOREIGN KEY (`WalletID`) REFERENCES `wallet` (`ID`)
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
  KEY `FK_Users_Wallet` (`WalletID`),
  CONSTRAINT `FK_Users_Wallet` FOREIGN KEY (`WalletID`) REFERENCES `wallet` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('01161550-7d8c-11eb-bf95-73b5fd1e2f13','admin','admin','$2a$10$82DJrjEAsveKkv2F6ime.e07WKPuYDvHqem6Cr7EWG80UXAzojFA6','masa23vn@gmail.com',NULL,NULL,'2021-03-05','976a4670-7d8c-11eb-bf95-73b5fd1e2f13');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallet`
--

DROP TABLE IF EXISTS `wallet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallet` (
  `ID` varchar(100) NOT NULL,
  `TotalCount` float DEFAULT NULL,
  `CurrentIncomeCount` float DEFAULT NULL,
  `CurrentSpentCount` float DEFAULT NULL,
  `DateModified` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallet`
--

LOCK TABLES `wallet` WRITE;
/*!40000 ALTER TABLE `wallet` DISABLE KEYS */;
INSERT INTO `wallet` VALUES ('976a4670-7d8c-11eb-bf95-73b5fd1e2f13',0,0,0,'2021-03-05 15:27:15');
/*!40000 ALTER TABLE `wallet` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-05 17:59:06
