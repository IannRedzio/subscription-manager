# Subscription Manager

Sistema para gestionar suscripciones personales a servicios (Netflix, Gemini, Google Cloud, etc.)

## 🚀 Inicio Rápido

### Backend

```bash
cd backend
source ~/.nvm/nvm.sh
nvm use 22
npm run dev
```

### Frontend

```bash
cd frontend
source ~/.nvm/nvm.sh
nvm use 22
npm run dev
```

## 📁 Estructura del Proyecto

```
subscription-manager/
├── frontend/             # React + Vite + TypeScript + TailwindCSS
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── types/
│   └── package.json
│
└── backend/              # Node + Express + Prisma + PostgreSQL
    ├── src/
    │   ├── config/       # Database (Prisma) y Passport (OAuth)
    │   ├── controllers/  # Adaptadores HTTP
    │   ├── middlewares/   # Auth (JWT), Admin (rol), Error handler
    │   ├── models/       # Entidades, value types y DTOs
    │   ├── repositories/ # Acceso a datos (Prisma → PostgreSQL)
    │   ├── routes/       # Definición de endpoints
    │   ├── services/     # Lógica de negocio y validación
    │   ├── utils/        # Errores tipados
    │   ├── types/        # Extensiones de tipos Express
    │   ├── app.ts        # Configuración de Express
    │   └── index.ts      # Punto de entrada
    ├── prisma/
    │   └── schema.prisma
    └── package.json
```

📖 Ver [Arquitectura del Backend](./backend/ARCHITECTURE.md) para más detalles.

## 🚀 Instalación

### Requisitos Previos

- Node.js 22 (usando nvm: `nvm use 22`)
- PostgreSQL

### Backend

1. **Instalar dependencias:**

   ```bash
   cd backend
   npm install
   ```

2. **Configurar variables de entorno:**

   ```bash
   cp .env.example .env
   # Editar .env con tus credenciales
   ```

3. **Configurar base de datos:**

   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

### Frontend

1. **Instalar dependencias:**

   ```bash
   cd frontend
   npm install
   ```

2. **Configurar variables de entorno:**

   ```bash
   cp .env.example .env
   ```

3. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## 📊 Esquema de Base de Datos

| Tabla            | Campos principales                                                        |
| ---------------- | ------------------------------------------------------------------------- |
| **User**         | id, email, name, avatar, role (ADMIN \| USER)                             |
| **OAuthAccount** | id, userId, provider (GOOGLE \| GITHUB), providerAccountId, tokens        |
| **Subscription** | id, userId, name, category, amount, currency, billingCycle, status, dates |
| **Category**     | id, name, color, icon                                                     |

## 🔌 API Endpoints

### Autenticación

| Método | Ruta                        | Descripción              |
| ------ | --------------------------- | ------------------------ |
| GET    | `/api/auth/google`          | Iniciar login con Google |
| GET    | `/api/auth/google/callback` | Callback de Google       |
| GET    | `/api/auth/github`          | Iniciar login con GitHub |
| GET    | `/api/auth/github/callback` | Callback de GitHub       |
| POST   | `/api/auth/logout`          | Cerrar sesión            |
| GET    | `/api/auth/me`              | Obtener usuario actual   |

### Suscripciones (requiere auth)

| Método | Ruta                          | Descripción                       |
| ------ | ----------------------------- | --------------------------------- |
| GET    | `/api/subscriptions`          | Listar (con filtros y paginación) |
| GET    | `/api/subscriptions/stats`    | Estadísticas                      |
| GET    | `/api/subscriptions/upcoming` | Próximos cobros                   |
| GET    | `/api/subscriptions/:id`      | Obtener por ID                    |
| POST   | `/api/subscriptions`          | Crear                             |
| PUT    | `/api/subscriptions/:id`      | Actualizar                        |
| DELETE | `/api/subscriptions/:id`      | Eliminar                          |

### Categorías

| Método | Ruta              | Descripción             |
| ------ | ----------------- | ----------------------- |
| GET    | `/api/categories` | Listar categorías       |
| POST   | `/api/categories` | Crear categoría (admin) |

### Usuarios (requiere admin)

| Método | Ruta                  | Descripción      |
| ------ | --------------------- | ---------------- |
| GET    | `/api/users`          | Listar usuarios  |
| GET    | `/api/users/:id`      | Obtener usuario  |
| PUT    | `/api/users/:id/role` | Cambiar rol      |
| DELETE | `/api/users/:id`      | Eliminar usuario |

## 🎨 Frontend Rutas

| Ruta                      | Descripción             |
| ------------------------- | ----------------------- |
| `/`                       | Dashboard principal     |
| `/login`                  | Login con OAuth2        |
| `/subscriptions/new`      | Crear suscripción       |
| `/subscriptions/:id/edit` | Editar suscripción      |
| `/subscriptions/:id`      | Detalle de suscripción  |
| `/categories`             | Gestionar categorías    |
| `/settings`               | Configuración de cuenta |
| `/stats`                  | Estadísticas y gráficos |
| `/calendar`               | Calendario de cobros    |

## 🔑 Configuración OAuth2

### Google OAuth

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear nuevo proyecto
3. Habilitar Google+ API
4. Crear credenciales OAuth 2.0
5. Agregar URL de callback: `http://localhost:3001/api/auth/google/callback`

### GitHub OAuth

1. Ir a [GitHub Developer Settings](https://github.com/settings/developers)
2. Crear nueva OAuth App
3. Agregar callback URL: `http://localhost:3001/api/auth/github/callback`

## 📝 Scripts Útiles

### Backend

```bash
npm run dev              # Servidor en modo desarrollo
npm run build            # Compilar TypeScript
npm run start            # Servidor de producción
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:migrate   # Crear y aplicar migraciones
npm run prisma:studio    # Interfaz visual de Prisma
```

### Frontend

```bash
npm run dev              # Servidor de desarrollo
npm run build            # Build de producción
npm run preview          # Preview del build
```
