// @ts-nocheck
export interface CrearResenaDto {
  usuarioId: string;
  libroId: string;
  puntuacion?: number;
  comentario?: string;
}

export interface ActualizarResenaDto {
  puntuacion?: number;
  comentario?: string;
}

export interface RespuestaResenaDto {
  id: string;
  usuarioId: string;
  libroId: string;
  puntuacion: number | null;
  comentario: string | null;
  creadoEn: Date;
}
