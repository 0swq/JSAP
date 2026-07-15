// @ts-nocheck
export interface CrearMultaDto {
  prestamoId: string;
  monto: number;
  diasMora: number;
}

export interface ActualizarMultaDto {
  monto?: number;
  diasMora?: number;
  estado?: string;
}

export interface RespuestaMultaDto {
  id: string;
  prestamoId: string;
  monto: number;
  diasMora: number;
  estado: string;
  creadoEn: Date;
}
