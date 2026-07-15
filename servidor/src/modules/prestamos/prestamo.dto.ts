// @ts-nocheck
export interface CrearPrestamoDto {
  usuarioId: string;
  ejemplarId: string;
  fechaMaxDevolucion: Date;
}

export interface ActualizarPrestamoDto {
  fechaDevolucion?: Date;
  estado?: string;
}

export interface RespuestaPrestamoDto {
  id: string;
  usuarioId: string;
  ejemplarId: string;
  fechaMaxDevolucion: Date;
  fechaDevolucion: Date | null;
  estado: string;
  creadoEn: Date;
}
