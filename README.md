# Forum Backend

Backend del proyecto Forum desarrollado con Node.js y Express.

## Requisitos

- Node.js arriba del 22
- npm arriba del 10
- Git

## Instalación

Clonar el repositorio y entrar al proyecto.

Instalar las dependencias:

    npm ci

Crear el archivo `.env` tomando como referencia `.env.example`.

## Desarrollo

Antes de trabajar, comprobar la calidad del proyecto:

    npm run lint
    npm run format:check

Para aplicar automáticamente el formato:

    npm run format

## Seguridad

Comprobrar siempre al instalar nuevos npms si la version es vurnerable

    npm audit

No utilizar `npm audit fix --force`

Nunca subir al repositorio:

- `.env`
- credenciales
- tokens
- contraseñas
- secretos
- `node_modules`


La rama principal es `main`.

Los cambios deben desarrollarse en ramas separadas y posteriormente integrarse mediante Pull Request.
