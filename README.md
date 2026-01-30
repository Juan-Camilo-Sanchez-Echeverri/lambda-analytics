# Lambda Analytics

Plataforma de gestión y análisis de proyectos con dashboard interactivo para el seguimiento de indicadores, actividades y reportes.

## Estructura del Proyecto

| Carpeta                            | Descripción                                  | Instrucciones                                                  |
| ---------------------------------- | -------------------------------------------- | -------------------------------------------------------------- |
| [backend/](backend/)               | API REST con NestJS, TypeORM, PostgreSQL     | [Ver README](backend/README.md)                                |
| [frontend/](frontend/)             | Aplicación web con React 19, Vite y Recharts | [Ver README](frontend/README.md)                               |
| [infrastructure/](infrastructure/) | Documentación de arquitectura AWS            | [Ver arquitectura](infrastructure/architectureDashboardAws.md) |

## Inicio Rápido

```bash
# Clonar el repositorio
git clone https://github.com/tu-organizacion/lambda-analytics.git
cd lambda-analytics

# Backend (ver instrucciones completas en backend/README.md)
cd backend
npm run docker:up

# Frontend (ver instrucciones completas en frontend/README.md)
cd ../frontend
npm install && npm run dev
```

## Accesos

| Servicio    | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost:5173 |
| Backend API | http://localhost:3000 |
