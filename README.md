# API de Reservaciones de Restaurante

API REST para gestión de reservaciones de un restaurante, con autenticación JWT, encriptación de contraseñas con bcrypt, control de acceso por roles (cliente/admin), validación de disponibilidad de mesas y documentación interactiva con Swagger.

## 📋 Descripción

Los clientes pueden registrarse, iniciar sesión y reservar mesas eligiendo fecha, hora y número de comensales. El sistema valida que la mesa no esté ocupada en ese bloque de fecha/hora antes de confirmar. Los administradores pueden ver todas las reservaciones, cambiar su estado y gestionar el catálogo de mesas.

## 🛠️ Tecnologías

- Node.js + Express
- PostgreSQL (Neon)
- JWT (jsonwebtoken)
- bcrypt
- Swagger (swagger-jsdoc + swagger-ui-express)

## 📦 Requisitos

- Node.js 18 o superior
- Cuenta en [Neon](https://neon.tech) (PostgreSQL en la nube)
- Postman (para importar la colección de pruebas)
- Railway (para deploy)

## ⚙️ Instalación local

1. Clona el repositorio:
```bash
   git clone https://github.com/amoraga-bit/M6Act2_API_REST_JWT_Swagger.git
   cd M6Act2_API_REST_JWT_Swagger
```

2. Instala las dependencias:
```bash
   npm install
```

3. Copia el archivo de variables de entorno de ejemplo:
```bash
   cp .env.example .env
```

4. Edita `.env` con tus valores reales:
```
   PORT=3000
   DATABASE_URL=postgresql://usuario:password@host.neon.tech/dbname?sslmode=require
   JWT_SECRET=un-secreto-largo-y-aleatorio
   JWT_EXPIRES_IN=4d
```

5. Ejecuta el script `databases/schema.sql` en tu instancia de Neon (desde el **SQL Editor** de Neon, pega y ejecuta el contenido del archivo). Esto crea las tablas `usuarios`, `mesas`, `reservaciones` y agrega datos de ejemplo (seed).

6. Levanta el servidor en modo desarrollo:
```bash
   npm run dev
```

7. Verifica que responde en [http://localhost:3000](http://localhost:3000)

## 📖 Documentación interactiva (Swagger)

Con el servidor corriendo, accede a:
```
http://localhost:3000/api-docs
```

Ahí puedes ver todos los endpoints documentados y probarlos directamente (botón **Authorize** para pegar tu token JWT en rutas protegidas).

## 📮 Colección Postman

En la raíz del repo está `postman_collection.json`. Impórtala en Postman (**Import** → selecciona el archivo) para tener listas todas las peticiones organizadas por Auth, Mesas y Reservaciones.

## 🔑 Variables de entorno (`.env.example`)

| Variable | Descripción |
|---|---|
| `PORT` | Puerto donde corre el servidor local (default 3000) |
| `DATABASE_URL` | Connection string de PostgreSQL (Neon) |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token (ej. `4d`, `2h`) |

## 🔑 Endpoints principales

### Auth — `/api/auth`
| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/register` | Registro de nuevo cliente | Público |
| POST | `/login` | Login, devuelve JWT | Público |
| GET | `/perfil` | Datos del usuario autenticado | Cliente |

### Mesas — `/api/mesas`
| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| GET | `/` | Listar mesas activas (filtro disponibilidad) | Público |
| GET | `/:id` | Detalle de una mesa | Público |
| POST | `/` | Crear mesa | Admin |
| PUT | `/:id` | Actualizar mesa | Admin |
| DELETE | `/:id` | Desactivar mesa (soft delete) | Admin |

### Reservaciones — `/api/reservaciones`
| Método | Endpoint | Descripción | Acceso |
|---|---|---|---|
| POST | `/` | Crear reservación (valida disponibilidad) | Cliente |
| GET | `/mis` | Mis reservaciones | Cliente |
| GET | `/` | Todas las reservaciones (filtros) | Admin |
| PUT | `/:id/estado` | Cambiar estado de reservación | Admin |
| DELETE | `/:id` | Cancelar propia reservación | Cliente |

## 🧪 Ejemplo de uso

**Registro:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana Torres","email":"ana@example.com","password":"MiPassword123!"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@example.com","password":"MiPassword123!"}'
```

**Ruta protegida (con token):**
```bash
curl http://localhost:3000/api/auth/perfil \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

## 🚀 Despliegue

- **API en producción:** https://m6act2apirestjwtswagger-production.up.railway.app/
- **Documentación Swagger (producción):** https://m6act2apirestjwtswagger-production.up.railway.app/api-docs
- **Base de datos:** Neon (PostgreSQL serverless)

## 📂 Estructura del proyecto

```
M6Act2/
├── databases/
│   └── schema.sql
├── src/
│   ├── config/db.js
│   ├── middleware/
│   ├── controllers/
│   ├── routes/
│   └── swagger/
├── server.js
├── postman_collection.json
├── .env.example
└── README.md
```

## 👤 Autor
Amílcar Moraga
Proyecto desarrollado como actividad evaluada — Módulo 6. 