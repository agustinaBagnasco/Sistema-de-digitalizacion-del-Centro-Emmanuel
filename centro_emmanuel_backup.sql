-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: centro_emmanuel
-- ------------------------------------------------------
-- Server version	5.7.42-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `centro_emmanuel`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `centro_emmanuel` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `centro_emmanuel`;

--
-- Table structure for table `cosecha`
--

DROP TABLE IF EXISTS `cosecha`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cosecha` (
  `cantidad_cosecha` decimal(15,3) NOT NULL,
  `fecha_cosecha` date DEFAULT NULL,
  `id_cosecha` int(11) NOT NULL AUTO_INCREMENT,
  `id_producto` int(11) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `observaciones` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id_cosecha`),
  KEY `FKj1bwfejt79cfejclv18k9c8e1` (`id_producto`),
  KEY `FKbf4vqn6dd0vw3ydcl3smngd61` (`id_usuario`),
  CONSTRAINT `FKbf4vqn6dd0vw3ydcl3smngd61` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `FKj1bwfejt79cfejclv18k9c8e1` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cosecha`
--

LOCK TABLES `cosecha` WRITE;
/*!40000 ALTER TABLE `cosecha` DISABLE KEYS */;
INSERT INTO `cosecha` VALUES (20.000,'2026-09-29',1,4,7,'Crespa'),(60.000,'2026-10-19',2,31,7,'');
/*!40000 ALTER TABLE `cosecha` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_elaboracion`
--

DROP TABLE IF EXISTS `detalle_elaboracion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detalle_elaboracion` (
  `cantidad_utilizada` decimal(15,3) NOT NULL,
  `costo_unitario` decimal(15,3) DEFAULT NULL,
  `id_detalle_elaboracion` int(11) NOT NULL AUTO_INCREMENT,
  `id_elaboracion` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  PRIMARY KEY (`id_detalle_elaboracion`),
  KEY `FKfv86nnvvjyqadlpvk37501576` (`id_elaboracion`),
  KEY `FK6e3oqlwfqxjlejh0os5elbteu` (`id_producto`),
  CONSTRAINT `FK6e3oqlwfqxjlejh0os5elbteu` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  CONSTRAINT `FKfv86nnvvjyqadlpvk37501576` FOREIGN KEY (`id_elaboracion`) REFERENCES `elaboracion` (`id_elaboracion`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_elaboracion`
--

LOCK TABLES `detalle_elaboracion` WRITE;
/*!40000 ALTER TABLE `detalle_elaboracion` DISABLE KEYS */;
INSERT INTO `detalle_elaboracion` VALUES (55.000,35.000,1,1,21),(12.000,0.000,2,1,2),(0.000,40.000,3,1,22),(55.000,35.000,4,2,21),(12.800,0.000,5,2,2),(0.000,40.000,6,2,22),(8.000,NULL,7,3,19),(20.000,35.000,8,4,21),(10.000,NULL,9,5,19);
/*!40000 ALTER TABLE `detalle_elaboracion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_venta`
--

DROP TABLE IF EXISTS `detalle_venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `detalle_venta` (
  `cantidad` decimal(15,3) DEFAULT NULL,
  `id_detalle_venta` int(11) NOT NULL AUTO_INCREMENT,
  `id_producto` int(11) DEFAULT NULL,
  `id_venta` int(11) DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_detalle_venta`),
  KEY `FKsntaik0t9jxcky777753wytsx` (`id_producto`),
  KEY `FKoknpg31rxsqnjxrsu7iy47p1o` (`id_venta`),
  CONSTRAINT `FKoknpg31rxsqnjxrsu7iy47p1o` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`),
  CONSTRAINT `FKsntaik0t9jxcky777753wytsx` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_venta`
--

LOCK TABLES `detalle_venta` WRITE;
/*!40000 ALTER TABLE `detalle_venta` DISABLE KEYS */;
INSERT INTO `detalle_venta` VALUES (1.000,1,13,1,440.00,440.00),(2.000,2,5,2,430.00,860.00),(23.000,3,14,3,160.00,3680.00),(5.000,4,13,4,440.00,2200.00),(11.000,5,23,5,175.00,1925.00),(12.000,6,10,6,130.00,1560.00),(4.000,7,6,7,470.00,1880.00),(2.000,8,10,8,130.00,260.00);
/*!40000 ALTER TABLE `detalle_venta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elaboracion`
--

DROP TABLE IF EXISTS `elaboracion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `elaboracion` (
  `cantidad_frascos_1kg` int(11) DEFAULT NULL,
  `cantidad_frascos_420g` int(11) DEFAULT NULL,
  `cantidad_producida` decimal(15,3) NOT NULL,
  `fecha_elaboracion` date NOT NULL,
  `id_elaboracion` int(11) NOT NULL AUTO_INCREMENT,
  `id_producto` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tiempo_elaboracion` int(11) DEFAULT NULL,
  `observaciones` varchar(500) DEFAULT NULL,
  `cantidad_hormas` int(11) DEFAULT NULL,
  `id_producto_1kg` int(11) DEFAULT NULL,
  `id_producto_420g` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_elaboracion`),
  KEY `FK8qi9ujls9399ji3gela76n945` (`id_producto`),
  KEY `FKhh7w5deq06be24h940i2x63uj` (`id_usuario`),
  KEY `FKfrrx2ev1wc0ksglmoprstx5r3` (`id_producto_1kg`),
  KEY `FKmymlqfudql3jurw1ril5y7jh3` (`id_producto_420g`),
  CONSTRAINT `FK8qi9ujls9399ji3gela76n945` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  CONSTRAINT `FKfrrx2ev1wc0ksglmoprstx5r3` FOREIGN KEY (`id_producto_1kg`) REFERENCES `producto` (`id_producto`),
  CONSTRAINT `FKhh7w5deq06be24h940i2x63uj` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `FKmymlqfudql3jurw1ril5y7jh3` FOREIGN KEY (`id_producto_420g`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elaboracion`
--

LOCK TABLES `elaboracion` WRITE;
/*!40000 ALTER TABLE `elaboracion` DISABLE KEYS */;
INSERT INTO `elaboracion` VALUES (15,20,23.400,'2026-10-01',1,1,7,300,'',NULL,1,14),(30,0,30.000,'2026-10-31',2,1,7,300,'',NULL,1,NULL),(NULL,NULL,8.000,'2026-10-29',3,10,7,2,'',NULL,NULL,NULL),(NULL,NULL,19.000,'2026-10-01',4,23,7,120,'',NULL,NULL,NULL),(NULL,NULL,10.000,'2026-10-10',5,10,7,120,'',NULL,NULL,NULL);
/*!40000 ALTER TABLE `elaboracion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimiento_stock`
--

DROP TABLE IF EXISTS `movimiento_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `movimiento_stock` (
  `cantidad_mov` decimal(15,3) NOT NULL,
  `fecha_mov` datetime(6) NOT NULL,
  `id_mov_stock` int(11) NOT NULL AUTO_INCREMENT,
  `id_producto` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `tipo_mov` varchar(20) NOT NULL,
  `motivo_mov` varchar(1000) DEFAULT NULL,
  `consumo_leche_automatico` bit(1) NOT NULL,
  `destino_leche` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id_mov_stock`),
  KEY `FK64hd0g7b509ineqykafn1042p` (`id_producto`),
  KEY `FKlduor3mcknnv0lgr368mca854` (`id_usuario`),
  CONSTRAINT `FK64hd0g7b509ineqykafn1042p` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`),
  CONSTRAINT `FKlduor3mcknnv0lgr368mca854` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimiento_stock`
--

LOCK TABLES `movimiento_stock` WRITE;
/*!40000 ALTER TABLE `movimiento_stock` DISABLE KEYS */;
INSERT INTO `movimiento_stock` VALUES (200.000,'2026-10-07 09:54:18.393958',1,21,7,'ENTRADA','Producción diaria de leche','\0',NULL),(200.000,'2026-10-07 09:54:42.015769',2,21,7,'SALIDA','Eliminación de registro de producción de leche','\0',NULL),(200.000,'2026-10-07 09:58:07.018141',3,21,7,'ENTRADA','Producción diaria de leche','\0',NULL),(200.000,'2026-10-07 10:05:46.578548',4,21,7,'ENTRADA','Producción diaria de leche','\0',NULL),(55.000,'2026-10-07 10:07:32.199303',5,21,7,'SALIDA','Lote DUL-20261001-1 · Elaboración #1 · 01/10/2026. Producido: Dulce de leche 1kg · 15 frascos de 1 kg y 20 frascos de 420 g (23.4 en total). Insumos usados: Leche 55, Azúcar 12. · Destino de la leche: Dulce de leche','','DULCE_DE_LECHE'),(12.000,'2026-10-07 10:07:32.202912',6,2,7,'SALIDA','Lote DUL-20261001-1 · Elaboración #1 · 01/10/2026. Producido: Dulce de leche 1kg · 15 frascos de 1 kg y 20 frascos de 420 g (23.4 en total). Insumos usados: Leche 55, Azúcar 12.','\0',NULL),(15.000,'2026-10-07 10:07:32.207740',7,1,7,'ENTRADA','Lote DUL-20261001-1 · Elaboración #1 · 01/10/2026. Producido: Dulce de leche 1kg · 15 frascos de 1 kg y 20 frascos de 420 g (23.4 en total). Insumos usados: Leche 55, Azúcar 12.','\0',NULL),(20.000,'2026-10-07 10:07:32.232849',8,14,7,'ENTRADA','Lote DUL-20261001-1 · Elaboración #1 · 01/10/2026. Producido: Dulce de leche 1kg · 15 frascos de 1 kg y 20 frascos de 420 g (23.4 en total). Insumos usados: Leche 55, Azúcar 12.','\0',NULL),(800.000,'2026-11-03 06:39:00.343385',9,26,7,'ENTRADA','Stock inicial','\0',NULL),(500.000,'2026-11-03 06:39:23.924283',10,27,7,'ENTRADA','Stock inicial','\0',NULL),(230.000,'2026-11-03 06:43:03.922170',11,21,7,'ENTRADA','Producción diaria de leche','\0',NULL),(290.000,'2026-11-03 06:46:06.432225',12,21,7,'ENTRADA','Producción diaria de leche','\0',NULL),(1000.000,'2026-11-03 06:53:02.911885',13,30,7,'ENTRADA','Stock inicial','\0',NULL),(55.000,'2026-11-03 06:54:21.485411',14,21,7,'SALIDA','Lote DUL-20261031-2 · Elaboración #2 · 31/10/2026. Producido: Dulce de leche 1kg · 30 frascos de 1 kg (30 en total). Insumos usados: Leche 55, Azúcar 12.8. · Destino de la leche: Dulce de leche','','DULCE_DE_LECHE'),(12.800,'2026-11-03 06:54:21.491783',15,2,7,'SALIDA','Lote DUL-20261031-2 · Elaboración #2 · 31/10/2026. Producido: Dulce de leche 1kg · 30 frascos de 1 kg (30 en total). Insumos usados: Leche 55, Azúcar 12.8.','\0',NULL),(30.000,'2026-11-03 06:54:21.506374',16,1,7,'ENTRADA','Lote DUL-20261031-2 · Elaboración #2 · 31/10/2026. Producido: Dulce de leche 1kg · 30 frascos de 1 kg (30 en total). Insumos usados: Leche 55, Azúcar 12.8.','\0',NULL),(60.000,'2026-11-03 07:30:30.767538',17,31,7,'ENTRADA','Lote LEC-20261019-2 · Cosecha #2 · 19/10/2026 · Responsable: admin. Cosechado: Lechuga 60.','\0',NULL),(8.000,'2026-11-03 07:34:57.015934',18,19,7,'SALIDA','Lote HAR-20261029-3 · Elaboración #3 · 29/10/2026. Producido: Harina de trigo · 8. Insumos usados: Trigo 8.','\0',NULL),(8.000,'2026-11-03 07:34:57.038969',19,10,7,'ENTRADA','Lote HAR-20261029-3 · Elaboración #3 · 29/10/2026. Producido: Harina de trigo · 8. Insumos usados: Trigo 8.','\0',NULL),(20.000,'2026-11-03 08:04:41.294500',20,21,7,'SALIDA','Lote QUA-20261001-4 · Elaboración #4 · 01/10/2026. Producido: Quark · 19. Insumos usados: Leche 20. · Destino de la leche: Quark','','QUARK'),(19.000,'2026-11-03 08:04:41.312286',21,23,7,'ENTRADA','Lote QUA-20261001-4 · Elaboración #4 · 01/10/2026. Producido: Quark · 19. Insumos usados: Leche 20.','\0',NULL),(10.000,'2026-11-03 08:05:52.300269',22,19,7,'SALIDA','Lote HAR-20261010-5 · Elaboración #5 · 10/10/2026. Producido: Harina de trigo · 10. Insumos usados: Trigo 10.','\0',NULL),(10.000,'2026-11-03 08:05:52.327852',23,10,7,'ENTRADA','Lote HAR-20261010-5 · Elaboración #5 · 10/10/2026. Producido: Harina de trigo · 10. Insumos usados: Trigo 10.','\0',NULL),(1.000,'2026-11-03 08:06:38.484558',24,13,7,'SALIDA','Venta importada','\0',NULL),(2.000,'2026-11-03 08:06:38.555134',25,5,7,'SALIDA','Venta importada','\0',NULL),(23.000,'2026-11-03 08:06:38.593719',26,14,7,'SALIDA','Venta importada','\0',NULL),(5.000,'2026-11-03 08:06:38.623094',27,13,7,'SALIDA','Venta importada','\0',NULL),(11.000,'2026-11-03 08:06:38.631121',28,23,7,'SALIDA','Venta importada','\0',NULL),(12.000,'2026-11-03 08:06:38.642586',29,10,7,'SALIDA','Venta importada','\0',NULL),(4.000,'2026-11-03 08:06:38.653921',30,6,7,'SALIDA','Venta importada','\0',NULL),(2.000,'2026-11-03 08:06:38.665168',31,10,7,'SALIDA','Venta importada','\0',NULL),(200.000,'2026-11-03 10:24:17.626480',32,19,7,'ENTRADA','Movimiento manual','\0',NULL),(20.000,'2026-11-03 10:25:01.736131',33,24,7,'ENTRADA','Movimiento manual','\0',NULL);
/*!40000 ALTER TABLE `movimiento_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permiso`
--

DROP TABLE IF EXISTS `permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permiso` (
  `id_permiso` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_permiso` varchar(255) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `id_usuario_creacion` int(11) DEFAULT NULL,
  `id_usuario_modificacion` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_permiso`),
  UNIQUE KEY `nombre_permiso` (`nombre_permiso`),
  UNIQUE KEY `UKke2qkm3yxfjcm175hh2kib5uh` (`nombre_permiso`),
  KEY `FKq6f7vb2iut976ct5c4i8c1gev` (`id_usuario_creacion`),
  KEY `FK5m9efl1y0ra0cdqqnrvpx3qlk` (`id_usuario_modificacion`),
  CONSTRAINT `FK5m9efl1y0ra0cdqqnrvpx3qlk` FOREIGN KEY (`id_usuario_modificacion`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `FKq6f7vb2iut976ct5c4i8c1gev` FOREIGN KEY (`id_usuario_creacion`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permiso`
--

LOCK TABLES `permiso` WRITE;
/*!40000 ALTER TABLE `permiso` DISABLE KEYS */;
INSERT INTO `permiso` VALUES (1,'ADMINISTRACION','Acceso global del sistema',NULL,10),(3,'ALIMENTOS-PROCESADOS','Acceso a área de registro de harina, mermeladas, quesos y dulce de leche',10,10),(4,'LACTEOS','Acceso a producción de leche y control lechero',10,10),(5,'HUERTA','Acceso a registro de cultivos',10,10);
/*!40000 ALTER TABLE `permiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produccion_leche`
--

DROP TABLE IF EXISTS `produccion_leche`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `produccion_leche` (
  `consumo_cocina` decimal(15,3) NOT NULL,
  `elaboracion_dulce_de_leche` decimal(15,3) NOT NULL,
  `elaboracion_quark` decimal(15,3) NOT NULL,
  `elaboracion_quesos` decimal(15,3) NOT NULL,
  `fecha` date NOT NULL,
  `id_produccion_leche` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) NOT NULL,
  `litros_terneros` decimal(15,3) NOT NULL,
  `venta_directa` decimal(15,3) NOT NULL,
  `comentario` varchar(500) DEFAULT NULL,
  `litros_totales` decimal(15,3) DEFAULT NULL,
  PRIMARY KEY (`id_produccion_leche`),
  KEY `FKl4ktmpr92umy27pa1d5w4mmpd` (`id_usuario`),
  CONSTRAINT `FKl4ktmpr92umy27pa1d5w4mmpd` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produccion_leche`
--

LOCK TABLES `produccion_leche` WRITE;
/*!40000 ALTER TABLE `produccion_leche` DISABLE KEYS */;
INSERT INTO `produccion_leche` VALUES (3.000,0.000,20.000,120.000,'2026-09-21',2,7,5.000,20.000,'',200.000),(3.000,55.000,14.000,100.000,'2026-10-01',3,7,8.000,20.000,'',200.000),(5.000,0.000,20.000,150.000,'2026-11-02',4,7,0.000,20.000,'',230.000),(2.000,55.000,0.000,160.000,'2026-11-03',5,7,0.000,10.000,'',290.000);
/*!40000 ALTER TABLE `produccion_leche` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `producto` (
  `id_producto` int(11) NOT NULL AUTO_INCREMENT,
  `activo` bit(1) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `nombre_producto` varchar(255) NOT NULL,
  `stock_actual` decimal(15,3) DEFAULT NULL,
  `stock_minimo` decimal(15,3) DEFAULT NULL,
  `tipo` varchar(20) NOT NULL,
  `categoria` varchar(30) NOT NULL,
  `unidad_medida` varchar(10) NOT NULL,
  `costo` decimal(15,3) DEFAULT NULL,
  `id_producto_resultado` int(11) DEFAULT NULL,
  `peso_horma` decimal(15,3) DEFAULT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `FKey9dyson0777gu5tkd25s4w8h` (`id_producto_resultado`),
  CONSTRAINT `FKey9dyson0777gu5tkd25s4w8h` FOREIGN KEY (`id_producto_resultado`) REFERENCES `producto` (`id_producto`),
  CONSTRAINT `fk_producto_resultado` FOREIGN KEY (`id_producto_resultado`) REFERENCES `producto` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,'','','Dulce de leche 1kg',57.000,5.000,'PRODUCTO','DULCEDELECHE','KG',200.000,NULL,NULL),(2,'','','Azúcar',50.200,25.000,'INSUMO','OTROS','KG',0.000,NULL,NULL),(4,'\0','','Lechuga',50.000,2.000,'PRODUCTO','FRUTASYHORTALIZAS','KG',0.000,NULL,NULL),(5,'','','Dambo',123.000,8.000,'PRODUCTO','QUESO','KG',NULL,NULL,NULL),(6,'','','Semiduro',76.000,32.000,'PRODUCTO','QUESO','KG',NULL,NULL,NULL),(9,'','','Mermelada de Naranja 1/2 kg',20.000,5.000,'PRODUCTO','MERMELADA','KG',0.000,NULL,NULL),(10,'','','Harina de trigo',4.000,0.000,'PRODUCTO','MOLIENDA','KG',NULL,NULL,NULL),(11,'','','Harina de maiz',0.000,5.000,'PRODUCTO','MOLIENDA','KG',NULL,NULL,NULL),(12,'','','Mermelada de higo 1/2 kg',35.000,20.000,'PRODUCTO','MERMELADA','KG',NULL,NULL,NULL),(13,'','','Sardo',14.000,4.000,'PRODUCTO','QUESO','KG',NULL,NULL,NULL),(14,'','','Dulce de leche 1/2 kg',9.000,5.000,'PRODUCTO','DULCEDELECHE','KG',NULL,NULL,NULL),(15,'\0','','Ciruela',0.000,0.000,'INSUMO','FRUTA','KG',NULL,NULL,NULL),(16,'\0','','Higo',0.000,0.000,'INSUMO','FRUTA','KG',NULL,NULL,NULL),(19,'','','Trigo',682.000,20.000,'INSUMO','GRANOS','KG',NULL,10,NULL),(20,'\0','','Maiz',0.000,0.000,'INSUMO','GRANOS','KG',NULL,11,NULL),(21,'','Leche agroecológica de Centro Emmanuel','Leche',790.000,0.000,'INSUMO','LECHE','LT',35.000,NULL,NULL),(22,'','','Bicarbonato',1000.000,100.000,'INSUMO','OTROS','GRS',NULL,NULL,NULL),(23,'','Queso blanco sin sal','Quark',8.000,0.000,'PRODUCTO','QUESO','GRS',130.000,NULL,0.000),(24,'','','Mermelada de Durazno 1/2kg',20.000,0.000,'PRODUCTO','MERMELADA','KG',150.000,NULL,NULL),(25,'','Elaborada con damascos orgánicos del Centro','Mermelada de Damasco',0.000,25.000,'PRODUCTO','MERMELADA','KG',125.000,NULL,NULL),(26,'','','Frasco 1kg',800.000,50.000,'INSUMO','OTROS','UNIDAD',NULL,NULL,NULL),(27,'','','Frasco 1/2kg',500.000,100.000,'INSUMO','OTROS','UNIDAD',NULL,NULL,NULL),(30,'\0','Bicarbonato de sodio','Bicarbonato',100.000,40.000,'PRODUCTO','DULCEDELECHE','GRS',0.000,NULL,NULL),(31,'','','Lechuga',110.000,0.000,'INSUMO','FRUTASYHORTALIZAS','UNIDAD',NULL,NULL,NULL),(32,'','','Tomate perita',0.000,0.000,'INSUMO','FRUTASYHORTALIZAS','KG',NULL,NULL,NULL);
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(255) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `clave` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  UNIQUE KEY `UKpuhr3k3l7bj71hb7hk7ktpxn0` (`nombre_usuario`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (7,'admin','Agustina','Bagnasco','12345','secretaria@centroemmanuel.org',1),(10,'Mauro','Mauro','Lopez','','mauro@gmail.com',1),(11,'Andres','Andres','Blanco','12345','andresb@gmail.com',1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_permiso`
--

DROP TABLE IF EXISTS `usuario_permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario_permiso` (
  `id_permiso` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  KEY `FKtnlwadoxt5d5gas818q9k03od` (`id_permiso`),
  KEY `FKnlp0v3x57qljdvl89pujm1cjd` (`id_usuario`),
  CONSTRAINT `FKnlp0v3x57qljdvl89pujm1cjd` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`),
  CONSTRAINT `FKtnlwadoxt5d5gas818q9k03od` FOREIGN KEY (`id_permiso`) REFERENCES `permiso` (`id_permiso`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_permiso`
--

LOCK TABLES `usuario_permiso` WRITE;
/*!40000 ALTER TABLE `usuario_permiso` DISABLE KEYS */;
INSERT INTO `usuario_permiso` VALUES (3,10),(4,10),(1,7);
/*!40000 ALTER TABLE `usuario_permiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venta`
--

DROP TABLE IF EXISTS `venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `venta` (
  `fecha_venta` date NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL AUTO_INCREMENT,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_venta`),
  KEY `FKoilu1fdfgmu7sfe0spen005ms` (`id_usuario`),
  CONSTRAINT `FKoilu1fdfgmu7sfe0spen005ms` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venta`
--

LOCK TABLES `venta` WRITE;
/*!40000 ALTER TABLE `venta` DISABLE KEYS */;
INSERT INTO `venta` VALUES ('2026-10-01',7,1,440.00),('2026-10-02',7,2,860.00),('2026-10-04',7,3,3680.00),('2026-10-05',7,4,2200.00),('2026-10-07',7,5,1925.00),('2026-10-13',7,6,1560.00),('2026-10-14',7,7,1880.00),('2026-10-20',7,8,260.00);
/*!40000 ALTER TABLE `venta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'centro_emmanuel'
--

--
-- Dumping routines for database 'centro_emmanuel'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-21 18:08:05
