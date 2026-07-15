// @ts-nocheck
export interface CrearLibroDto {
  titulo: string;
  isbn?: string;
  editorialId: string;
  anioPublicacion?: number;
  idioma?: string;
  publicado?: boolean;
  descripcion?: string;
  fotoUrl?: string;
}

export interface ActualizarLibroDto {
  titulo?: string;
  isbn?: string;
  editorialId?: string;
  anioPublicacion?: number;
  idioma?: string;
  publicado?: boolean;
  descripcion?: string;
  fotoUrl?: string;
}

export interface RespuestaLibroDto {
  id: string;
  titulo: string;
  isbn: string | null;
  editorialId: string;
  anioPublicacion: number | null;
  idioma: string | null;
  publicado: boolean;
  descripcion: string | null;
  fotoUrl: string | null;
  creadoEn: Date;
}
