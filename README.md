# 🛒 PM4 - E-commerce de Productos Tecnológicos

---

## 📖 About

API REST **Backend** para una plataforma de comercio electrónico de productos tecnológicos. Desarrollada con **NestJS** y arquitectura modular, implementando autenticación JWT, gestión de productos, categorías y órdenes, con integración a **Cloudinary** para imágenes y documentación automática con **Swagger**.

---

## 🛠️ Tecnologías Usadas

- **NestJS 11 / TypeScript** — Framework progresivo con tipado estático
- **TypeORM / PostgreSQL** — Base de datos relacional con ORM
- **JWT (@nestjs/jwt)** — Autenticación basada en tokens
- **bcrypt** — Encriptación de contraseñas
- **Cloudinary** — Almacenamiento de imágenes en la nube
- **class-validator / class-transformer** — Validación y transformación de DTOs
- **Swagger (@nestjs/swagger)** — Documentación automática de la API
- **Jest / Supertest** — Testing unitario e integración
- **ESLint / Prettier** — Calidad y formato de código

---

## ✨ Funcionalidades Principales

- 🔐 **Autenticación** — Registro y login con JWT, contraseñas encriptadas con bcrypt
- 👥 **Usuarios** — CRUD con sistema de roles (admin / usuario)
- 📦 **Productos** — CRUD con gestión de stock, categoría e imagen
- 🗂️ **Categorías** — Gestión de categorías con seeder automático desde `data.json`
- 🛍️ **Órdenes** — Creación de órdenes con detalles por usuario y productos
- 🖼️ **File Upload** — Subida de imágenes a Cloudinary
- 📋 **Swagger** — Documentación interactiva disponible en `/api`
- 🔒 **Guards** — AuthGuard y RolesGuard para proteger endpoints
- 📝 **Logger Middleware** — Registro de método, ruta y timestamp en cada petición

---

## 🏗️ Arquitectura

```
PM4-EcommerceTecnologico/
└── src/
    ├── auth/               # Registro, login y JWT
    ├── users/              # CRUD de usuarios y roles
    ├── products/           # CRUD de productos con stock e imagen
    ├── categories/         # Categorías con seeder automático
    ├── orders/             # Órdenes y detalles de órdenes
    ├── files/              # Subida de imágenes a Cloudinary
    ├── middlewares/        # Logger middleware global
    ├── guards/             # AuthGuard y RolesGuard
    ├── decorators/         # Custom decorators para roles
    └── config/             # Configuración de TypeORM y variables de entorno
```

- Arquitectura modular: cada módulo tiene su **Controller → Service → Repository → Entity**
- Validación automática con **ValidationPipe** global y decoradores de class-validator
- Manejo centralizado de errores con excepciones HTTP de NestJS

---

## ⚙️ Instalación y Ejecución

### Requisitos previos
- Node.js instalado
- PostgreSQL corriendo localmente
- Cuenta en Cloudinary

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/LACanonNieto/PM4-EcommerceTecnologico.git
cd PM4-EcommerceTecnologico
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar variables de entorno

Crear un archivo `.env` con:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_base_de_datos
JWT_SECRET=tu_secreto_jwt
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 4️⃣ Ejecutar

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

Servidor en: `http://localhost:3000`
Documentación Swagger en: `http://localhost:3000/api`

---

## 🔗 Endpoints Principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/auth/register` | Registro de usuario |
| `POST` | `/auth/login` | Inicio de sesión |
| `GET` | `/users` | Todos los usuarios (admin) |
| `GET` | `/users/:id` | Usuario por ID |
| `GET` | `/products` | Todos los productos |
| `POST` | `/products` | Crear producto (admin) |
| `PUT` | `/products/:id` | Actualizar producto (admin) |
| `DELETE` | `/products/:id` | Eliminar producto (admin) |
| `GET` | `/categories` | Todas las categorías |
| `POST` | `/orders` | Crear orden |
| `GET` | `/orders/:id` | Detalle de una orden |
| `POST` | `/files/uploadImage/:id` | Subir imagen de producto |
