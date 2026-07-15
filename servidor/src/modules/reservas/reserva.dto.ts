// @ts-nocheck
export interface CrearReservaDto {
  usuarioId: string;
  libroId: string;
  ejemplarId: string;
  fechaExpiracion: Date;
}

export interface ActualizarReservaDto {
  fechaExpiracion?: Date;
  estado?: string;
}

export interface RespuestaReservaDto {
  id: string;
  usuarioId: string;
  libroId: string;
  ejemplarId: string;
  fechaExpiracion: Date;
  estado: string;
  creadoEn: Date;
}
