# Backend

## Tecnologías

- **API:** NestJS (Node.js)
- **Base de Datos:** PostgreSQL con TypeORM
- **Seguridad:** Helmet & Compression
- **Autenticación:** JWT con Passport
- **Documentación API:** Swagger
- **Validación:** Class-validator & Joi

## Requerimientos

- Node.js (v20 o superior)
- npm
- PostgreSQL (v14 o superior)
- Docker y Docker Compose

## Clonar el Proyecto

Para clonar el proyecto y ubicarse en la carpeta del proyecto, se deben ejecutar los siguientes comandos:

```bash
git clone URL_DEL_REPOSITORIO
cd lambda-analytics/backend
```

## Configuración del Entorno

1. Copie el archivo de ejemplo para crear su archivo de configuración:

```bash
cp .env.example .env
```

2. Edite el archivo `.env` con las credenciales de su base de datos y otras configuraciones necesarias.

## Ejecutar

### Con Docker

Inicie todos los servicios (Base de datos, Redis y App):
npm run docker:up

El proyecto incluye scripts simplificados para la gestión de contenedores:

* `npm run docker:up`: Inicia todos los servicios en segundo plano.
* `npm run docker:down`: Detiene y elimina los contenedores.

## Documentación API

Una vez que la aplicación esté corriendo, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:<PORT>/docs
```

> Nota: El `<PORT>` es el puerto configurado en su archivo `.env` (por defecto 3000).


