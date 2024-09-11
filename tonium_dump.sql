-- MySQL dump 10.13  Distrib 8.0.39, for Linux (x86_64)
--
-- Host: localhost    Database: tonium
-- ------------------------------------------------------
-- Server version	8.0.39-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `element_planets`
--

DROP TABLE IF EXISTS `element_planets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `element_planets` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `planetId` int NOT NULL,
  `elementId` int NOT NULL,
  PRIMARY KEY (`planetId`,`elementId`),
  KEY `elementId` (`elementId`),
  CONSTRAINT `element_planets_ibfk_1` FOREIGN KEY (`planetId`) REFERENCES `planets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `element_planets_ibfk_2` FOREIGN KEY (`elementId`) REFERENCES `elements` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `element_planets`
--

LOCK TABLES `element_planets` WRITE;
/*!40000 ALTER TABLE `element_planets` DISABLE KEYS */;
/*!40000 ALTER TABLE `element_planets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elements`
--

DROP TABLE IF EXISTS `elements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `symbol` varchar(255) DEFAULT NULL,
  `rare` enum('Обычная','Редкая','Эпическая') DEFAULT 'Обычная',
  `img` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elements`
--

LOCK TABLES `elements` WRITE;
/*!40000 ALTER TABLE `elements` DISABLE KEYS */;
INSERT INTO `elements` VALUES (4,'Hydrogen','H','Обычная','1H.png','2024-09-11 13:56:32','2024-09-11 13:56:32'),(5,'Helium ','He','Обычная','2He.png','2024-09-11 13:57:32','2024-09-11 13:57:32'),(6,'Lithium ','Li','Обычная','3Li.png','2024-09-11 13:58:09','2024-09-11 13:58:09'),(7,'Beryllium ','Be','Обычная','4Be.png','2024-09-11 14:00:03','2024-09-11 14:00:03'),(8,'Boron','B','Обычная','5B.png','2024-09-11 14:00:48','2024-09-11 14:00:48'),(9,'Carbon','C','Обычная','6C.png','2024-09-11 14:01:24','2024-09-11 14:01:24'),(10,'Nitrogen','N','Обычная','7N.png','2024-09-11 14:02:00','2024-09-11 14:02:00'),(11,'Oxygen','O','Обычная','8O.png','2024-09-11 14:09:02','2024-09-11 14:09:02'),(12,'Fluorine','F','Обычная','9F.png','2024-09-11 14:10:55','2024-09-11 14:10:55'),(13,'Neon','Ne','Обычная','10Ne.png','2024-09-11 14:11:24','2024-09-11 14:11:24'),(14,'Sodium','Na','Обычная','11Na.png','2024-09-11 14:12:01','2024-09-11 14:12:01'),(15,'Magnesium','Mg','Обычная','12Mg.png','2024-09-11 14:12:35','2024-09-11 14:12:35'),(16,'Aluminum','Al','Обычная','13AI.png','2024-09-11 14:13:10','2024-09-11 14:13:10'),(17,'Silicon','Si','Обычная','14Si.png','2024-09-11 14:13:57','2024-09-11 14:13:57'),(18,'Phosphorus','P','Обычная','15P.png','2024-09-11 14:14:57','2024-09-11 14:14:57'),(19,'Sulfur','S','Обычная','16S.png','2024-09-11 14:15:31','2024-09-11 14:15:31');
/*!40000 ALTER TABLE `elements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `planets`
--

DROP TABLE IF EXISTS `planets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `speed` float DEFAULT NULL,
  `updatePrice` int DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '0',
  `forLaboratory` tinyint(1) DEFAULT '0',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planets`
--

LOCK TABLES `planets` WRITE;
/*!40000 ALTER TABLE `planets` DISABLE KEYS */;
INSERT INTO `planets` VALUES (5,'Hydora',0.005,3,'1H.png',1,0,'2024-09-11 09:45:06','2024-09-11 09:45:06'),(6,'Helion',0.005,3,'2He.png',1,0,'2024-09-11 09:48:58','2024-09-11 09:48:58'),(7,'Lithora',0.005,3,'3Li.png',1,0,'2024-09-11 09:52:42','2024-09-11 09:52:42'),(8,'Beryllios',0.005,3,'4Be.png',1,0,'2024-09-11 09:53:49','2024-09-11 09:53:49'),(9,'Boralis',0.005,3,'5B.png',1,0,'2024-09-11 09:55:32','2024-09-11 09:55:32'),(10,'Carboria',0.005,3,'6C.png',1,0,'2024-09-11 09:56:21','2024-09-11 09:56:21'),(11,'Nitria',0.005,3,'7N.png',1,0,'2024-09-11 09:57:23','2024-09-11 09:57:23'),(12,'Oxyara',0.005,3,'8O.png',1,0,'2024-09-11 09:58:37','2024-09-11 09:58:37'),(13,'Fluora',0.005,3,'9F.png',1,0,'2024-09-11 09:59:56','2024-09-11 09:59:56'),(14,'Neonis',0.005,3,'10Ne.png',1,0,'2024-09-11 10:00:49','2024-09-11 10:00:49'),(15,'Natron',0.005,3,'11Na.png',1,0,'2024-09-11 10:02:34','2024-09-11 10:02:34'),(16,'Magonis',0.005,3,'12Mg.png',1,0,'2024-09-11 10:03:11','2024-09-11 10:03:11'),(17,'Alura',0.005,3,'13AI.png',1,0,'2024-09-11 10:04:34','2024-09-11 10:04:34'),(18,'Silicia',0.005,3,'14Si.png',1,0,'2024-09-11 10:05:07','2024-09-11 10:05:07'),(19,'Phosaris',0.005,3,'15P.png',1,0,'2024-09-11 10:05:37','2024-09-11 10:05:37'),(20,'Sulfora',0.005,3,'16S.png',1,0,'2024-09-11 10:06:27','2024-09-11 10:06:27'),(21,'Chloros',0.005,3,'17CI.png',1,0,'2024-09-11 10:06:58','2024-09-11 10:08:31'),(22,'Argonia',0.005,3,'18Ar.png',1,0,'2024-09-11 10:09:07','2024-09-11 10:09:07'),(23,'Kaloris',0.005,3,'19K.png',1,0,'2024-09-11 10:09:39','2024-09-11 10:09:39'),(24,'Calion(Ca) - Planet #20',0.005,3,'20Ca.png',1,0,'2024-09-11 10:10:18','2024-09-11 10:10:18'),(25,'Scandora',0.005,3,'21Sc.png',1,0,'2024-09-11 10:11:21','2024-09-11 10:11:21'),(26,'Titanis',0.005,3,'22Ti.png',1,0,'2024-09-11 10:11:57','2024-09-11 10:11:57'),(27,'Vanora',0.005,3,'23V.png',1,0,'2024-09-11 10:12:30','2024-09-11 10:12:30'),(28,'Chromis',0.005,3,'24Cr.png',1,0,'2024-09-11 10:12:58','2024-09-11 10:12:58'),(29,'Manganos',0.005,3,'25Mn.png',1,0,'2024-09-11 10:13:35','2024-09-11 10:13:35'),(30,'Ferrion',0.005,3,'26Fe.png',1,0,'2024-09-11 10:14:20','2024-09-11 10:14:20'),(31,'Cobaltia',0.005,3,'27Co.png',1,0,'2024-09-11 10:14:54','2024-09-11 10:14:54'),(32,'Nicconia',0.005,3,'28Ni.png',1,0,'2024-09-11 10:15:28','2024-09-11 10:15:28'),(33,'Cupris',0.005,3,'29Cu.png',1,0,'2024-09-11 10:20:18','2024-09-11 10:20:18'),(34,'Zincora',0.005,3,'30Zn.png',1,0,'2024-09-11 10:23:17','2024-09-11 10:23:17'),(35,'Gallaris',0.005,3,'31Ga.png',1,0,'2024-09-11 10:25:08','2024-09-11 10:25:08'),(36,'Germanis',0.005,3,'32Ge.png',1,0,'2024-09-11 10:25:44','2024-09-11 10:25:44'),(37,'Arsenos',0.005,3,'33As.png',1,0,'2024-09-11 10:26:30','2024-09-11 10:26:30'),(38,'Selenis',0.005,3,'34Se.png',1,0,'2024-09-11 10:27:02','2024-09-11 10:27:02'),(39,'Bromora',0.005,3,'35Br.png',1,0,'2024-09-11 10:27:41','2024-09-11 10:27:41'),(40,'Kryptos',0.005,3,'36Kr.png',1,0,'2024-09-11 10:29:13','2024-09-11 10:29:13'),(41,'Rubion',0.005,3,'37Rb.png',1,0,'2024-09-11 10:29:51','2024-09-11 10:29:51'),(42,'Strontis',0.005,3,'38St.png',1,0,'2024-09-11 10:30:21','2024-09-11 10:30:21'),(43,'Yttria',0.005,3,'39Y.png',1,0,'2024-09-11 10:30:59','2024-09-11 10:30:59'),(44,'Zirconis',0.005,3,'40Zr.png',1,0,'2024-09-11 10:31:31','2024-09-11 10:31:31'),(45,'Niobara',0.005,3,'41Nb.png',1,0,'2024-09-11 10:33:24','2024-09-11 10:33:24'),(46,'Molybdaris',0.005,3,'42Mo.png',1,0,'2024-09-11 10:34:24','2024-09-11 10:34:24'),(47,'Technara',0.005,3,'43Tc.png',1,0,'2024-09-11 10:36:43','2024-09-11 10:36:43'),(48,'Ruthenia',0.005,3,'44Ru.png',1,0,'2024-09-11 10:37:15','2024-09-11 10:37:15'),(49,'Rhodaris',0.005,3,'45Rh.png',1,0,'2024-09-11 10:37:49','2024-09-11 10:37:49'),(50,'Pallarion',0.005,3,'46Pd.png',1,0,'2024-09-11 10:38:23','2024-09-11 10:38:23'),(51,'Argentia',0.005,3,'47Ag.png',1,0,'2024-09-11 10:38:58','2024-09-11 10:38:58'),(52,'Cadmoria',0.005,3,'48Cd.png',1,0,'2024-09-11 10:39:31','2024-09-11 10:39:31'),(53,'Indora',0.005,3,'49In.png',1,0,'2024-09-11 10:40:02','2024-09-11 10:40:02'),(54,'Stannis',0.005,3,'50Sn.png',1,0,'2024-09-11 10:40:36','2024-09-11 10:40:36'),(55,'Stibora',0.005,3,'51Sb.png',1,0,'2024-09-11 10:44:31','2024-09-11 10:44:31'),(56,'Tellura',0.005,3,'52Te.png',1,0,'2024-09-11 10:45:20','2024-09-11 10:45:20'),(57,'Iodara',0.005,3,'53I.png',1,0,'2024-09-11 10:46:38','2024-09-11 10:46:38'),(58,'Xenora',0.005,3,'54Xe.png',1,0,'2024-09-11 10:47:41','2024-09-11 10:47:41'),(59,'Caesia',0.005,3,'55Cs.png',1,0,'2024-09-11 10:48:27','2024-09-11 10:48:27'),(60,'Barion',0.005,3,'56Ba.png',1,0,'2024-09-11 10:48:58','2024-09-11 10:48:58'),(61,'Lanthera',0.005,3,'57La.png',1,0,'2024-09-11 10:49:30','2024-09-11 10:49:30'),(62,'Cerion',0.005,3,'58Ce.png',1,0,'2024-09-11 12:57:11','2024-09-11 12:57:11'),(63,'Prasora',0.005,3,'59Pr.png',1,0,'2024-09-11 12:58:18','2024-09-11 12:58:18'),(64,'Neodora',0.005,3,'60Nd.png',1,0,'2024-09-11 12:59:04','2024-09-11 12:59:04'),(65,'Promethia',0.005,3,'61Pm.png',1,0,'2024-09-11 13:00:02','2024-09-11 13:00:02'),(66,'Samara',0.005,3,'62Sm.png',1,0,'2024-09-11 13:00:37','2024-09-11 13:00:37'),(67,'Eurotis',0.005,3,'63Eu.png',1,0,'2024-09-11 13:01:08','2024-09-11 13:01:08'),(68,'Gadonia',0.005,3,'64Gd.png',1,0,'2024-09-11 13:01:43','2024-09-11 13:01:43'),(69,'Terbis',0.005,3,'65Tb.png',1,0,'2024-09-11 13:02:18','2024-09-11 13:02:18'),(70,'Dysperia',0.005,3,'66Dy.png',1,0,'2024-09-11 13:02:51','2024-09-11 13:02:51'),(71,'Holmira',0.005,3,'67Ho.png',1,0,'2024-09-11 13:03:50','2024-09-11 13:03:50'),(72,'Erboria',0.005,3,'68Er.png',1,0,'2024-09-11 13:04:45','2024-09-11 13:04:45'),(73,'Thulia',0.005,3,'69Tm.png',1,0,'2024-09-11 13:05:20','2024-09-11 13:05:20'),(74,'Ytberis',0.005,3,'70Yb.png',1,0,'2024-09-11 13:05:55','2024-09-11 13:05:55'),(75,'Lutetia',0.005,3,'71Lu.png',1,0,'2024-09-11 13:06:29','2024-09-11 13:06:29'),(76,'Hafnora',0.005,3,'72Hf.png',1,0,'2024-09-11 13:07:06','2024-09-11 13:07:06'),(77,'Tantalis',0.005,3,'73Ta.png',1,0,'2024-09-11 13:07:41','2024-09-11 13:07:41'),(78,'Wolfrion',0.005,3,'74W.png',1,0,'2024-09-11 13:08:26','2024-09-11 13:08:26'),(79,'Rhenara',0.005,3,'75Re.png',1,0,'2024-09-11 13:09:17','2024-09-11 13:09:17'),(80,'Osmira',0.005,3,'76Os.png',1,0,'2024-09-11 13:11:38','2024-09-11 13:11:38'),(81,'Iridion',0.005,3,'77Ir.png',1,0,'2024-09-11 13:12:14','2024-09-11 13:12:14'),(82,'Platina',0.005,3,'78Pt.png',1,0,'2024-09-11 13:13:02','2024-09-11 13:13:02'),(83,'Aurora',0.005,3,'79Au.png',1,0,'2024-09-11 13:13:39','2024-09-11 13:13:39'),(84,'Hydragia',0.005,3,'80Hg.png',1,0,'2024-09-11 13:14:15','2024-09-11 13:14:15'),(85,'Thalloris',0.005,3,'81TI.png',1,0,'2024-09-11 13:14:55','2024-09-11 13:14:55'),(86,'Plumbora',0.005,3,'82Pb.png',1,0,'2024-09-11 13:15:35','2024-09-11 13:15:35'),(87,'Bismoria',0.005,3,'83Bi.png',1,0,'2024-09-11 13:16:06','2024-09-11 13:16:06'),(88,'Polora',0.005,3,'84Po.png',1,0,'2024-09-11 13:16:47','2024-09-11 13:16:47'),(89,'Astatia',0.005,3,'85At.png',1,0,'2024-09-11 13:17:48','2024-09-11 13:17:48'),(90,'Radonia',0.005,3,'86Rn.png',1,0,'2024-09-11 13:18:43','2024-09-11 13:18:43'),(91,'Francora',0.005,3,'87Fr.png',1,0,'2024-09-11 13:19:24','2024-09-11 13:19:24'),(92,'Radiara',0.005,3,'88Ra.png',1,0,'2024-09-11 13:20:07','2024-09-11 13:20:07'),(93,'Actinia',0.005,3,'89Ac.png',1,0,'2024-09-11 13:21:20','2024-09-11 13:21:20'),(94,'Thoria',0.005,3,'90Th.png',1,0,'2024-09-11 13:22:11','2024-09-11 13:22:11'),(95,'Protactia',0.005,3,'91Pa.png',1,0,'2024-09-11 13:29:30','2024-09-11 13:29:30'),(96,'Urania',0.005,3,'92U.png',1,0,'2024-09-11 13:30:10','2024-09-11 13:30:10'),(97,'Neptuna',0.005,3,'93Np.png',1,0,'2024-09-11 13:31:13','2024-09-11 13:31:13'),(98,'Plutoria',0.005,3,'94Pu.png',1,0,'2024-09-11 13:31:44','2024-09-11 13:31:44'),(99,'Ameria',0.005,3,'95Am.png',1,0,'2024-09-11 13:32:15','2024-09-11 13:32:15'),(100,'Curora',0.005,3,'96Cm.png',1,0,'2024-09-11 13:33:06','2024-09-11 13:33:06'),(101,'Berkoria',0.005,3,'97Bk.png',1,0,'2024-09-11 13:33:39','2024-09-11 13:33:39'),(102,'Califoria',0.005,3,'98Cf.png',1,0,'2024-09-11 13:34:41','2024-09-11 13:34:41'),(103,'Einsteinia',0.005,3,'99Es.png',1,0,'2024-09-11 13:35:15','2024-09-11 13:35:15'),(104,'Fermia',0.005,3,'100Fm.png',1,0,'2024-09-11 13:36:10','2024-09-11 13:36:10'),(105,'Mendelea',0.005,3,'101Md.png',1,0,'2024-09-11 13:36:44','2024-09-11 13:36:44'),(106,'Nobelia',0.005,3,'102No.png',1,0,'2024-09-11 13:37:21','2024-09-11 13:37:21'),(107,'Lawrencia',0.005,3,'103Lr.png',1,0,'2024-09-11 13:37:59','2024-09-11 13:37:59'),(108,'Rutherforda',0.005,3,'104Rf.png',1,0,'2024-09-11 13:38:30','2024-09-11 13:38:30'),(109,'Dubnora',0.005,3,'105Db.png',1,0,'2024-09-11 13:39:10','2024-09-11 13:39:10'),(110,'Seaborgia',0.005,3,'106Sg.png',1,0,'2024-09-11 13:40:04','2024-09-11 13:40:04'),(111,'Bohra',0.005,3,'107Bh.png',1,0,'2024-09-11 13:41:04','2024-09-11 13:41:04'),(112,'Hassia',0.005,3,'108Hs.png',1,0,'2024-09-11 13:41:39','2024-09-11 13:41:39'),(113,'Meitnera',0.005,3,'109Mt.png',1,0,'2024-09-11 13:42:13','2024-09-11 13:42:13'),(114,'Darmstadia',0.005,3,'110Ds.png',1,0,'2024-09-11 13:42:55','2024-09-11 13:42:55'),(115,'Roentgena',0.005,3,'111Rg.png',1,0,'2024-09-11 13:43:54','2024-09-11 13:43:54'),(116,'Copernia',0.005,3,'112Cn.png',1,0,'2024-09-11 13:45:18','2024-09-11 13:45:18'),(117,'Nihona',0.005,3,'113Nh.png',1,0,'2024-09-11 13:46:42','2024-09-11 13:46:42'),(118,'Flerovia',0.005,3,'114Fl.png',1,0,'2024-09-11 13:47:14','2024-09-11 13:47:14'),(119,'Moscovia',0.005,3,'115Mc.png',1,0,'2024-09-11 13:47:49','2024-09-11 13:47:49'),(120,'Liveria',0.005,3,'116Lv.png',1,0,'2024-09-11 13:48:29','2024-09-11 13:48:29'),(121,'Tennessia',0.005,3,'117Ts.png',1,0,'2024-09-11 13:49:04','2024-09-11 13:49:04'),(122,'Ogania',0.005,3,'118Og.png',1,0,'2024-09-11 13:49:55','2024-09-11 13:49:55');
/*!40000 ALTER TABLE `planets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `coins` float DEFAULT '0',
  `ton` float DEFAULT '0',
  `wallet` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,NULL,NULL,'user',0,0,'UQDj5GnJX7YBVRKrql2B2imsnY2ArRTAZdOJlB1yW02i2HiV','2024-09-11 09:10:35','2024-09-11 09:10:35'),(2,NULL,NULL,'user',0,0,'UQDj5GnJX7YBVRKrql2B2imsnY2ArRTAZdOJlB1yW02i2HiV','2024-09-11 09:10:35','2024-09-11 09:10:35'),(3,NULL,NULL,'user',0,0,'UQC-BJsGb__i6-VBdJbA_7cAXc5WMaVl63eE3kj7jwnRK2og','2024-09-11 09:29:17','2024-09-11 09:29:17'),(4,NULL,NULL,'user',0,0,'UQC-BJsGb__i6-VBdJbA_7cAXc5WMaVl63eE3kj7jwnRK2og','2024-09-11 09:29:17','2024-09-11 09:29:17');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wallets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `value` float DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int DEFAULT NULL,
  `elementId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `elementId` (`elementId`),
  CONSTRAINT `wallets_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `wallets_ibfk_2` FOREIGN KEY (`elementId`) REFERENCES `elements` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wallets`
--

LOCK TABLES `wallets` WRITE;
/*!40000 ALTER TABLE `wallets` DISABLE KEYS */;
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

-- Dump completed on 2024-09-11 17:44:10
