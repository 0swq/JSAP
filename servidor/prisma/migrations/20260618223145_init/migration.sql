-- CreateTable
CREATE TABLE "rol" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" TEXT,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" VARCHAR(128) NOT NULL,
    "rol_id" UUID NOT NULL,
    "nombre" TEXT,
    "apellidos" TEXT,
    "dni" TEXT,
    "correo" TEXT,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "autor" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(100),
    "apellidos" VARCHAR(200) NOT NULL,
    "nacionalidad" VARCHAR(100),
    "biografia" TEXT,
    "foto_url" TEXT,
    "fecha_nacimiento" DATE,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "autor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "padre_id" UUID,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "editorial" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(150),
    "pais" TEXT,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "editorial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "libro" (
    "id" UUID NOT NULL,
    "titulo" VARCHAR(300) NOT NULL,
    "isbn" VARCHAR(20),
    "editorial_id" UUID NOT NULL,
    "anio_publicacion" INTEGER,
    "idioma" TEXT,
    "publicado" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "libro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recurso_digital" (
    "id" UUID NOT NULL,
    "libro_id" UUID NOT NULL,
    "tipo" VARCHAR(30) NOT NULL,
    "url" TEXT NOT NULL,
    "formato" VARCHAR(20),
    "tamanio_mb" DECIMAL(65,30),
    "duracion_minutos" INTEGER,
    "tipo_acceso" VARCHAR(30),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recurso_digital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ejemplar" (
    "id" UUID NOT NULL,
    "libro_id" UUID NOT NULL,
    "codigo_barras" VARCHAR(50) NOT NULL,
    "estado" VARCHAR(30) NOT NULL DEFAULT 'disponible',
    "ubicacion" TEXT,
    "fecha_adquisicion" DATE,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ejemplar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "libro_autor" (
    "libro_id" UUID NOT NULL,
    "autor_id" UUID NOT NULL,

    CONSTRAINT "libro_autor_pkey" PRIMARY KEY ("libro_id","autor_id")
);

-- CreateTable
CREATE TABLE "libro_categoria" (
    "libro_id" UUID NOT NULL,
    "categoria_id" UUID NOT NULL,

    CONSTRAINT "libro_categoria_pkey" PRIMARY KEY ("libro_id","categoria_id")
);

-- CreateTable
CREATE TABLE "prestamo" (
    "id" UUID NOT NULL,
    "usuario_id" VARCHAR(128) NOT NULL,
    "ejemplar_id" UUID NOT NULL,
    "fecha_max_devolucion" TIMESTAMPTZ(6) NOT NULL,
    "fecha_devolucion" TIMESTAMPTZ(6),
    "estado" VARCHAR(20) NOT NULL DEFAULT 'activo',
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prestamo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "multa" (
    "id" UUID NOT NULL,
    "prestamo_id" UUID NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "dias_mora" INTEGER NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "multa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pago_multa" (
    "id" UUID NOT NULL,
    "multa_id" UUID NOT NULL,
    "monto_pagado" DECIMAL(10,2) NOT NULL,
    "metodo_pago" VARCHAR(50) NOT NULL,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pago_multa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserva" (
    "id" UUID NOT NULL,
    "usuario_id" VARCHAR(128) NOT NULL,
    "libro_id" UUID NOT NULL,
    "fecha_expiracion" TIMESTAMPTZ(6) NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuracion_multa" (
    "id" UUID NOT NULL,
    "tarifa_diaria" DECIMAL(10,2) NOT NULL,
    "dias_max_prestamo" INTEGER NOT NULL,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "configuracion_multa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resena" (
    "id" UUID NOT NULL,
    "usuario_id" VARCHAR(128) NOT NULL,
    "libro_id" UUID NOT NULL,
    "puntuacion" INTEGER,
    "comentario" TEXT,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resena_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial" (
    "id" UUID NOT NULL,
    "nombre_accion" VARCHAR(100) NOT NULL,
    "accion" TEXT NOT NULL,
    "hecho_por" VARCHAR(128) NOT NULL,
    "modulo" VARCHAR(50),
    "ip_usuario" VARCHAR(50),
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorito" (
    "id" UUID NOT NULL,
    "usuario_id" VARCHAR(128) NOT NULL,
    "libro_id" UUID NOT NULL,
    "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorito_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rol_nombre_key" ON "rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "libro_isbn_key" ON "libro"("isbn");

-- CreateIndex
CREATE UNIQUE INDEX "ejemplar_codigo_barras_key" ON "ejemplar"("codigo_barras");

-- CreateIndex
CREATE UNIQUE INDEX "multa_prestamo_id_key" ON "multa"("prestamo_id");

-- CreateIndex
CREATE UNIQUE INDEX "favorito_usuario_id_libro_id_key" ON "favorito"("usuario_id", "libro_id");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "rol"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoria" ADD CONSTRAINT "categoria_padre_id_fkey" FOREIGN KEY ("padre_id") REFERENCES "categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "libro" ADD CONSTRAINT "libro_editorial_id_fkey" FOREIGN KEY ("editorial_id") REFERENCES "editorial"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recurso_digital" ADD CONSTRAINT "recurso_digital_libro_id_fkey" FOREIGN KEY ("libro_id") REFERENCES "libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ejemplar" ADD CONSTRAINT "ejemplar_libro_id_fkey" FOREIGN KEY ("libro_id") REFERENCES "libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "libro_autor" ADD CONSTRAINT "libro_autor_libro_id_fkey" FOREIGN KEY ("libro_id") REFERENCES "libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "libro_autor" ADD CONSTRAINT "libro_autor_autor_id_fkey" FOREIGN KEY ("autor_id") REFERENCES "autor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "libro_categoria" ADD CONSTRAINT "libro_categoria_libro_id_fkey" FOREIGN KEY ("libro_id") REFERENCES "libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "libro_categoria" ADD CONSTRAINT "libro_categoria_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prestamo" ADD CONSTRAINT "prestamo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prestamo" ADD CONSTRAINT "prestamo_ejemplar_id_fkey" FOREIGN KEY ("ejemplar_id") REFERENCES "ejemplar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "multa" ADD CONSTRAINT "multa_prestamo_id_fkey" FOREIGN KEY ("prestamo_id") REFERENCES "prestamo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pago_multa" ADD CONSTRAINT "pago_multa_multa_id_fkey" FOREIGN KEY ("multa_id") REFERENCES "multa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva" ADD CONSTRAINT "reserva_libro_id_fkey" FOREIGN KEY ("libro_id") REFERENCES "libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resena" ADD CONSTRAINT "resena_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resena" ADD CONSTRAINT "resena_libro_id_fkey" FOREIGN KEY ("libro_id") REFERENCES "libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial" ADD CONSTRAINT "historial_hecho_por_fkey" FOREIGN KEY ("hecho_por") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorito" ADD CONSTRAINT "favorito_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorito" ADD CONSTRAINT "favorito_libro_id_fkey" FOREIGN KEY ("libro_id") REFERENCES "libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
