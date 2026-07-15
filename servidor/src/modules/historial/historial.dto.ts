// @ts-nocheck
export interface CrearHistorialDto {
  nombreAccion: string;
  accion: string;
  hechoPorId: string;
  modulo?: string;
}

export interface RespuestaHistorialDto {
  id: string;
  nombreAccion: string;
  accion: string;
  hechoPorId: string;
  modulo: string | null;
  creadoEn: Date;
}
