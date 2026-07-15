export interface Rol {
  id: string; // uuid
  nombre: 'admin' | 'bibliotecario' | 'estudiante' | 'docente';
  descripcion?: string;
  creadoEn: string; // timestamptz (ISO 8601)
}

export interface Usuario {
  id: string;
  rolId: string; // uuid -> rol.id
  nombre?: string;
  apellidos?: string;
  dni?: string;
  correo?: string;
  creadoEn: string;
}

export interface Autor {
  id: string; // uuid
  nombre?: string;
  apellidos: string;
  nacionalidad?: string;
  biografia?: string;
  fotoUrl?: string;
  fechaNacimiento?: string;
  creadoEn: string;
}
export interface Categoria {
  id: string; // uuid
  nombre: string;
  padreId?: string; // uuid -> categoria.id (autorreferencia)
  activa: boolean;
  creadoEn: string;
}
export interface Editorial {
  id: string; // uuid
  nombre?: string;
  pais?: string;
  creadoEn: string;
}
export interface Libro {
  id: string;
  titulo: string;
  isbn?: string;
  editorialId: string;
  anioPublicacion?: number;
  idioma?: string;
  fotoUrl?: string;
  descripcion?: string;
  busquedaFts?: string;
  publicado: boolean;
  creadoEn: string;
}

export interface RecursoDigital {
  id: string; // uuid
  libroId: string; // uuid -> libro.id
  tipo: 'pdf' | 'epub' | 'audiolibro' | 'video';
  url: string;
  formato?: 'pdf' | 'epub' | 'mp3' | 'mp4';
  tamanioMb?: number;
  duracionMinutos?: number; // solo para audiolibro
  tipoAcceso?: 'publico' | 'autenticado' | 'restringido';
  creadoEn: string;
}

export interface Ejemplar {
  id: string; // uuid
  libroId: string; // uuid -> libro.id
  codigoBarras: string;
  estado: 'disponible' | 'prestado' | 'perdido' | 'mantenimiento';
  ubicacion?: string; // ej: "Estante A-12"
  fechaAdquisicion?: string; // date
  creadoEn: string;
}

export interface LibroAutor {
  libroId: string; // uuid -> libro.id
  autorId: string; // uuid -> autor.id
}

export interface LibroCategoria {
  libroId: string; // uuid -> libro.id
  categoriaId: string; // uuid -> categoria.id
}

export interface Prestamo {
  id: string; // uuid
  usuarioId: string; // -> usuario.id
  ejemplarId: string; // uuid -> ejemplar.id
  fechaMaxDevolucion: string; // timestamptz
  fechaDevolucion?: string; // null = aún no devuelto
  estado: 'activo' | 'devuelto' | 'vencido';
  creadoEn: string;
}
export interface Multa {
  id: string; // uuid
  prestamoId: string; // uuid -> prestamo.id (unique)
  monto: number; // numeric(10,2)
  diasMora: number;
  estado: 'pendiente' | 'pagada' | 'perdonada';
  creadoEn: string;
}

export interface PagoMulta {
  id: string; // uuid
  multaId: string; // uuid -> multa.id
  montoPagado: number; // numeric(10,2)
  metodoPago: 'efectivo' | 'transferencia' | 'tarjeta';
  creadoEn: string;
}

export interface Reserva {
  id: string; // uuid
  usuarioId: string; // -> usuario.id
  libroId: string; // uuid -> libro.id
  ejemplarId: string; // uuid -> ejemplar.id
  fechaExpiracion: string; // timestamptz
  estado: 'pendiente' | 'activa' | 'cancelada' | 'completada';
  creadoEn: string;
}

export interface ConfiguracionMulta {
  id: string; // uuid
  tarifaDiaria: number; // numeric(10,2)
  diasMaxPrestamo: number;
  creadoEn: string;
}

export interface Resena {
  id: string; // uuid
  usuarioId: string; // -> usuario.id
  libroId: string; // uuid -> libro.id
  puntuacion?: number; // 1-5
  comentario?: string;
  creadoEn: string;
}
export interface Historial {
  id: string; // uuid
  nombreAccion: string;
  accion: string;
  hechoPor: string; // -> usuario.id
  modulo?: string;
  ipUsuario?: string;
  creadoEn: string;
}
export interface Favorito {
  id: string; // uuid
  usuarioId: string; // -> usuario.id
  libroId: string; // uuid -> libro.id
  creadoEn: string;
}
