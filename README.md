# Subscription Manager

Sistema para gestionar suscripciones personales a servicios (Netflix, Gemini, Google Cloud, etc.)

## 📊 Progreso del Proyecto

| Fase | Estado | Progreso |
|------|--------|----------|
| 1️⃣ Inicialización | ✅ Completada | ████████████████████ 100% |
| 2️⃣ Backend Core | ⏳ Pendiente | ░░░░░░░░░░░░░░░░░░░░ 0% |
| 3️⃣ Frontend Development | ⏳ Pendiente | ░░░░░░░░░░░░░░░░░░░░ 0% |
| 4️⃣ Integración y Testing | ⏳ Pendiente | ░░░░░░░░░░░░░░░░░░░░ 0% |

📖 Ver [Detalles completos de fases](./PHASES.md) | 🚀 Ver [Estado Backend](./backend/SETUP.md)

---

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
├── frontend/          # React + Vite + TypeScript + TailwindCSS
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── types/
│   └── package.json
│
└── backend/           # Node + Express + Prisma + PostgreSQL
    ├── src/
    │   ├── routes/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── services/
    │   └── config/
    ├── prisma/
    │   └── schema.prisma
    └── package.json
```

## 🚀 Inicialización

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
   # Generar cliente Prisma
   npm run prisma:generate
   
   # Crear migraciones
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

### Tablas Principales

#### User
- id, email, name, avatar, role (ADMIN|USER)
- timestamps

#### OAuthAccount
- id, userId, provider (GOOGLE|GITHUB), providerAccountId
- tokens y expiración

#### Subscription
- id, userId, name, description, category, amount, currency
- billingCycle (MONTHLY|YEARLY|WEEKLY)
- isTrial, trialEndDate, nextBillingDate, lastBillingDate
- status (ACTIVE|CANCELLED|PAUSED|TRIAL)
- notes, timestamps

#### Category
- id, name, color, icon
- timestamps

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/google/callback` - Login con Google
- `POST /api/auth/github/callback` - Login con GitHub
- `GET /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Suscripciones
- `GET /api/subscriptions` - Listar suscripciones
- `GET /api/subscriptions/:id` - Obtener suscripción por ID
- `POST /api/subscriptions` - Crear suscripción
- `PUT /api/subscriptions/:id` - Actualizar suscripción
- `DELETE /api/subscriptions/:id` - Eliminar suscripción
- `GET /api/subscriptions/stats` - Estadísticas
- `GET /api/subscriptions/upcoming` - Próximos cobros

### Categorías
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría (admin)

### Usuarios (admin)
- `GET /api/users` - Listar usuarios
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id/role` - Cambiar rol
- `DELETE /api/users/:id` - Eliminar usuario

## 🎨 Frontend Rutas

- `/` - Dashboard principal
- `/login` - Login con OAuth2
- `/subscriptions/new` - Crear suscripción
- `/subscriptions/:id/edit` - Editar suscripción
- `/subscriptions/:id` - Detalle de suscripción
- `/categories` - Gestionar categorías
- `/settings` - Configuración de cuenta
- `/stats` - Estadísticas y gráficos
- `/calendar` - Calendario de cobros

## 🔑 Configuración OAuth2

Para configurar OAuth2 con Google y GitHub:

### Google OAuth
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear nuevo proyecto
3. Habilitar Google+ API
4. Crear credenciales OAuth 2.0
5. Agregar URLs de callback: `http://localhost:3001/api/auth/google/callback`

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
