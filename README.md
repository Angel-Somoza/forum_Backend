# Forum Backend

Backend del proyecto Forum desarrollado con Node.js, Express y PostgreSQL.

## Stack

- Node.js 22.x
- npm 10.x
- Express
- PostgreSQL 18
- Docker / Docker Compose
- Knex
- pg
- ESLint
- Prettier

## Requisitos

Antes de trabajar con el proyecto debes tener instalado:

- Node.js >= 22
- npm >= 10
- Git
- Docker Desktop
- Docker Compose

## Instalacion

Clonar el repositorio y entrar al proyecto.

Instalar las dependencias:

npm ci

Crear el archivo `.env` tomando como referencia `.env.example`, tomando en cuenta no subir el archivo .env a sus ramas.

## Base de datos de desarrollo

La base de datos PostgreSQL 18 utilizando la imagen de docker para su facil instalacion
Levantar PostgreSQL:
-docker compose up -d

## Migraciones

La estructura de la base de datos se administra mediante migraciones de knex si ustedes hacen cambios se iran usando migraciones para poder tener tablas juntas

si hay migraciones que hacen falta usar

- npm run migrate

Crear una nueva migracion de ser necesario

npm run migrate:make -- name_migration

Revertir la migracion mas reciente -- siempre consultar al equipo

npm run migrate:rollback

Los cambios en la estructura de la base de datos no deben realizarse de forma manual desde otro lado, todo cambio en tablas, columnas, indices, constraints o relaciones debe realizarse mediante una migracion(igual siempre consultar al equipo antes de modificar algo de la base de datos).

## Desarrollo

Antes de subir cambios comprobar la calidad del proyecto, tenemos un ci que hace desde una actios pero siempre validar la calidad del codigo antes de surbirla.
npm run lint
npm run format:check
npm test
npm audit

Para aplicar automaticamente el formato:
npm run format

## Testing

Ejecutar las pruebas:
npm test
Actualmente se utiliza el test runner integrado de Node.js.

## Seguridad

Despues de instalar o actualizar dependencias ejecutar:
npm audit

Nunca utilizar:
npm audit fix --force

Nunca subir al repositorio:

- `.env`
- credenciales
- tokens
- contrasenas
- secretos
- `node_modules` -- esta especificamente jamas se sube.

Las credenciales reales de desarrollo deben mantenerse unicamente en el archivo local `.env`.
Las credenciales de produccion nunca deben almacenarse en el repositorio.

## Dependencias

Para instalar las dependencias existentes del proyecto utilizar:
npm ci

Para agregar una nueva dependencia:
npm install nombre-del-paquete

Para agregar una dependencia unicamente de desarrollo:
npm install -D nombre-del-paquete

`package.json` y `package-lock.json` deben mantenerse versionados en Git.

## Git

La rama principal es:

main -- jamas desarrollar features o fix sobre la rama main.

Crear una rama para cada cambio. Ejemplos:

feature/name -- integraciones de nuevos modulos
fix/name -- para reparar bugs
refactor/name -- moficaciones que no afecta usuario
chore/name -- configuraciones del space work.

Los cambios deben integrarse posteriormente mediante Pull Request.

## Flujo para un nuevo desarrollador

Despues de clonar el repositorio:
npm ci

Crear `.env` utilizando `.env.example` como referencia.

Levantar PostgreSQL:
docker compose up -d

Aplicar migraciones:
npm run migrate

Comprobar el proyecto:
npm run lint
npm run format:check
npm test
