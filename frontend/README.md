Sistema de Digitalización del Centro Emmanuel — Frontend

Aplicación web frontend desarrollada para el Centro Emmanuel, como parte del proyecto de digitalización y gestión de los procesos internos de la institución.

El sistema permite centralizar y facilitar la gestión de información relacionada con productos, producción, elaboración, ventas, stock y usuarios, proporcionando una interfaz web para la interacción con el sistema.

Tecnologías utilizadas
React
Vite
JavaScript
HTML5
CSS3
Axios para la comunicación con el backend
React Router para la navegación entre vistas

El frontend se comunica con una API REST desarrollada con Spring Boot, que se encarga de la lógica de negocio y del acceso a la base de datos MySQL.

Requisitos

Para ejecutar el proyecto localmente se requiere tener instalado:

Node.js
npm
Git

Además, para utilizar todas las funcionalidades del sistema debe estar disponible el backend de Spring Boot y la base de datos MySQL.

Instalación
1. Clonar el repositorio
git clone URL_DEL_REPOSITORIO

Ingresar al directorio del frontend:

cd frontend

Si el repositorio ya corresponde directamente al frontend, simplemente ingresar al directorio donde se encuentra el proyecto.

2. Instalar las dependencias

Ejecutar:

npm install

Esto instalará todas las dependencias necesarias definidas en package.json.

Configuración

El frontend necesita conocer la dirección donde se encuentra disponible el backend.

La URL de la API debe configurarse de acuerdo con el entorno en el que se ejecute el sistema.

Por ejemplo:

http://localhost:8080

Si el proyecto utiliza variables de entorno, crear un archivo:

.env

con la configuración correspondiente, por ejemplo:

VITE_API_URL=http://localhost:8080

La variable y su nombre deben coincidir con las utilizadas por el código del proyecto.

Ejecución en modo desarrollo

Una vez instaladas las dependencias, ejecutar:

npm run dev

Vite iniciará el servidor de desarrollo y mostrará una dirección similar a:

http://localhost:5173

Abrir esa dirección desde un navegador para acceder a la aplicación.

Compilación para producción

Para generar la versión optimizada del frontend:

npm run build

Los archivos generados estarán disponibles en:

dist/

Para realizar una prueba local de la versión compilada:

npm run preview
Estructura del proyecto

frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── routes/
│   ├── App.jsx
│   └── main.jsx
│
├── elint.config.js
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
Principales directorios

components/

Contiene componentes reutilizables de la interfaz, como formularios, tablas, botones y otros elementos visuales.

pages/

Contiene las diferentes vistas o páginas de la aplicación.

services/

Contiene la lógica relacionada con la comunicación con el backend mediante solicitudes HTTP.

routes/

Contiene la configuración de las rutas y navegación de la aplicación.

assets/

Contiene recursos utilizados por la interfaz, como imágenes e iconos.

Comunicación con el backend

La comunicación entre el frontend y el backend se realiza mediante una API REST.

El frontend realiza solicitudes HTTP para consultar, registrar, modificar y eliminar información.




