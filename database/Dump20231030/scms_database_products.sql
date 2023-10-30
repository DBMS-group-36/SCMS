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
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `Id` varchar(450) NOT NULL,
  `Name` varchar(256) DEFAULT NULL,
  `CapacityPerUnit` int DEFAULT NULL,
  `Price` decimal(12,2) DEFAULT NULL,
  `UnitsSold` int DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('1','Widget A',10,29.99,NULL),('10','Widget G',14,44.50,NULL),('11','Gadget H',6,27.75,NULL),('12','Thingamajig I',22,15.99,NULL),('13','Doodad J',17,12.25,NULL),('14','Whatchamacallit K',11,38.50,NULL),('15','DooHickey L',9,16.75,NULL),('16','Widget M',7,23.99,NULL),('17','Gizmo N',16,29.50,NULL),('18','Thingy O',19,10.95,NULL),('19','Widget P',8,33.50,NULL),('2','Gadget B',5,49.95,NULL),('20','Gadget Q',5,41.75,NULL),('21','Thingamajig R',21,17.99,NULL),('22','Doodad S',16,11.25,NULL),('23','Whatchamacallit T',14,36.50,NULL),('24','DooHickey U',10,15.75,NULL),('25','Widget V',7,26.99,NULL),('26','Gizmo W',15,32.50,NULL),('27','Thingy X',20,11.95,NULL),('28','Widget Y',6,28.50,NULL),('29','Gadget Z',5,45.75,NULL),('3','Thingamajig C',20,14.50,NULL),('30','Thingamajig AA',25,18.99,NULL),('31','Doodad BB',19,10.25,NULL),('32','Whatchamacallit CC',12,37.50,NULL),('33','DooHickey DD',11,17.75,NULL),('34','Widget EE',8,24.99,NULL),('35','Gizmo FF',17,31.50,NULL),('36','Thingy GG',18,12.95,NULL),('37','Widget HH',7,31.50,NULL),('38','Gadget II',6,46.75,NULL),('39','Thingamajig JJ',23,20.99,NULL),('4','Doodad X',15,19.99,NULL),('40','Doodad KK',18,10.25,NULL),('41','Whatchamacallit LL',15,35.50,NULL),('42','DooHickey MM',12,14.75,NULL),('43','Widget NN',9,29.99,NULL),('44','Gizmo OO',20,30.50,NULL),('45','Thingy PP',25,13.95,NULL),('46','Widget QQ',10,27.50,NULL),('47','Gadget RR',9,47.75,NULL),('48','Thingamajig SS',22,19.99,NULL),('49','Doodad TT',16,9.25,NULL),('5','Whatchamacallit Y',12,39.99,NULL),('50','Whatchamacallit UU',13,33.50,NULL),('6','DooHickey Z',8,12.75,NULL),('7','Widget D',9,21.50,NULL),('8','Gizmo E',7,34.99,NULL),('9','Thingy F',18,9.95,NULL);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-10-30 22:47:06
