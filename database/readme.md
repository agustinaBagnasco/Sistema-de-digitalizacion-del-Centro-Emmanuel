# Base de Datos - Centro Emmanuel

Esta carpeta contiene todos los archivos relacionados con la base de datos del Sistema Centro Emmanuel.

## Objetivo

Centralizar la estructura y el mantenimiento de la base de datos utilizada por el sistema.

## Contenido

```
database/
│
├── schema/
│   ├── create_tables.sql
│   ├── constraints.sql
│   └── indexes.sql
│
├── seed/
│   ├── usuarios.sql
│   ├── roles.sql
│   └── datos_iniciales.sql
│
├── migrations/
│
├── backups/
│
├── diagramas/
│   ├── modelo_er.png
│   └── modelo_er.drawio
│
└── README.md
```

## Motor de Base de Datos

- MySQL 8

## Convenciones

- Nombres de tablas en minúsculas.
- Uso de claves primarias autoincrementales.
- Claves foráneas para mantener la integridad.
- Índices en campos de búsqueda frecuente.
- Scripts versionados mediante Git.

## Módulos

La base de datos contempla los siguientes módulos:

- Usuarios
- Roles
- Producción
- Insumos
- Productos
- Ventas
- Stock
- Configuración

## Restaurar una copia

```bash
mysql -u usuario -p centro_emmanuel < backup.sql
```

## Crear una copia de seguridad

```bash
mysqldump -u usuario -p centro_emmanuel > backup.sql
```

## Versionado

Todos los cambios en la estructura deben realizarse mediante scripts SQL o migraciones para mantener el historial del proyecto.

## Estado

🚧 En desarrollo.