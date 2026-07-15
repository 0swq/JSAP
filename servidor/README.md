# Biblioteca Universitaria

Backend REST para la gestión de una biblioteca universitaria.

**Stack:** Node.js · Express · TypeScript · Prisma ORM · PostgreSQL · JWT · Joi

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- Git

## Instalación

```bash
git clone https://github.com/0swq/JSA-avanzado.git
cd JSA-avanzado/servidor

npm install
```

## Variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tus datos:

```
PORT=3000
DATABASE_URL=postgresql://usuario:password@localhost:5432/biblioteca
JWT_SECRET=una-clave-segura
JWT_EXPIRES_IN=8h
NODE_ENV=development
```

## Base de datos

```bash
# Crear la base de datos en PostgreSQL
psql -U postgres -c "CREATE DATABASE biblioteca;"

# Ejecutar migraciones
npx prisma migrate dev --name init

# Sembrar datos iniciales (roles, usuarios, configuración)
npx ts-node -r tsconfig-paths/register prisma/seed.ts
```

Una vez creada la tabla `libro`, ejecutar en PostgreSQL para habilitar fts:

```sql
ALTER TABLE "libro"
    ADD COLUMN busqueda_fts tsvector
        GENERATED ALWAYS AS (
            to_tsvector('spanish',
                        coalesce(titulo, '') || ' ' ||
                        coalesce(descripcion, '') || ' ' ||
                        coalesce(isbn, '')
            )
            ) STORED;

CREATE INDEX libro_busqueda_fts_idx ON "libro" USING GIN(busqueda_fts);
```

## Arrancar

```bash
npm run dev
```

El servidor corre en `http://localhost:3000`.

## Usuarios de prueba

| Correo | Contraseña | Rol |
|--------|-----------|-----|
| admin@biblioteca.edu | 12345678 | admin |
| bibliotecario@biblioteca.edu | 12345678 | bibliotecario |
| docente@biblioteca.edu | 12345678 | docente |
| estudiante@biblioteca.edu | 12345678 | estudiante |

## Login

```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{"correo": "admin@biblioteca.edu", "password": "12345678"}
```

Usar el token recibido como `Authorization: Bearer <token>` en las demás rutas.

## Endpoints

| Ruta | GET | POST | PATCH | DELETE |
|------|-----|------|-------|--------|
| `/api/auth` | me | login, registro | – | – |
| `/api/usuarios` | todos, me, :id | crear | actualizar | eliminar |
| `/api/roles` | todos, :id | crear | actualizar | eliminar |
| `/api/autores` | todos, :id | crear | actualizar | eliminar |
| `/api/categorias` | todos, :id | crear | actualizar | eliminar |
| `/api/editoriales` | todos, :id | crear | actualizar | eliminar |
| `/api/libros` | todos, :id | crear | actualizar | eliminar |
| `/api/recursos-digitales` | todos, :id | crear | actualizar | eliminar |
| `/api/ejemplares` | todos, :id | crear | actualizar | eliminar |
| `/api/prestamos` | todos, mis-prestamos, :id | crear | actualizar | – |
| `/api/multas` | todos, mis-multas, :id | crear | actualizar | – |
| `/api/pagos-multa` | todos, :id | crear | actualizar | – |
| `/api/reservas` | todos, mis-reservas, :id | crear | actualizar | eliminar |
| `/api/resenas` | libro/:id, mis-resenas, :id | crear | actualizar | eliminar |
| `/api/historial` | todos, :id | crear | – | – |
| `/api/favoritos` | mis-favoritos, :id | crear | – | eliminar |
| `/api/configuracion-multa` | todos, :id | crear | actualizar | – |

## Arquitectura

```
Route → Joi Validate → Controller → Service → Repository → Prisma → PostgreSQL
```

## Cliente Angular

El frontend está en la carpeta `../cliente`. Requiere Angular CLI 17+.

```bash
cd ../cliente

# Instalar dependencias
npm install

# Arrancar servidor de desarrollo
ng serve
```

La app corre en `http://localhost:4200` y se comunica con el backend en `http://localhost:3000`.

Configurar la URL del backend en `cliente/src/environments/environment.ts` si es necesario.

## Scripts

```bash
npm run dev          # desarrollo con hot reload
npm start            # producción
npm run build        # compilar TypeScript
npx prisma studio    # interfaz visual de la BD
```
