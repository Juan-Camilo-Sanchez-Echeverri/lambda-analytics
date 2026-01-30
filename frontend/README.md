# Lambda Analytics — Frontend

Frontend desarrollado con React + TypeScript + Vite.

**Resumen rápido:** la app usa Vite para desarrollo y build, y `axios` con `VITE_API_BASE_URL` para la URL del backend.

**Requisitos**

- Node.js >= 18
- npm, yarn o pnpm

**Instalación**

1. Abrir una terminal en la carpeta del frontend:

```bash
cd frontend
```

2. Instalar dependencias:

```bash
npm install
# o usando pnpm
pnpm install
# o usando yarn
yarn
```

**Configuración de entorno**
La aplicación espera la variable de entorno `VITE_API_BASE_URL` (accesible en el código como `import.meta.env.VITE_API_BASE_URL`).

Crear un archivo `.env.local` (o `.env`) en la carpeta `frontend/` con, por ejemplo:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Sustituye la URL por la del backend si está en otra máquina o puerto.

**Scripts útiles**

- `npm run dev` — inicia el servidor de desarrollo (Vite). Por defecto sirve en `http://localhost:5173`.
- `npm run build` — compila TypeScript y genera la build de producción en `dist`.

Ejemplos:

```bash
# Desarrollo
cd frontend
npm run dev

# Build para producción
npm run build

```

**Notas sobre el backend**

- El backend por defecto en este repositorio usa el puerto `3000`. Si ejecutas el backend localmente en `http://localhost:3000`, la variable `VITE_API_BASE_URL` del ejemplo funcionará sin cambios.
- Arranca primero el backend para que la app frontend pueda comunicarse con él.
