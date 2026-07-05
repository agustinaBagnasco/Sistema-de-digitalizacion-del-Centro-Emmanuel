# Backend - Centro Emmanuel

Backend del Sistema de Gestión del Centro Emmanuel.

## Descripción

Este proyecto contiene toda la lógica de negocio y la API REST encargada de comunicarse con el frontend y la base de datos.

Está desarrollado utilizando:

- Java
- Spring Boot
- Maven
- JPA / Hibernate
- MySQL

## Estructura

```
backend/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com.centroemmanuel
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── repository/
│   │   │       ├── entity/
│   │   │       ├── dto/
│   │   │       ├── config/
│   │   │       └── security/
│   │   └── resources/
│   │       ├── application.properties
│   │       └── data.sql
│   └── test/
│
├── pom.xml
└── README.md
```

## Funcionalidades

- Autenticación de usuarios
- Gestión de producción e insumos
- Control de stock
- Administración de ventas
- Reportes
- API REST

## Requisitos

- Java 21
- Maven 3.9+
- MySQL 8+


## Ejecutar el proyecto

```bash
mvn spring-boot:run
```

o

```bash
mvn clean install
java -jar target/backend.jar
```

## Arquitectura

Se utiliza una arquitectura en capas:

```
Controller
     ↓
Service
     ↓
Repository
     ↓
Base de Datos
```

## Estado

🚧 En desarrollo.