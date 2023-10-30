-- MySQL dump 10.13  Distrib 8.0.31, for macos12 (x86_64)
--
-- Host: 167.99.31.206    Database: scms_database
-- ------------------------------------------------------
-- Server version	8.0.34-0ubuntu0.22.04.1

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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `NormalizedUserName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Email` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `NormalizedEmail` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `EmailConfirmed` tinyint(1) NOT NULL,
  `PasswordHash` longtext,
  `SecurityStamp` longtext,
  `ConcurrencyStamp` longtext,
  `PhoneNumber` longtext,
  `PhoneNumberConfirmed` tinyint(1) NOT NULL,
  `TwoFactorEnabled` tinyint(1) NOT NULL,
  `LockoutEnd` datetime(6) DEFAULT NULL,
  `LockoutEnabled` tinyint(1) NOT NULL,
  `AccessFailedCount` int NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UserNameIndex` (`NormalizedUserName`),
  KEY `EmailIndex` (`NormalizedEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
-- INSERT INTO `users` VALUES (1,'nipuna','NIPUNA','nipunadulara@gmail.com','NIPUNADULARA@GMAIL.COM',0,'AQAAAAIAAYagAAAAEDrVbO26pqWugMIvQHubNHgcWtujoCzyA7GowU6Co5kuW9xRAt5aGT+mAuB7BdRnGw==','WZ5KKVTEJCWWRPSGRXGPCNC3YZ3TWACI','5824cc25-54ea-498a-b8d2-3a9a01d6f2e6',NULL,0,0,NULL,1,0),('a08ce4b3-0853-4bea-85b3-b27f47d7f3f2','nipuna2','NIPUNA2','nipuna@gmail.com','NIPUNA@GMAIL.COM',0,'AQAAAAIAAYagAAAAEPUSZKSI+aiCuR5ESLZYqMpS8nRlmk4E8S0I1/lF0HXaY0HOfG8P4AT74le3fcttyA==','G4LDZHGU5VAHY7BNK6MDETIXYVJBI4W2','dad41343-90b0-4e3f-8853-2525b2f6ac44',NULL,0,0,NULL,1,0),('b64584c0-e54b-46f0-9806-7e9fd4dc1efa','Tharusha','THARUSHA','tharindu6516@gmail.com','THARINDU6516@GMAIL.COM',0,'AQAAAAIAAYagAAAAEMp+12HNAJWSvWCiPLcgj+D1/Z7AbwC11EItABUvJ7txvPGh/YHvWAUklHcPZfRJEQ==','PD32AL7ULO5HCQQ7TSIF56F6IEYNZNOX','6bdcfa57-f51d-49d5-b99b-04870cc08757',NULL,0,0,NULL,1,0),('d5488008-06ca-438f-bd81-0541bc679fd3','Tharindu','THARINDU','tharindu6516@gmail.com','THARINDU6516@GMAIL.COM',0,'AQAAAAIAAYagAAAAEMuejRt7NZBWkNAF10WWBUsfpJi1f7K34CM6ZegOAf7lcfDlO7SmPpLQh5yDMAKdNg==','H24QJ3DKCYXKDALBEIPRNMAJ2DUQLCNT','64e70485-c780-454c-aabc-ece7cde4ea97',NULL,0,0,NULL,1,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-30 22:46:54
